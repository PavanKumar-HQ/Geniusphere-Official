import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool, RotateCcw, Download } from 'lucide-react';
import { motion as motionBase } from 'framer-motion';

const motion = motionBase as any;

interface WhiteboardProps {
    color?: string;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({ color = "#FFFFFF" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [mode, setMode] = useState<'draw' | 'erase'>('draw');
    const [brushSize, setBrushSize] = useState(2);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle resize
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                // Re-set context props after resize
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.strokeStyle = color;
                    ctx.lineWidth = brushSize;
                }
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = mode === 'draw' ? color : '#1e293b'; // Match bg color for eraser (visual hack) or use globalCompositeOperation
            ctx.lineWidth = brushSize;
            if (mode === 'erase') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 20;
            } else {
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    }, [color, brushSize, mode]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { x, y } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-inner">
            <canvas
                ref={canvasRef}
                className="cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />

            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md p-2 rounded-full border border-white/10 flex gap-2 shadow-xl">
                <button 
                    onClick={() => setMode('draw')} 
                    className={`p-2 rounded-full transition-colors ${mode === 'draw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Pen"
                >
                    <PenTool size={18} />
                </button>
                <button 
                    onClick={() => setMode('erase')} 
                    className={`p-2 rounded-full transition-colors ${mode === 'erase' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Eraser"
                >
                    <Eraser size={18} />
                </button>
                <div className="w-px h-6 bg-white/10 my-auto mx-1" />
                <button 
                    onClick={clearCanvas} 
                    className="p-2 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                    title="Clear Board"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
            
             <div className="absolute bottom-4 left-4 text-[10px] text-slate-600 font-mono">
                LOCAL CANVAS STORAGE ONLY
            </div>
        </div>
    );
};