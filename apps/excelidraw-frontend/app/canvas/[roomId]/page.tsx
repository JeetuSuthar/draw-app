import { RoomCanvas } from "@/components/RoomCanvas";

type PageProps = {
    params: { roomId: string };
};

export default function CanvasPage({ params }:any) {
    const roomId = (params as any).roomId;  // Cast `params` to `any` here

    return <RoomCanvas roomId={roomId} />;
}
