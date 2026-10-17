import React from 'react';
import { ChevronLeft, Menu, RotateCcw, Play, ChevronRight, ChevronDown, Info, X } from 'lucide-react';

interface MobileLayoutProps {
    title: string;
    description?: React.ReactNode;
    badges?: React.ReactNode[];
    visualContent: React.ReactNode;
    controls?: React.ReactNode;
    infoContent?: React.ReactNode;
    onExit?: () => void;
    onMenuToggle?: () => void;
    isMenuOpen?: boolean;
    className?: string; // For additional styling
    headerStyle?: 'standard' | 'brand-center';
    headerTitle?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    title,
    description,
    badges,
    visualContent,
    controls,
    infoContent,
    onExit,
    onMenuToggle,
    isMenuOpen,
    className = "",
    headerStyle = 'standard',
    headerTitle
}) => {
    return (
        <div className={`flex flex-col min-h-screen bg-slate-950 text-white font-sans ${className}`}>
            {/* Header - Increased z-index to stay above modals */}
            <header className="flex items-center justify-between p-4 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shrink-0 sticky top-0 z-[100]">
                {headerStyle === 'brand-center' ? (
                    <>
                        <button
                            onClick={onMenuToggle}
                            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="font-black italic tracking-widest text-sm uppercase">
                            {headerTitle || title}
                        </div>
                        <button
                            onClick={onExit}
                            className="p-2.5 rounded-full bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                            aria-label="Exit lab"
                        >
                            <X size={22} strokeWidth={2.5} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onExit}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-bold uppercase tracking-wider active:scale-95"
                            aria-label="Exit lab"
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                            Exit
                        </button>
                        <button
                            onClick={onMenuToggle}
                            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                    </>
                )}
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto pb-32">
                {/* Title Section */}
                <div className="flex flex-col gap-3">
                    {/* Badges */}
                    {badges && badges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {badges.map((badge, i) => (
                                <div key={i}>{badge}</div>
                            ))}
                        </div>
                    )}

                    <h1 className="text-3xl font-bold tracking-tight text-white leading-none">{title}</h1>

                    {description && (
                        <div className="border-l-2 border-blue-500 pl-4 py-1">
                            <div className="text-slate-400 text-sm leading-relaxed">
                                {description}
                            </div>
                        </div>
                    )}
                </div>

                {/* Visual Simulation Area - The "Screen" */}
                {/* Enforce a reasonable height or aspect ratio */}
                <div className="w-full relative bg-black/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl min-h-[300px] flex flex-col">
                    {/* Inner content wrapper to handle sizing */}
                    <div className="flex-1 relative flex flex-col">
                        {visualContent}
                    </div>
                </div>

                {/* Info / Steps Card - Rendered in flow before controls */}
                {infoContent && (
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex gap-4">
                        <div className="mt-1 shrink-0">
                            <Info size={20} className="text-blue-500" />
                        </div>
                        <div className="flex-1 text-sm text-slate-300">
                            {infoContent}
                        </div>
                    </div>
                )}
            </main>

            {/* Controls Deck - Fixed at bottom */}
            {controls && (
                <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent p-4 pb-6 pt-8">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                        {controls}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components for standard look
export const MobileBadge: React.FC<{ children: React.ReactNode, variant?: "purple" | "yellow" | "cyan" | "green" }> = ({ children, variant = "purple" }) => {
    const styles = {
        purple: "bg-[#4F46E5]/20 text-[#818CF8] border-[#818CF8]/30",
        yellow: "bg-[#F59E0B]/20 text-[#FCD34D] border-[#FCD34D]/30",
        cyan: "bg-[#06B6D4]/20 text-[#22D3EE] border-[#22D3EE]/30",
        green: "bg-[#10B981]/20 text-[#34D399] border-[#34D399]/30",
    };
    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[variant]}`}>
            {children}
        </span>
    );
};

export const MobileControlGroup = ({ onPlay, onReset, onNext, onPrev, isPlaying }: any) => (
    <div className="flex items-center gap-3 w-full">
        {/* Reset Button */}
        <button
            onClick={onReset}
            className="p-3.5 rounded-xl bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 border border-slate-700/50 hover:border-slate-600"
            aria-label="Reset simulation"
        >
            <RotateCcw size={22} strokeWidth={2} />
        </button>

        {/* Play/Pause Button - Main CTA */}
        <button
            onClick={onPlay}
            className={`flex-1 py-3.5 px-5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${isPlaying
                ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30'
                }`}
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
        >
            <Play size={20} fill="currentColor" strokeWidth={0} />
            <span className="text-sm font-bold tracking-wide uppercase">
                {isPlaying ? "PAUSE SIM" : "PLAY SIM"}
            </span>
        </button>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-0.5 bg-slate-800/80 rounded-xl p-1 border border-slate-700/50">
            <button
                onClick={onPrev}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all active:scale-95"
                aria-label="Previous step"
            >
                <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            <div className="w-px h-7 bg-slate-700"></div>
            <button
                onClick={onNext}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all active:scale-95"
                aria-label="Next step"
            >
                <ChevronRight size={22} strokeWidth={2.5} />
            </button>
        </div>
    </div>
);
