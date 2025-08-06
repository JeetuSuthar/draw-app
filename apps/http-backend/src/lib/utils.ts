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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "obj_${Math.random().toString(36).substr(2, 9)}"
  }

  PENCIL DRAWING GUIDELINES:
  - Create smooth, connected paths with adequate point density (15-30 points for simple curves)
  - Ensure points flow naturally to create recognizable shapes
  - For complex objects, use multiple PENCIL shapes for different parts
  - Points should be close enough to create smooth curves when connected
  - Consider the drawing direction and flow for natural-looking results

  POSITIONING AND SIZE GUIDELINES:
  - Canvas size: 800x600 pixels (startX: 0-800, startY: 0-600)
  - Center objects around startX=400, startY=300
  - Use appropriate proportions for recognizable shapes
  - For CIRCLE: width and height should be equal for perfect circles
  - For LINE/ARROW: width/height represent delta from start to end point
  - Make shapes large enough to be clearly visible (minimum 20px dimension)
  - Leave adequate spacing between shape components

  ACCURACY REQUIREMENTS:
  - Use 4-10 shapes for clear object recognition
  - Ensure shapes are well-proportioned and positioned logically
  - Make the object easily identifiable at first glance
  - Choose the most appropriate shape type for each component
  - Avoid overlapping shapes unless intentional for the design
  - Consider real-world proportions and relationships between parts

  SHAPE COMBINATION STRATEGY:
  - Start with the main body/structure using geometric shapes
  - Add details and organic elements using PENCIL tool
  - Use TEXT for labels or essential written elements
  - Layer shapes logically (background to foreground)

  STRICT REQUIREMENTS:
  - Always use strokeStyle "#ffffff"
  - Always use strokeFill "transparent" unless specifically needed for solid fills
  - Always use strokeWidth 2
  - Always use stStyle "solid"
  - Generate unique chatId for each shape using the format shown
  - Do not generate duplicate shapes with identical properties
  - Each shape must contribute meaningfully to the overall representation

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
      "chatId": "obj_abc123def"
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
      "chatId": "obj_def456ghi"
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
      "chatId": "obj_ghi789jkl"
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
      "chatId": "obj_jkl012mno"
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
      "chatId": "obj_mno345pqr"
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
  - Thoroughly decompose the process into 8–15 logical steps wherever possible
  - If the input is short or vague, infer intermediate steps that improve clarity
  - Avoid skipping common intermediate steps (e.g., validations, confirmations, transitions)
  - Never return fewer than 8 shapes (including text, arrows, and start/end nodes)

  FLOWCHART DESIGN GUIDELINES:
  - Parse the input to identify individual steps/processes
  - If input format is "step1-step2-step3", treat each as sequential process steps
  - If input is descriptive, break it down into logical steps
  - Use appropriate flowchart symbols:
    * RECTANGLE for process steps
    * CIRCLE for start/end points
    * DIAMOND for decision points
    * ARROW for flow direction
    * TEXT for labels and descriptions

  FLOWCHART LAYOUT PRINCIPLES:
  - Start from top (startY=80-100) and flow downward
  - Maintain consistent spacing (80-100 pixels between steps vertically)
  - Center elements horizontally around startX=400 (canvas center)
  - Use standard flowchart proportions (rectangles: 160 width, 60 height)
  - Ensure arrows clearly show flow direction
  - Position text elements centered within or near their associated shapes

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
    "chatId": "flow_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "flow_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "flow_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "flow_${Math.random().toString(36).substr(2, 9)}"
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
    "chatId": "flow_${Math.random().toString(36).substr(2, 9)}"
  }

  FLOWCHART CONSTRUCTION RULES:
  - Always start with a START circle at the top
  - End with an END circle (if process has a clear end)
  - Each process step gets a rectangle with descriptive text positioned inside or nearby
  - Use diamonds for decision points with YES/NO branches
  - Connect all elements with arrows showing flow direction
  - Keep text concise but descriptive
  - Ensure proper alignment and spacing
  - Position text to be readable and associated with correct shapes

  TEXT POSITIONING GUIDELINES:
  - For RECTANGLE: position text at startX + (width/2) - (estimated text width/2), startY + (height/2)
  - For CIRCLE: position text at startX + (width/2) - (estimated text width/2), startY + (height/2)
  - For DIAMOND: position text at startX + (width/2) - (estimated text width/2), startY + (height/2)
  - Adjust positioning to ensure text doesn't overlap with shape borders

  ARROW POSITIONING:
  - For vertical flow: startX should align with shape centers, width=0, height=distance
  - For horizontal flow: startY should align with shape centers, width=distance, height=0
  - Arrows connect the bottom of one shape to the top of the next

  STRICT REQUIREMENTS:
  - Canvas size: 800x600 pixels (startX: 0-800, startY: 0-600)
  - ALL shapes must use strokeStyle "#ffffff"
  - ALL shapes must use strokeFill "transparent" 
  - ALL shapes must use strokeWidth 2
  - ALL shapes must use stStyle "solid"
  - Generate unique chatId for each shape
  - You MUST generate a minimum of 8 and up to 15 shapes depending on complexity
  - Ensure clear visual hierarchy and flow
  - Make the flowchart easy to follow from top to bottom
  - Position elements to avoid overlapping
  - Use consistent sizing for similar elements

  PARSING GUIDELINES:
  - If input contains hyphens (-), treat as sequential steps: "step1-step2-step3"
  - If input is descriptive, extract key processes and create logical flow
  - For complex processes, include decision points where appropriate
  - Always maintain a clear START point
  - Use meaningful, concise labels for each step

  REMEMBER: Return ONLY the JSON array for "${flowchartDescription}". No other text. Ensure JSON is valid and complete.`;
}