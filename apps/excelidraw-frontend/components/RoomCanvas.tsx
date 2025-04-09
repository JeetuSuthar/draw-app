// "use client";
// import { useEffect,  useState } from "react"
// import { WS_URL } from "@/config";
// import { Canvas } from "./Canvas";
// import dynamic from "next/dynamic";

// const GridLoader = dynamic(() => import("react-spinners").then((mod) => mod.GridLoader), {
//   ssr: false,
// });

// interface params{
//     roomId : string 
// }

// export default function RoomCanvas(props : params){
//     const [socket,setSocket]=useState<WebSocket>();
//     const [loading, setLoading]=useState(false)
//     useEffect(()=>{

//         const token=localStorage.getItem('token');
//         console.log("This is the JWT token here ",token)
//         const ws= new WebSocket(`${WS_URL}?token=${token}`);
//         console.log(ws)
//         setSocket(ws);
//         ws.onopen=()=>{

//             ws.send(JSON.stringify({
//                 type : "join_room",
//                 roomId : props.roomId
//             }))
//         }
       
//     },[]);

//     if(!socket){
//         return <div className="flex justify-center items-center h-screen">
//             <GridLoader  color="#ffffff" size={30} />
//         </div>
//     }

//     return <div>
        
//         <Canvas roomId={props.roomId} socket={socket} />
//     </div>
// }

"use client";
import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
import dynamic from "next/dynamic";

const GridLoader = dynamic(
  () => import("react-spinners").then((mod) => mod.GridLoader),
  {
    ssr: false,
  }
);

interface Params {
  roomId: string;
}

export default function RoomCanvas(props: Params) {
  const [socket, setSocket] = useState<WebSocket>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    setSocket(ws);

    ws.onopen = () => {
      setLoading(false);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: props.roomId,
        })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };

    return () => {
      ws.close();
    };
  }, [props.roomId]);

  if (loading || !socket) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GridLoader color="#ffffff" size={30} />
      </div>
    );
  }

  return (
    <div>
      <Canvas roomId={props.roomId} socket={socket} />
    </div>
  );
}
