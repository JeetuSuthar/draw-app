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
    "strokeFill": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid"
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
    "strokeFill": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid"
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
    "stStyle": "solid"
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
    "stStyle": "solid"
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
    "strokeFill": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid"
  }

  STRICT REQUIREMENTS:
  - Canvas size: 800x600 pixels (startX: 0-800, startY: 0-600)
  - ALL shapes must use strokeStyle and strokeFill "#ffffff" 
  - Use strokeWidth: 2 and stStyle: "solid" for all shapes
  - Use 3-8 shapes for clear object recognition
  - Ensure shapes are well-proportioned and centered
  - Make the object easily identifiable
  - Position shapes to create a cohesive representation
  - For LINE and ARROW: width and height represent the delta from startX,startY to the end point
  - For CIRCLE: width and height should be equal (diameter)
  - Do not generate duplicate shapes

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
      "strokeFill": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid"
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
      "stStyle": "solid"
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
      "stStyle": "solid"
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
      "strokeFill": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid"
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
      "strokeFill": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid"
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
    "strokeFill": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid"
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
    "strokeFill": "#ffffff",
    "strokeWidth": 2,
    "stStyle": "solid"
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
    "stStyle": "solid"
  }

  FLOWCHART LAYOUT PRINCIPLES:
  - Start from top (startY=80-100) and flow downward
  - Maintain consistent spacing (80-100 pixels between steps vertically)
  - Center elements horizontally around startX=320-400 (canvas center)
  - Use standard flowchart proportions (rectangles: 160 width, 60 height)
  - Ensure arrows clearly show flow direction
  - For ARROW: width and height represent the delta from startX,startY to the end point

  STRICT REQUIREMENTS:
  - Canvas size: 800x600 pixels (startX: 0-800, startY: 0-600)
  - ALL shapes must use strokeStyle and strokeFill "#ffffff"
  - Use strokeWidth: 2 and stStyle: "solid" for all shapes
  - Generate minimum 8 shapes for a complete flowchart
  - Ensure clear visual hierarchy and flow
  - Make the flowchart easy to follow from top to bottom

  Example for "login-validate-redirect":
  [
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "circle",
      "startX": 360,
      "startY": 60,
      "width": 80,
      "height": 80,
      "strokeStyle": "#ffffff",
      "strokeFill": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid"
    },
    {
      "roomId": "${roomId}",
      "userId": "${userId}",
      "type": "arrow",
      "startX": 400,
      "startY": 140,
      "width": 0,
      "height": 40,
      "strokeStyle": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid"
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
      "strokeFill": "#ffffff",
      "strokeWidth": 2,
      "stStyle": "solid"
    }
  ]

  REMEMBER: Return ONLY the JSON array for "${flowchartDescription}". No other text. Ensure JSON is valid and complete.`;
}
