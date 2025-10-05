import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware.js";
import { CreateUserSchema, SigninSchema, CreateRoomSchema, drawingSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { createFlowchartPrompt, createObjectDrawingPrompt, generateUniqueId } from "./lib/utils.js"
import axios from "axios"
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      const allowedOrigins = ["https://collabdraw-hes1.onrender.com", "http://localhost:3000"];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.post("/signup", async (req, res) => {

  const parsedData = CreateUserSchema.safeParse(req.body);
  // console.log(parsedData)
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Incorrect inputs"
    })
    return;
  }
  try {
    console.log("In try")
    console.log(parsedData.success);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        // TODO: Hash the pw
        password: parsedData.data.password,
        name: parsedData.data.name
      }


    })





    res.json({
      userId: user.id
    })


  } catch (e) {

    res.status(411).json({
      message: "User already exists with this username"
    })
  }
})

app.post("/signin", async (req, res) => {

  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs"
    })
    return;
  }
  // TODO: Compare the hashed pws here
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password
    }
  })
  if (!user) {
    res.status(403).json({
      message: "Not authorized"
    })
    return;
  }


  const token = jwt.sign({ userId: user?.id }, JWT_SECRET);

  res.json({
    token
  })
})
app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs"
    })
    return;
  }

  const userId = req.userId;

  try {
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: userId missing" });
      return;
    }
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId
      }
    })

    res.json({
      roomId: room.id
    })
  } catch (e) {
    res.status(411).json({
      message: "Room already exists with this name"
    })
  }
})

app.get('/chats/:roomId', async (req, res) => {

  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId
      },
      orderBy: {
        id: "desc"
      },
      take: 50
    })
    res.json({
      messages
    })
  } catch (e) {
    console.log(e)
  }
})
app.get('/rooms', middleware, async (req, res) => {

  const userId = req.userId;

  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId
      },
      select: {
        id: true,
        slug: true
      }
    });

    res.json({ rooms });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug
    }
  });

  res.json({
    room
  })
})
app.post("/generate-drawing", middleware, async (req, res) => {

  try {
    const body = req.body;
    const zodResponse = drawingSchema.safeParse(body);

    if (!zodResponse.success) {
      res.status(401).json({
        msg: "Invalid inputs"
      });
      console.error("Zod error: ", zodResponse.error);
      return;
    }

    let { type, content, roomId } = zodResponse.data;

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: userId missing" });
      return;
    }
    const roomIdNumber = Number(roomId);
    if (isNaN(roomIdNumber)) {
      res.status(400).json({ msg: "Invalid roomId" });
      return;
    }

    const checkRoom = await prismaClient.room.findUnique({
      where: {
        id: roomIdNumber
      }
    });

    if (!checkRoom) {
      res.status(401).json({
        msg: "Room not found"
      });
      return;
    }

    // const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyDYxm3vXOEpyiXryMHAMctxmpQfcQCdUrE";
    // console.log(geminiApiKey)
    // if (!geminiApiKey) {
    //   res.status(500).json({ msg: "Missing API key" });
    //   return;
    // }

    // const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;


    if (type === "OBJECT") {
      if (!userId) {
        res.status(401).json({ message: "Unauthorized: userId missing" });
        return;
      }
      const prompt = createObjectDrawingPrompt(content, roomId, userId);
      const response = await axios.post(geminiUrl, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        }
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      const cleanedResponse = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      let shapesArray;
      try {
        shapesArray = JSON.parse(cleanedResponse);
      } catch (err) {
        const match = cleanedResponse.match(/\[.*\]/s);
        if (match) {
          try {
            shapesArray = JSON.parse(match[0]);
          } catch (e) {
            throw new Error("Response is not valid JSON array");
          }
        } else {
          throw new Error("Response is not valid JSON array");
        }
      }

      if (!Array.isArray(shapesArray)) {
        throw new Error("Response is not an array");
      }

      const seen = new Set();
      const processedShapes = shapesArray.filter((shape: any) => {
        const dedupeKey = JSON.stringify({
          type: shape.type,
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          radiusX: shape.radiusX,
          radiusY: shape.radiusY,
          textContent: shape.textContent,
          points: shape.points
        });

        if (seen.has(dedupeKey)) return false;
        seen.add(dedupeKey);
        return true;
      }).map((shape: any) => ({
        ...shape,
        id: shape.id || generateUniqueId(),
        roomId: shape.roomId || roomId,
        userId: shape.userId || userId
      }));

      res.status(200).json({
        result: processedShapes,
        originalPrompt: content
      });
    } else if (type === "FLOWCHART") {
      const MAX_TOTAL_SHAPES = 30;
      const CHUNK_SIZE = 5;
      const MAX_ITER = 10;

      let allShapes: any[] = [];
      let done = false;
      let iter = 0;

      while (!done && allShapes.length < MAX_TOTAL_SHAPES && iter < MAX_ITER) {
        const prompt =
          createFlowchartPrompt(content, roomId, userId) +
          (
            allShapes.length > 0
              ? `\n\nHere are the shapes generated so far:\n${JSON.stringify(allShapes, null, 2)}\nContinue the flowchart by generating the next ${CHUNK_SIZE} shapes. Do not repeat any previous shapes. Return ONLY a valid JSON array of the next shapes. If finished, return [].`
              : `\n\nStart the flowchart by generating the first ${CHUNK_SIZE} shapes. Return ONLY a valid JSON array of shapes.`
          ) +
          `\nIMPORTANT: Return ONLY a valid JSON array of shapes. No explanations, no markdown, no extra text. If there are no more shapes, return [].`;

        const response = await axios.post(
          geminiUrl,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2048,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const resultText =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        const cleanedResponse = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let shapesArray: any[] = [];
        try {
          shapesArray = JSON.parse(cleanedResponse);
        } catch (err) {
          const match = cleanedResponse.match(/\[[\s\S]*\]/);
          if (match) {
            try {
              shapesArray = JSON.parse(match[0]);
            } catch (e) {
              throw new Error("Response is not valid JSON array");
            }
          } else {
            throw new Error("Response is not valid JSON array");
          }
        }

        if (!Array.isArray(shapesArray) || shapesArray.length === 0) {
          done = true;
          break;
        }

        const seen = new Set(
          allShapes.map((shape) =>
            JSON.stringify({
              type: shape.type,
              x: shape.x,
              y: shape.y,
              width: shape.width,
              height: shape.height,
              radiusX: shape.radiusX,
              radiusY: shape.radiusY,
              textContent: shape.textContent,
              points: shape.points,
            })
          )
        );
        const newShapes = shapesArray.filter((shape: any) => {
          const dedupeKey = JSON.stringify({
            type: shape.type,
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            radiusX: shape.radiusX,
            radiusY: shape.radiusY,
            textContent: shape.textContent,
            points: shape.points,
          });
          if (seen.has(dedupeKey)) return false;
          seen.add(dedupeKey);
          return true;
        });

        allShapes = allShapes.concat(
          newShapes.map((shape: any) => ({
            ...shape,
            id: shape.id || generateUniqueId(),
            roomId: shape.roomId || roomId,
            userId: shape.userId || userId,
          }))
        );

        if (newShapes.length < CHUNK_SIZE) {
          done = true;
        }
        iter++;
      }

      res.status(200).json({
        result: allShapes,
        originalPrompt: content,
      });
    }
  } catch (error: any) {
    console.error("Error while generating:", error?.response?.data || error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error?.response?.data || error.message,
    });
  }
});

app.listen(3001);