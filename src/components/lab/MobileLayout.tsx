import React from 'react';
import { ChevronLeft, Menu, RotateCcw, Play, ChevronRight, ChevronDown, Info, X } from 'lucide-react';
import { LabOrientationGuard } from './LabOrientationGuard';

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
    className?: string;
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
        <LabOrientationGuard labTitle={typeof title === 'string' ? title : 'Interactive Lab'}>
            <div
                style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                backgroundColor: '#020617',
                color: '#FFFFFF',
                position: 'relative',
                boxSizing: 'border-box',
            }}
            className={`flex flex-col min-h-screen bg-slate-950 text-white font-sans ${className}`}
        >
            {/* Header */}
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: '#0F172A',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    flexShrink: 0,
                    boxSizing: 'border-box',
                }}
                className="flex items-center justify-between p-4 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shrink-0 sticky top-0 z-[100]"
            >
                {headerStyle === 'brand-center' ? (
                    <>
                        <button
                            type="button"
                            onClick={onMenuToggle}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                backgroundColor: '#1E293B',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#CBD5E1',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {headerTitle || title}
                        </div>
                        <button
                            type="button"
                            onClick={onExit}
                            style={{
                                padding: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#1E293B',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#CBD5E1',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            className="p-2.5 rounded-full bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                            aria-label="Exit lab"
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onExit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                backgroundColor: '#1E293B',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#CBD5E1',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-bold uppercase tracking-wider active:scale-95"
                            aria-label="Exit lab"
                        >
                            <ChevronLeft size={18} strokeWidth={2.5} />
                            Exit
                        </button>
                        <button
                            type="button"
                            onClick={onMenuToggle}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                backgroundColor: '#1E293B',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#CBD5E1',
                                cursor: 'pointer',
                            }}
                            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                    </>
                )}
            </header>

            {/* Scrollable Content */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    gap: '16px',
                    overflowY: 'auto',
                    minHeight: 0,
                    boxSizing: 'border-box',
                }}
                className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto pb-32 custom-scrollbar"
            >
                {/* Title Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Badges */}
                    {badges && badges.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {badges.map((badge, i) => (
                                <div key={i}>{badge}</div>
                            ))}
                        </div>
                    )}

                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>{title}</h1>

                    {description && (
                        <div style={{ borderLeft: '3px solid #3B82F6', paddingLeft: '12px', margin: 0 }}>
                            <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                                {description}
                            </div>
                        </div>
                    )}
                </div>

                {/* Visual Simulation Area */}
                <div style={{ width: '100%', minHeight: '340px', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {visualContent}
                    </div>
                </div>

                {/* Info / Steps Card */}
                {infoContent && (
                    <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '12px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                            <Info size={18} color="#3B82F6" />
                        </div>
                        <div style={{ flex: 1, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                            {infoContent}
                        </div>
                    </div>
                )}

                {/* Controls Deck */}
                {controls && (
                    <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
                        {controls}
                    </div>
                )}
            </main>
        </div>
        </LabOrientationGuard>
    );
};

export const MobileBadge: React.FC<{ children: React.ReactNode; variant?: "purple" | "yellow" | "cyan" | "green"; onClick?: () => void }> = ({ children, variant = "purple", onClick }) => {
    const palette = {
        purple: { bg: 'rgba(79, 70, 229, 0.2)', color: '#818CF8', border: 'rgba(129, 140, 248, 0.3)' },
        yellow: { bg: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', border: 'rgba(252, 211, 77, 0.3)' },
        cyan: { bg: 'rgba(6, 182, 212, 0.2)', color: '#22D3EE', border: 'rgba(34, 211, 238, 0.3)' },
        green: { bg: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: 'rgba(52, 211, 153, 0.3)' },
    };
    const c = palette[variant] || palette.purple;
    return (
        <span
            onClick={onClick}
            style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: c.bg,
                color: c.color,
                border: `1px solid ${c.border}`,
                display: 'inline-block',
                cursor: onClick ? 'pointer' : 'default',
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-all' : ''}`}
        >
            {children}
        </span>
    );
};

export const MobileControlGroup = ({ onPlay, onReset, onNext, onPrev, isPlaying }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }} className="flex items-center gap-3 w-full">
        {/* Reset Button */}
        <button
            type="button"
            onClick={onReset}
            style={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            className="p-3.5 rounded-xl bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 border border-slate-700/50 hover:border-slate-600"
            aria-label="Reset simulation"
        >
            <RotateCcw size={18} strokeWidth={2} />
        </button>

        {/* Play/Pause Button - Main CTA */}
        <button
            type="button"
            onClick={onPlay}
            style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '10px',
                background: isPlaying ? '#334155' : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: isPlaying ? 'none' : '0 4px 14px rgba(79, 70, 229, 0.4)',
            }}
            className={`flex-1 py-3.5 px-5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95`}
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
        >
            <Play size={16} fill="currentColor" strokeWidth={0} />
            <span>{isPlaying ? "PAUSE SIM" : "PLAY SIM"}</span>
        </button>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#1E293B', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
                type="button"
                onClick={onPrev}
                style={{ padding: '8px', color: '#94A3B8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Previous step"
            >
                <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            <button
                type="button"
                onClick={onNext}
                style={{ padding: '8px', color: '#94A3B8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Next step"
            >
                <ChevronRight size={18} strokeWidth={2.5} />
            </button>
        </div>
    </div>
);
