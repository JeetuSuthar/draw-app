"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, X } from 'lucide-react';
import { AxiosInstance } from '@/lib/axios'; // Ensure you have an Axios instance set up
import { Game, Shape } from '@/draw/Game'; // Adjust the import path as necessary

interface AIModalProps {
    open: boolean;
    onClose: () => void;
    game: Game | undefined;
    roomId: string;
    userId: string;
}

const AIModal: React.FC<AIModalProps> = ({ open, onClose, game, roomId, userId }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [objectPrompt, setObjectPrompt] = useState("");
    const [flowPrompt, setFlowPrompt] = useState("");
    const [activeSection, setActiveSection] = useState<"object" | "flow" | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<Shape[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastPrompt, setLastPrompt] = useState("");
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // Function to draw shapes on the preview canvas
    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
        ctx.strokeStyle = shape.strokeStyle;
        ctx.fillStyle = shape.strokeFill;
        ctx.lineWidth = shape.strokeWidth;
        if (shape.stStyle === 'solid') ctx.setLineDash([]);
        else if (shape.stStyle === 'dotted') ctx.setLineDash([2, 2]);
        else if (shape.stStyle === 'dashed') ctx.setLineDash([5, 5]);

        if (shape.type === 'rectangle') {
            ctx.fillRect(shape.startX, shape.startY, shape.width, shape.height);
            ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            ctx.beginPath();
            const radius = Math.min(shape.width, shape.height) / 2;
            ctx.arc(shape.startX + radius, shape.startY + radius, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(shape.startX + shape.width / 2, shape.startY);
            ctx.lineTo(shape.startX + shape.width, shape.startY + shape.height / 2);
            ctx.lineTo(shape.startX + shape.width / 2, shape.startY + shape.height);
            ctx.lineTo(shape.startX, shape.startY + shape.height / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (shape.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.startX + shape.width, shape.startY + shape.height);
            ctx.stroke();
        } else if (shape.type === 'arrow') {
            const endX = shape.startX + shape.width;
            const endY = shape.startY + shape.height;
            const headLength = 20;
            const angle = Math.atan2(endY - shape.startY, endX - shape.startX);
            const HeadX1 = endX - headLength * Math.cos(angle - Math.PI / 6);
            const HeadY1 = endY - headLength * Math.sin(angle - Math.PI / 6);
            const HeadX2 = endX - headLength * Math.cos(angle + Math.PI / 6);
            const HeadY2 = endY - headLength * Math.sin(angle + Math.PI / 6);
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(HeadX1, HeadY1);
            ctx.lineTo(endX, endY);
            ctx.lineTo(HeadX2, HeadY2);
            ctx.stroke();
        }
        // Add other shape types as needed
    };

    // Draw the generated shapes on the preview canvas
    useEffect(() => {
        if (response && previewCanvasRef.current) {
            const ctx = previewCanvasRef.current.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, 480, 320);
                ctx.fillStyle = "#222";
                ctx.fillRect(0, 0, 480, 320);
                response.forEach(shape => drawShape(ctx, shape));
            }
        }
    }, [response]);

    // Handle clicks outside the modal to close it
    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
                resetModal();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);

    // Handle AI submission
    const handleSubmit = async (type: "OBJECT" | "FLOWCHART", content: string) => {
        if (!userId) {
            setError("You must be logged in to use AI drawing.");
            return;
        }
        setLoading(true);
        setResponse(null);
        setError(null);
        setLastPrompt(content);
        try {
            const res = await AxiosInstance.post("/generate-drawing", { type, content, roomId });
            setResponse(res.data.result || res.data); // Expect Shape[] format
            setObjectPrompt("");
            setFlowPrompt("");
        } catch (err: any) {
            setError(err?.response?.data?.msg || "Failed to generate drawing.");
        } finally {
            setLoading(false);
        }
    };

    // Insert shapes into the main canvas
    const insertIntoCanvas = () => {
        if (response && game) {
            game.addShapes(response); // This method needs to be added to Game.ts
        }
        resetModal();
        onClose();
    };

    // Reset modal state
    const resetModal = () => {
        setActiveSection(null);
        setResponse(null);
        setError(null);
        setObjectPrompt("");
        setFlowPrompt("");
        setLastPrompt("");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div ref={modalRef} className={`bg-neutral-900 rounded-2xl p-8 shadow-2xl w-full text-center border border-violet-700 relative ${response ? "max-w-4xl" : "max-w-md"}`} style={response ? { minHeight: 500 } : {}}>
                <button className="absolute top-4 left-4 text-violet-400 hover:text-white transition" onClick={() => { onClose(); resetModal(); }} aria-label="Close">
                    <X size={22} />
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">AI Drawing Assistant</h2>

                {!activeSection && (
                    <div className="flex flex-row gap-6 justify-center mb-4">
                        <button className="flex-1 bg-violet-800/70 hover:bg-violet-600 text-white rounded-xl p-6 font-semibold text-lg shadow transition-all duration-200" onClick={() => setActiveSection("object")}>
                            Draw an Object
                        </button>
                        <button className="flex-1 bg-purple-800/70 hover:bg-purple-600 text-white rounded-xl p-6 font-semibold text-lg shadow transition-all duration-200" onClick={() => setActiveSection("flow")}>
                            Draw a Flow Chart
                        </button>
                    </div>
                )}

                {activeSection === "object" && (
                    <form onSubmit={e => { e.preventDefault(); if (!loading && objectPrompt.trim()) handleSubmit("OBJECT", objectPrompt); }}>
                        <div className="text-left">
                            <button className="mb-4 text-violet-400 hover:text-white transition font-semibold" type="button" onClick={() => { setActiveSection(null); setResponse(null); setError(null); }}>
                                ← Back
                            </button>
                        </div>
                        <div className="mb-6 text-left">
                            <label className="block text-violet-300 font-semibold mb-2">What object should I draw?</label>
                            <input type="text" className="w-full px-4 py-2 rounded bg-neutral-800 text-white focus:outline-none mb-1" placeholder="e.g. house, bus..." value={objectPrompt} onChange={e => setObjectPrompt(e.target.value)} disabled={loading} />
                            {error && <div className="text-red-400">{error}</div>}
                        </div>
                        <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-60" disabled={loading || !objectPrompt.trim()}>
                            {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Generating...</span> : "Submit"}
                        </button>
                        {response && (
                            <div className="mt-4 flex flex-col items-center w-full">
                                <div className="text-violet-300 font-semibold mb-2">Generated object for: <span className="text-white">{lastPrompt}</span></div>
                                <canvas ref={previewCanvasRef} width={480} height={320} style={{ background: "#222", borderRadius: 8, border: "1px solid #444" }} />
                                <button className="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition" onClick={insertIntoCanvas}>
                                    Insert into Canvas
                                </button>
                            </div>
                        )}
                    </form>
                )}

                {activeSection === "flow" && (
                    <form onSubmit={e => { e.preventDefault(); if (!loading && flowPrompt.trim()) handleSubmit("FLOWCHART", flowPrompt); }}>
                        <div className="text-left">
                            <button className="mb-4 text-purple-400 hover:text-white transition font-semibold" type="button" onClick={() => { setActiveSection(null); setResponse(null); setError(null); }}>
                                ← Back
                            </button>
                        </div>
                        <div className="mb-6 text-left">
                            <label className="block text-purple-300 font-semibold mb-2">Describe your flow chart</label>
                            <textarea className="w-full px-4 py-2 resize-none rounded bg-neutral-800 text-white focus:outline-none mb-1" placeholder="e.g. receive request - validate input - query DB - return response" value={flowPrompt} onChange={e => setFlowPrompt(e.target.value)} disabled={loading} rows={3} />
                            {error && <div className="text-red-400">{error}</div>}
                        </div>
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-60" disabled={loading || !flowPrompt.trim()}>
                            {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Generating...</span> : "Submit"}
                        </button>
                        {response && (
                            <div className="mt-4 flex flex-col items-center w-full">
                                <div className="text-purple-300 font-semibold mb-2">Generated flowchart for: <span className="text-white">{lastPrompt}</span></div>
                                <canvas ref={previewCanvasRef} width={480} height={320} style={{ background: "#222", borderRadius: 8, border: "1px solid #444" }} />
                                <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition" onClick={insertIntoCanvas}>
                                    Insert into Canvas
                                </button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default AIModal;