import { prismaClient } from "@repo/db/client"; 
import "dotenv/config";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
console.log("JWT is here");

const wss = new WebSocketServer({ port: 8080 });
console.log("WSS");

interface Message {
    message: string,  
    roomId: string,
    userId: string
}

interface ConnectedUser {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const UserArr: ConnectedUser[] = [];

function authenticateUser(token: string): string | null {
    console.log("inside authenticator");
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded", decoded);
        if (typeof decoded == "string") return null;
        if (!decoded || !decoded.userId) return null;
        console.log("decoded user id ", decoded.userId);
        return decoded.userId;
    } catch(e) {
        console.log("Error is here", e);
        return null;
    }
}

console.log("Making connection");
wss.on('connection', function connection(ws, request) {
    console.log("Server is up");
    const url = request.url;
    
    console.log("URL IS ", url);
    if (!url) return;
    
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ?? "";
    const userAuthentication = authenticateUser(token);
    console.log("Outside the userAuth");
    if(userAuthentication == null) {
        console.log("Inside userAuth");
        ws.close();
        return;
    }
    
    UserArr.push({
        ws: ws,
        rooms: [],
        userId: userAuthentication
    });

    ws.on('message', async function message(data) {
        try {
            const parsedData = JSON.parse(data as unknown as string);
            if(parsedData.type === 'clear') {
                console.log('Clearing Request');
                const roomId = parsedData.roomId;
                await prismaClient.chat.deleteMany({
                    where: {
                        roomId: roomId
                    }
                });
                UserArr.forEach(user => {
                    if(user.rooms.includes(String(roomId))) {
                        user.ws.send(JSON.stringify({
                            type: "clear"
                        }));
                    }
                });
            }
            else if (parsedData.type === 'join_room') {
                const roomId = parsedData.roomId;
                const user = UserArr.find(x => x.ws === ws);
                if (!user) return;
            
                // Ensure the user only joins the room once
                if (!user.rooms.includes(roomId)) {
                    user.rooms.push(roomId);
                }
            
                // Get the unique user IDs in the room
                const usersInRoom = Array.from(new Set(UserArr
                    .filter(u => u.rooms.includes(roomId))
                    .map(u => u.userId)
                ));
            
                // Fetch the "name" field from the database (which will be mapped to username)
                const usersInRoomWithNames = await prismaClient.user.findMany({
                    where: {
                        id: { in: usersInRoom }
                    },
                    select: {
                        id: true,
                        name: true
                    }
                });
            
                // Create a mapping from userId to user's name
                const userIdToNameMap = usersInRoomWithNames.reduce((acc, userFromDB) => {
                    if (userFromDB.name !== null) {
                        acc[userFromDB.id] = userFromDB.name;
                    }
                    return acc;
                }, {} as Record<string, string>);
                
            
                // Map the user IDs to their names for the user list
                const usersInRoomWithNamesList = usersInRoom.map(userId => userIdToNameMap[userId]);
            
                // Emit the user list to all users in the room
                UserArr.forEach(u => {
                    if (u.rooms.includes(roomId)) {
                        u.ws.send(JSON.stringify({
                            type: "user-list",
                            roomId: roomId,
                            users: usersInRoomWithNamesList
                        }));
                    }
                });
            
                // Emit a user-joined notification to others in the room (include the username)
                UserArr.forEach(u => {
                    if (u.ws !== ws && u.rooms.includes(roomId)) {
                        u.ws.send(JSON.stringify({
                            type: "user-joined",
                            roomId: roomId,
                            userId: user.userId, // Still sending userId if needed
                            username: userIdToNameMap[user.userId]  // This is the user's name from the database
                        }));
                    }
                });
            }
            else if(parsedData.type === 'leave_room') {
                const user = UserArr.find(x => x.ws === ws);
                if (!user) return;
                user.rooms = user.rooms.filter(id => id !== parsedData.roomId);
            }
            else if(parsedData.type === 'chat') {
                const roomId = parsedData.roomId;
                const message = parsedData.shape;
                await prismaClient.chat.create({
                    data: {
                        message: JSON.stringify(message),
                        userId: userAuthentication,
                        roomId: roomId,
                    }
                });
                UserArr.forEach(user => {
                    if(user.rooms.includes(String(roomId))) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId: roomId,
                        }));
                    }
                });
            }
            else if(parsedData.type === 'eraser') {
                const chatId = parsedData.chatId;
                const roomId = parsedData.roomId;
                if(chatId != undefined) {
                    const Id = await prismaClient.chat.findFirst({
                        where: {
                            roomId: roomId,
                            message: {
                                contains: JSON.stringify(chatId)
                            }
                        }
                    });
                    if(Id) {
                        await prismaClient.chat.delete({
                            where: {
                                id: Number(Id.id)
                            }
                        });
                        UserArr.forEach(user => {
                            if(user.rooms.includes(String(roomId))) {
                                user.ws.send(JSON.stringify({
                                    type: "eraser",
                                    chatId: chatId,
                                    roomId: roomId,
                                }));
                            }
                        });
                    }
                }
            }
            else if (parsedData.type === 'select') {
                const roomId = parsedData.roomId;
                const chatId = parsedData.chatId;
                const shape = parsedData.shape;
                if(chatId != undefined) {
                    const Id = await prismaClient.chat.findFirst({
                        where: {
                            roomId: roomId,
                            message: {
                                contains: JSON.stringify(chatId)
                            }
                        }
                    });
                    if(Id) {
                        await prismaClient.chat.update({
                            where: {
                                id: Number(Id.id)
                            },
                            data: {
                                message: JSON.stringify(shape)
                            }
                        });
                        UserArr.forEach(user => {
                            if(user.rooms.includes(String(roomId))) {
                                user.ws.send(JSON.stringify({
                                    type: "select",
                                    chatId: chatId,
                                    roomId: roomId,
                                    shape: shape
                                }));
                            }
                        });
                    }
                }
            }
            else if(parsedData.type === 'pan') {
                const roomId = parsedData.roomId;
                const existingShapes = parsedData.existingShapes;
                UserArr.forEach(user => {
                    if(user.rooms.includes(String(roomId))) {
                        user.ws.send(JSON.stringify({
                            type: "pan",
                            existingShapes: existingShapes   
                        }));
                    }
                });
            }
            else if(parsedData.type === 'updatePan') {
                const roomId = parsedData.roomId;
                const shapes = parsedData.shapes;
                for(let i = 0; i < shapes.length; i++) { 
                    const shape = shapes[i];
                    const existingRecord = await prismaClient.chat.findFirst({
                        where: { 
                            roomId: roomId,
                            message: { contains: `"chatId":"${shape.chatId}"` } 
                        }
                    });
            
                    if (existingRecord) {
                        console.log(existingRecord);
                        await prismaClient.chat.update({
                            where: { id: existingRecord.id }, 
                            data: { message: JSON.stringify(shape) }
                        });
                    } else {
                        console.log(`Shape with chatId ${shape.chatId} not found in DB`);
                    }
                }
                UserArr.forEach(user => {
                    if(user.rooms.includes(String(roomId))) {
                        user.ws.send(JSON.stringify({
                            type: "updatePan",
                        }));
                    }
                });
            }
        } catch(e) {
            console.error("Error handling message:", e);
            ws.send(JSON.stringify({ error: "Invalid request format" }));
        }
    });
});
