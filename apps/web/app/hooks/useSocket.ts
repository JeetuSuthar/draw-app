import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkY2M0YWM4Yi1jOWNhLTRlN2MtYTZlZi0yZDFkMjFkYjMwOGUiLCJpYXQiOjE3Mzg0MTI4Nzd9.WL2FUqGKcsm6Lh5R-BZqqGM5_LSLjIsGqX5Oxy2xoBA`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}