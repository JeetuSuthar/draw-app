import { Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

export const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "7d",
    });
  
    res.cookie("collabodraw_jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true, 
      sameSite: "lax", 
      secure: true,
    });
  
    return token;
};

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createObjectDrawingPrompt(objectName: string, roomId: string, userId: string): string {
  return `You are a drawing assistant that converts object names into drawing coordinates. 
  Given the object "${objectName}", create a simple but recognizable visual representation using basic shapes.
  
  CRITICAL REQUIREMENTS:
  1. Return ONLY a valid JSON array of shape objects
  2. No explanations, no additional text, no markdown formatting
  3. No trailing commas in JSON
  4. All strings must be properly quoted
  5. JSON must be complete and properly closed
  
  TOOL SELECTION GUIDELINES:
  - Use PENCIL tool for organic shapes, curves, irregular forms, or when freehand drawing is more natural
  - Use geometric shapes (rectangle, circle, line, arrow, diamond) for structured, angular, or simple geometric forms
  - Consider using PENCIL for: animals, plants, human figures, natural objects, complex curves, handwriting-style elements
  - Consider using geometric shapes for: buildings, furniture, vehicles, simple icons, technical diagrams
  - You can combine both approaches - use geometric shapes for structure and PENCIL for details
  
  Each shape must have this EXACT structure:

  RECTANGLE:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "rectangle",
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  CIRCLE:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "circle",
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent", 
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  LINE:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "line",
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  ARROW:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "arrow",
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  DIAMOND:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "diamond",
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  PENCIL (for freehand drawing):
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "pencil",
    "startX": 0,
    "startY": 0,
    "width": 0,
    "height": 0,
    "points": [
      {"x": number, "y": number},
      {"x": number, "y": number},
      {"x": number, "y": number}
    ],
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  TEXT:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "text",
    "startX": number,
    "startY": number,
    "width": 0,
    "height": 0,
    "text": "display_text",
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  PENCIL DRAWING GUIDELINES:
  - Create smooth, connected paths with adequate point density (15-30 points for simple curves)
  - Ensure points flow naturally to create recognizable shapes
  - For complex objects, use multiple PENCIL shapes for different parts
  - Points should be close enough to create smooth curves when connected
  - Consider the drawing direction and flow for natural-looking results

  STRICT REQUIREMENTS:
  - Canvas size: 800x600 pixels (startX: 0-800, startY: 0-600)
  - Use 3-8 shapes for clear object recognition (may need more for complex PENCIL drawings)
  - Ensure shapes are well-proportioned and centered around startX=400, startY=300
  - Make the object easily identifiable
  - Position shapes to create a cohesive representation
  - Choose the most appropriate tool for each part of the object
  - For LINE/ARROW: width/height represent delta from start to end point
  - For CIRCLE: width and height should be equal for perfect circles
  - Do not generate duplicate shapes:
    * Avoid rectangles with the same startX, startY, width, and height
    * Avoid circles with the same startX, startY, width, and height
    * Avoid lines/arrows with the same startX, startY, width, height
    * Avoid duplicate TEXT with same content and position
    * Each shape must be uniquely placed and contribute visually

  Example for "house":
  [
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "rectangle",
      "startX": 300,
      "startY": 300,
      "width": 200,
      "height": 150,
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "house_main"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "line",
      "startX": 300,
      "startY": 300,
      "width": 100,
      "height": -100,
      "strokeStyle": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "roof_left"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "line",
      "startX": 400,
      "startY": 200,
      "width": 100,
      "height": 100,
      "strokeStyle": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "roof_right"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "rectangle",
      "startX": 375,
      "startY": 380,
      "width": 50,
      "height": 70,
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "door"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "rectangle",
      "startX": 320,
      "startY": 330,
      "width": 40,
      "height": 30,
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "window"
    }
  ]

  REMEMBER: Return ONLY the JSON array for "${objectName}". No other text. Ensure JSON is valid and complete.`;
}

export function createFlowchartPrompt(flowchartDescription: string, roomId: string, userId: string): string {
  return `You are a flowchart assistant that converts step descriptions into visual flowchart coordinates.
  Given the description "${flowchartDescription}", create a clear and well-structured flowchart using appropriate shapes and connections.

  CRITICAL REQUIREMENTS:
  1. Return ONLY a valid JSON array of shape objects
  2. No explanations, no additional text, no markdown formatting
  3. No trailing commas in JSON
  4. All strings must be properly quoted
  5. JSON must be complete and properly closed

  EXPAND THE FLOW:
  - Thoroughly decompose the process into 8–15 logical steps wherever possible.
  - If the input is short or vague, infer intermediate steps that improve clarity.
  - Avoid skipping common intermediate steps (e.g., validations, confirmations, transitions).
  - Never return fewer than 8 shapes (including text, arrows, and start/end nodes).

  FLOWCHART DESIGN GUIDELINES:
  - Parse the input to identify individual steps/processes
  - If input format is "step1-step2-step3", treat each as sequential process steps
  - If input is descriptive (e.g., "create a flowchart of request-response cycle in API"), break it down into logical steps
  - Use appropriate flowchart symbols:
    * rectangle for process steps
    * circle for start/end points
    * diamond for decision points
    * arrow for flow direction
    * text for labels and descriptions

  FLOWCHART LAYOUT PRINCIPLES:
  - Start from top (startY=80-100) and flow downward
  - Maintain consistent spacing (80-100 pixels between steps vertically)
  - Center elements horizontally around startX=400 (canvas center)
  - Use standard flowchart proportions (rectangles: 160 width, 60 height)
  - Ensure arrows clearly show flow direction
  - Add proper labels for each step using text elements

  Each shape must have this EXACT structure:

  RECTANGLE:
  {
    "roomId": "${roomId}",
    "userId": "${userId}", 
    "type": "rectangle",
    "startX": number,
    "startY": number, 
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  CIRCLE:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "circle", 
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  DIAMOND:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "diamond", 
    "startX": number,
    "startY": number,
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  ARROW:
  {
    "roomId": "${roomId}", 
    "userId": "${userId}",
    "type": "arrow",
    "startX": number, 
    "startY": number, 
    "width": number,
    "height": number,
    "strokeStyle": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  TEXT:
  {
    "roomId": "${roomId}",
    "userId": "${userId}",
    "type": "text",
    "startX": number,
    "startY": number,
    "width": 0,
    "height": 0,
    "text": "step_description",
    "strokeStyle": "#ffffff",
    "strokeFill": "transparent",
    "strokeWidth": 2,
    "stStyle": "solid",
    "chatId": "${generateUniqueId()}"
  }

  FLOWCHART CONSTRUCTION RULES:
  - Always start with a START circle
  - End with an END circle (if process has a clear end)
  - Each process step gets a rectangle with descriptive text
  - Connect all elements with arrows showing flow direction
  - Keep text concise but descriptive
  - Ensure proper alignment and spacing
  - Center text within shapes using proper positioning
  - If the flowchart has fewer than 8 shapes, infer additional steps and repeat generation

  TEXT POSITIONING FOR FLOWCHART SHAPES:
  - For rectangle: startX = rectangle.startX + (rectangle.width / 2) - (estimated text width / 2), startY = rectangle.startY + (rectangle.height / 2)
  - For circle: startX = circle.startX + (circle.width / 2) - (estimated text width / 2), startY = circle.startY + (circle.height / 2)

  ARROW POSITIONING:
  - For vertical connections: width = 0, height = distance between shapes
  - For horizontal connections: width = distance between shapes, height = 0
  - startX and startY should be the connection point of the previous shape

  STRICT REQUIREMENTS:
  - Canvas size: 800x600 pixels (startX: 0-800, startY: 0-600)
  - You MUST generate a minimum of 8 and up to 15 shapes depending on complexity
  - Ensure clear visual hierarchy and flow
  - Make the flowchart easy to follow from top to bottom
  - Position elements to avoid overlapping
  - Use consistent sizing for similar elements
  - Do not generate duplicate shapes

  PARSING GUIDELINES:
  - If input contains hyphens (-), treat as sequential steps: "step1-step2-step3"
  - If input is descriptive, extract key processes and create logical flow
  - For complex processes, include decision points where appropriate
  - Always maintain a clear START point
  - Use meaningful, concise labels for each step

  Example for "login-validate-redirect":
  [
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "circle",
      "startX": 360,
      "startY": 55,
      "width": 80,
      "height": 50,
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "start_node"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "text",
      "startX": 385,
      "startY": 80,
      "width": 0,
      "height": 0,
      "text": "START",
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "start_text"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "arrow",
      "startX": 400,
      "startY": 105,
      "width": 0,
      "height": 75,
      "strokeStyle": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "arrow_1"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "rectangle",
      "startX": 320,
      "startY": 180,
      "width": 160,
      "height": 60,
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "login_step"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "text",
      "startX": 375,
      "startY": 210,
      "width": 0,
      "height": 0,
      "text": "User Login",
      "strokeStyle": "#ffffff",
      "strokeFill": "transparent",
      "strokeWidth": 2,
      "stStyle": "solid",
      "chatId": "login_text"
    }
  ]

  REMEMBER: Return ONLY the JSON array for "${flowchartDescription}". No other text. Ensure JSON is valid and complete.`;
}