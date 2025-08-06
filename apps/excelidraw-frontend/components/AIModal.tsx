"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, X, ArrowLeft, Sparkles, GitBranch } from 'lucide-react';
import { AxiosInstance } from '@/lib/axios';
import { Game, Shape } from '@/draw/Game';
import { motion, AnimatePresence } from 'framer-motion';

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
    };

    // Draw the generated shapes on the preview canvas
    useEffect(() => {
        if (response && previewCanvasRef.current) {
            const ctx = previewCanvasRef.current.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, 480, 320);
                ctx.fillStyle = "#1f2937";
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
            setResponse(res.data.result || res.data);
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
            game.addShapes(response);
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
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    ref={modalRef} 
                    className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full text-center border border-gray-200 dark:border-gray-700 relative ${response ? "max-w-5xl" : "max-w-lg"}`}
                    style={response ? { minHeight: 500 } : {}}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {/* Floating elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                        <motion.div 
                            className="absolute top-4 right-16 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-md"
                            animate={{ 
                                y: [0, 8, 0],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                repeatType: "reverse" 
                            }}
                        />
                        <motion.div 
                            className="absolute bottom-8 left-8 w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-900/30 blur-md"
                            animate={{ 
                                y: [0, -6, 0],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                repeatType: "reverse" 
                            }}
                        />
                    </div>

                    <button 
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" 
                        onClick={() => { onClose(); resetModal(); }} 
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                                <Sparkles className="w-3 h-3 mr-2" />
                                AI Drawing Assistant
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Create with AI
                            </h2>
                        </motion.div>

                        {!activeSection && (
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.button 
                                    className="group p-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02]"
                                    onClick={() => setActiveSection("object")}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Sparkles className="w-6 h-6 mx-auto mb-2 group-hover:animate-pulse" />
                                    Draw an Object
                                    <p className="text-sm text-purple-100 mt-2 font-normal">
                                        Describe any object and watch AI create it
                                    </p>
                                </motion.button>
                                <motion.button 
                                    className="group p-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02]"
                                    onClick={() => setActiveSection("flow")}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <GitBranch className="w-6 h-6 mx-auto mb-2 group-hover:animate-pulse" />
                                    Draw a Flow Chart
                                    <p className="text-sm text-indigo-100 mt-2 font-normal">
                                        Create professional flowcharts instantly
                                    </p>
                                </motion.button>
                            </motion.div>
                        )}

                        {activeSection === "object" && (
                            <motion.form 
                                onSubmit={e => { e.preventDefault(); if (!loading && objectPrompt.trim()) handleSubmit("OBJECT", objectPrompt); }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-left">
                                    <button 
                                        className="mb-6 inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors font-medium" 
                                        type="button" 
                                        onClick={() => { setActiveSection(null); setResponse(null); setError(null); }}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </button>
                                </div>
                                <div className="mb-6 text-left">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
                                        What object should I draw?
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                        placeholder="e.g. house, car, tree, laptop..." 
                                        value={objectPrompt} 
                                        onChange={e => setObjectPrompt(e.target.value)} 
                                        disabled={loading} 
                                    />
                                    {error && (
                                        <motion.div 
                                            className="mt-2 text-red-500 text-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </div>
                                <button 
                                    type="submit" 
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]" 
                                    disabled={loading || !objectPrompt.trim()}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            Creating magic...
                                        </span>
                                    ) : "Generate Object"}
                                </button>
                                {response && (
                                    <motion.div 
                                        className="mt-8 flex flex-col items-center w-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                                            Generated object: <span className="text-purple-600 dark:text-purple-400 font-semibold">{lastPrompt}</span>
                                        </div>
                                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                                            <canvas 
                                                ref={previewCanvasRef} 
                                                width={480} 
                                                height={320} 
                                                className="rounded-lg border border-gray-200 dark:border-gray-700" 
                                            />
                                        </div>
                                        <button 
                                            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]" 
                                            onClick={insertIntoCanvas}
                                        >
                                            Insert into Canvas
                                        </button>
                                    </motion.div>
                                )}
                            </motion.form>
                        )}

                        {activeSection === "flow" && (
                            <motion.form 
                                onSubmit={e => { e.preventDefault(); if (!loading && flowPrompt.trim()) handleSubmit("FLOWCHART", flowPrompt); }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-left">
                                    <button 
                                        className="mb-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-medium" 
                                        type="button" 
                                        onClick={() => { setActiveSection(null); setResponse(null); setError(null); }}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </button>
                                </div>
                                <div className="mb-6 text-left">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
                                        Describe your flow chart
                                    </label>
                                    <textarea 
                                        className="w-full px-4 py-3 resize-none rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                                        placeholder="e.g. user login process, data validation flow, decision tree..." 
                                        value={flowPrompt} 
                                        onChange={e => setFlowPrompt(e.target.value)} 
                                        disabled={loading} 
                                        rows={3} 
                                    />
                                    {error && (
                                        <motion.div 
                                            className="mt-2 text-red-500 text-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </div>
                                <button 
                                    type="submit" 
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]" 
                                    disabled={loading || !flowPrompt.trim()}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            Creating flowchart...
                                        </span>
                                    ) : "Generate Flowchart"}
                                </button>
                                {response && (
                                    <motion.div 
                                        className="mt-8 flex flex-col items-center w-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                                            Generated flowchart: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{lastPrompt}</span>
                                        </div>
                                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                                            <canvas 
                                                ref={previewCanvasRef} 
                                                width={480} 
                                                height={320} 
                                                className="rounded-lg border border-gray-200 dark:border-gray-700" 
                                            />
                                        </div>
                                        <button 
                                            className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]" 
                                            onClick={insertIntoCanvas}
                                        >
                                            Insert into Canvas
                                        </button>
                                    </motion.div>
                                )}
                            </motion.form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AIModal;
