import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData;
    })

    return shapes;
}

// import axios from "axios";
// import dotenv from 'dotenv';
// dotenv.config();
// import { BACKEND_URL } from "@/config";

// export async function getExistingShapes(roomId: number | string) {
//     const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
//     const messages = response.data.message;
//     const shapes = messages.map((x: { message: string }) => {
//         const messageData = JSON.parse(x.message);
//         return messageData;
//     });

//     return shapes;
// }