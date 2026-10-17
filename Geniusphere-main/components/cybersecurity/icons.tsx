import React from 'react';

type IconProps = {
    x?: number;
    y?: number;
    className?: string;
    children?: React.ReactNode;
};

export const ComputerIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '', children }) => (
    <g transform={`translate(${x}, ${y})`} className={className}>
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={60} height={40} rx={5} fill="currentColor" />
        <rect x={5} y={5} width={50} height={30} fill="#0B0C10" />
        <path d="M 20 40 L 40 40 L 45 50 L 15 50 Z" fill="currentColor" />
        {children}
    </g>
);

export const ServerIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className}>
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={60} height={40} rx={5} fill="currentColor" />
        <line x1={5} y1={10} x2={25} y2={10} stroke="#0B0C10" strokeWidth={2} />
        <circle cx={50} cy={10} r={2} fill="#32D74B" />
    </g>
);

export const FileIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '', children }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        <path d="M0 0 L20 0 L20 25 L0 25 Z" />
        <path d="M15 0 L20 5 L15 5 Z" fill="#0B0C10" />
        {children}
    </g>
);

export const ShieldIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className}>
        <path d="M 30 0 L 60 10 L 60 40 C 60 70, 30 90, 30 90 C 30 90, 0 70, 0 40 L 0 10 Z" fill="currentColor" />
        {/* Fix: Use number for strokeWidth */}
        <path d="M 15 45 L 25 55 L 45 35" stroke="#0B0C10" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={40} height={30} rx={2} />
        <path d="M 0 2 L 20 17 L 40 2" stroke="#0B0C10" strokeWidth={2} fill="none" />
    </g>
);

export const PadlockIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y}) scale(0.5)`} className={className}>
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={5} y={10} width={20} height={15} fill="currentColor" rx={2} />
        <path d="M 10 10 V 5 C 10 0, 20 0, 20 5 V 10" stroke="currentColor" strokeWidth={3} fill="none" />
    </g>
);

export const UserIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use number for SVG attributes */}
        <circle cx={20} cy={15} r={10} />
        <path d="M 5 40 C 5 25, 35 25, 35 40 Z" />
    </g>
);

export const DatabaseIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className}>
        {/* Fix: Use numbers for SVG attributes */}
        <ellipse cx={25} cy={10} rx={25} ry={10} fill="currentColor" />
        <path d="M 0 10 V 40 C 0 50, 50 50, 50 40 V 10" fill="currentColor" />
        <ellipse cx={25} cy={10} rx={25} ry={10} stroke="#0B0C10" fill="none" />
        <ellipse cx={25} cy={25} rx={25} ry={10} stroke="#0B0C10" fill="none" />
    </g>
);

export const InterceptorIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y}) scale(0.8)`} className={className} fill="currentColor">
        <path d="M 20 0 C 10 0, 0 10, 0 20 L 0 40 L 40 40 L 40 20 C 40 10, 30 0, 20 0 Z" />
        {/* Fix: Use numbers for SVG attributes */}
        <circle cx={12} cy={20} r={4} fill="#0B0C10" />
        <circle cx={28} cy={20} r={4} fill="#0B0C10" />
        <path d="M 10 30 Q 20 25, 30 30" stroke="#0B0C10" strokeWidth={2} fill="none" />
    </g>
);

export const CodeIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="#FF0080">
        {/* Fix: Use number for fontSize */}
        <text fontSize={14} fontFamily="monospace" >&lt;/&gt;</text>
    </g>
);

export const CookieIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use number for r attribute */}
        <circle cx={15} cy={15} r={10} />
        <path d="M 18 8 A 8 8 0 0 0 10 5 L 15 15 Z" fill="#0B0C10" />
    </g>
);

export const PhoneIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        <path d="M 5 0 C 2 0, 0 2, 0 5 L 0 35 C 0 38, 2 40, 5 40 L 20 40 C 23 40, 25 38, 25 35 L 25 5 C 25 2, 23 0, 20 0 Z" />
        {/* Fix: Use numbers for SVG attributes */}
        <circle cx={12.5} cy={35} r={2} fill="#0B0C10" />
    </g>
);

export const UsbIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '', children }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={5} width={20} height={30} rx={3} />
        <rect x={-10} y={10} width={10} height={20} rx={2} />
        {children}
    </g>
);

export const SignatureIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={40} height={40} rx={5} />
        <path d="M 10 20 L 15 25 L 30 15" stroke="#0B0C10" strokeWidth={3} fill="none" />
    </g>
);

export const PatchIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y}) scale(0.5)`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={20} height={20} />
        <line x1={10} y1={2} x2={10} y2={18} stroke="#0B0C10" strokeWidth={2} />
        <line x1={2} y1={10} x2={18} y2={10} stroke="#0B0C10" strokeWidth={2} />
    </g>
);

export const CommentIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="#FF0080">
        <path d="M 0 0 H 60 V 30 H 10 L 0 40 Z" />
    </g>
);

export const EyeIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className}>
        {/* Fix: Use numbers for SVG attributes */}
        <path d="M 0 10 Q 10 0, 20 10 T 40 10" stroke="currentColor" strokeWidth={2} fill="none" />
        <circle cx={20} cy={10} r={5} fill="currentColor" />
    </g>
);

export const HorseIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        <path d="M 10 35 L 10 25 L 5 25 L 5 15 L 15 15 L 15 5 L 25 5 L 25 10 L 35 10 L 35 20 L 40 20 L 40 35 Z" />
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={10} y={35} width={5} height={5} />
        <rect x={25} y={35} width={5} height={5} />
    </g>
);

export const PopupIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={60} height={40} rx={3} stroke="#0B0C10" strokeWidth={2} />
        <rect x={0} y={0} width={60} height={10} fill="currentColor" />
        <circle cx={50} cy={5} r={3} fill="red" />
    </g>
);

export const KeyboardIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={80} height={30} rx={3} />
        <rect x={5} y={5} width={10} height={5} fill="#0B0C10" />
        <rect x={20} y={5} width={10} height={5} fill="#0B0C10" />
        <rect x={35} y={5} width={10} height={5} fill="#0B0C10" />
        <rect x={5} y={15} width={50} height={5} fill="#0B0C10" />
    </g>
);

// Fix: Add missing DataBreachIcon component
export const DataBreachIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y}) scale(0.5)`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <circle cx={5} cy={5} r={3} />
        <circle cx={15} cy={15} r={2} />
        <circle cx={5} cy={20} r={4} />
    </g>
);

// Fix: Add missing BrowserIcon component
export const BrowserIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={0} y={0} width={80} height={60} rx={5} />
        <rect x={5} y={5} width={70} height={50} fill="#0B0C10" />
        <rect x={5} y={5} width={70} height={15} fill="currentColor" />
        <circle cx={12} cy={12} r={3} fill="#0B0C10" />
    </g>
);

// Fix: Add missing CursorIcon component
export const CursorIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        <path d="M 0 0 L 0 20 L 5 15 L 12 22 L 18 18 L 10 12 L 15 5 Z" />
    </g>
);

// Fix: Add missing RootkitIcon component
export const RootkitIcon: React.FC<IconProps> = ({ x = 0, y = 0, className = '' }) => (
    <g transform={`translate(${x}, ${y})`} className={className} fill="currentColor">
        {/* Fix: Use numbers for SVG attributes */}
        <circle cx={10} cy={10} r={8} />
        <path d="M 10 2 L 10 0" stroke="currentColor" strokeWidth={2} />
        <path d="M 4 4 L 2 2" stroke="currentColor" strokeWidth={2} />
        <path d="M 16 4 L 18 2" stroke="currentColor" strokeWidth={2} />
        <path d="M 2 10 L 0 10" stroke="currentColor" strokeWidth={2} />
        <path d="M 18 10 L 20 10" stroke="currentColor" strokeWidth={2} />
    </g>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
