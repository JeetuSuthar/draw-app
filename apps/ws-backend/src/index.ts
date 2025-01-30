import { WebSocket, WebSocketServer } from 'ws';  // Import WebSocket libraries
import jwt from "jsonwebtoken"; // Import JWT for authentication
import { JWT_SECRET } from '@repo/backend-common/config'; // JWT secret key
import { prismaClient } from "@repo/db/client"; // Prisma client for database interaction

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Define user structure: each user has a WebSocket, list of rooms, and userId
interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = []; // Store all connected users

// Function to verify JWT token and extract user ID
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    if (typeof decoded === "string" || !decoded || !decoded.userId) {
      return null; // Invalid token
    }
    return decoded.userId; // Return extracted userId
  } catch (e) {
    return null; // If token is invalid or expired
  }
}

// Handle WebSocket connections
wss.on('connection', function connection(ws, request) {
  const url = request.url; // Get URL of the request
  if (!url) return;

  // Extract token from URL query parameters
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token); // Verify token

  // If token is invalid, close connection
  if (userId == null) {
    ws.close();
    return;
  }

  // Add the user to the list of connected users
  users.push({ userId, rooms: [], ws });

  // Handle incoming messages from clients
  ws.on('message', async function message(data) {
    let parsedData;
    try {
      parsedData = JSON.parse(typeof data === "string" ? data : data.toString());
    } catch (e) {
      return; // Ignore invalid JSON
    }

    // User joins a room
    if (parsedData.type === "join_room") {
      const user = users.find(u => u.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    // User leaves a room
    if (parsedData.type === "leave_room") {
      const user = users.find(u => u.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter(room => room !== parsedData.roomId);
    }

    // User sends a chat message
    if (parsedData.type === "chat") {
      const { roomId, message } = parsedData;

      // Save message to the database
      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        }
      });

      // Broadcast message to all users in the same room
      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({ type: "chat", message, roomId }));
        }
      });
    }
  });
});
