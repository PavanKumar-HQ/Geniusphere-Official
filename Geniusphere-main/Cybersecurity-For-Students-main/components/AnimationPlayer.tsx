import React from 'react';
import type { AttackModuleData } from '../types';
import { ComputerIcon, ServerIcon, FileIcon, ShieldIcon, EnvelopeIcon, PadlockIcon, UserIcon, DatabaseIcon, InterceptorIcon, CodeIcon, CookieIcon, PhoneIcon, UsbIcon, SignatureIcon, PatchIcon, CommentIcon, EyeIcon, HorseIcon, PopupIcon, KeyboardIcon, DataBreachIcon, BrowserIcon, CursorIcon, RootkitIcon } from './icons';

interface AnimationPlayerProps {
  module: AttackModuleData;
  currentStep: number;
  showDefense: boolean;
  reducedMotion: boolean;
  isFocusPaused: boolean;
  focusPoint?: { x: number, y: number };
}

export const AnimationPlayer: React.FC<AnimationPlayerProps> = (props) => {
  const { module } = props;
  
  const getAnimationComponent = () => {
    switch (module.id) {
      case 'phishing': return <PhishingAnimation {...props} />;
      case 'malware': return <MalwareAnimation {...props} />;
      case 'ransomware': return <RansomwareAnimation {...props} />;
      case 'ddos': return <DdosAnimation {...props} />;
      case 'mitm': return <MitmAnimation {...props} />;
      case 'sqlinjection': return <SqlInjectionAnimation {...props} />;
      case 'xss': return <XssAnimation {...props} />;
      case 'password': return <PasswordAttackAnimation {...props} />;
      case 'social': return <SocialEngineeringAnimation {...props} />;
      case 'insider': return <InsiderThreatAnimation {...props} />;
      case 'supplychain': return <SupplyChainAnimation {...props} />;
      case 'zeroday': return <ZeroDayAnimation {...props} />;
      case 'spyware': return <SpywareAnimation {...props} />;
      case 'trojan': return <TrojanHorseAnimation {...props} />;
      case 'adware': return <AdwareAnimation {...props} />;
      case 'keylogger': return <KeyloggerAnimation {...props} />;
      case 'databreach': return <DataBreachAnimation {...props} />;
      case 'spoofing': return <SpoofingAnimation {...props} />;
      case 'clickjacking': return <ClickjackingAnimation {...props} />;
      case 'rootkit': return <RootkitAnimation {...props} />;
      default: return <DefaultAnimation module={module} />;
    }
  };

  return (
    <div className="aspect-video w-full bg-black rounded-md flex items-center justify-center p-4 relative overflow-hidden">
      <CyberBackground />
      {getAnimationComponent()}
    </div>
  );
};

const CyberBackground = () => (
    <svg width="100%" height="100%" className="absolute top-0 left-0">
        <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                {/* Fix: Use number for strokeWidth */}
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 255, 255, 0.1)" strokeWidth={0.5}/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);


const Microcopy: React.FC<{ text?: string }> = ({ text }) => {
    if (!text) return null;
    return (
        <g className="opacity-0">
            {/* Fix: Use numbers for SVG attributes */}
            <rect x={95} y={175} width={text.length * 5 + 10} height={20} rx={5} fill="rgba(11, 12, 16, 0.8)" stroke="#00FFFF" />
            <text x={100} y={189} fill="#00FFFF" fontSize={10} className="font-sans">
                {text}
            </text>
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" />
        </g>
    )
}

const FocusHighlight: React.FC<{ point?: { x: number, y: number }, isPaused: boolean }> = ({ point, isPaused }) => {
    if (!point || !isPaused) return null;
    return (
        // Fix: Use numbers for SVG attributes
        <circle cx={point.x} cy={point.y} r={20} fill="none" stroke="yellow" strokeWidth={2} strokeDasharray="4 4" className="opacity-75">
            <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="scale" from="1" to="1.2" additive="sum" begin="0s" dur="1s" repeatCount="indefinite" />
        </circle>
    )
}

type AnimationComponentProps = {
    module: AttackModuleData;
    currentStep: number;
    showDefense: boolean;
    reducedMotion: boolean;
    isFocusPaused: boolean;
    focusPoint?: { x: number, y: number };
}

const PhishingAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion, isFocusPaused, focusPoint }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;

    const infectionHappens = isAfter(3) && !showDefense;
    const defenseIsShown = showDefense && isAfter(4);
    
    const computerColor = infectionHappens ? 'text-red-500' : 'text-cyan-400';

    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <UserIcon x={20} y={80} className="text-cyan-400" />
            <g className={infectionHappens && !reducedMotion ? 'glitch' : ''}>
              <ComputerIcon x={300} y={75} className={`transition-colors duration-500 ${computerColor}`} />
            </g>
            
            {isAfter(0) && (
                 <g className={reducedMotion ? '' : `transition-transform duration-1000 ${isAfter(1) ? 'translate-x-[150px]' : ''}`}>
                      <EnvelopeIcon x={100} y={90} />
                 </g>
            )}

            {isAfter(1) && !infectionHappens && (
                <g className={`transition-opacity duration-500 ${defenseIsShown ? 'opacity-0' : 'opacity-100'}`}>
                    {/* Fix: Use numbers for SVG attributes */}
                    <rect x={110} y={40} width={160} height={70} rx={5} fill="#1E293B" />
                    <text x={120} y={60} fontSize={8} fill="#E2E8F0">From:</text>
                    <text x={120} y={70} fontSize={8} fill="#FBBF24" className="font-bold">YourBnak@hax0r.net</text>
                    <text x={120} y={85} fontSize={10} fill="#67E8F9" textDecoration="underline" className="cursor-pointer">
                        Click Here To Claim!
                    </text>
                </g>
            )}

            {infectionHappens && !reducedMotion && [...Array(20)].map((_, i) => (
                // Fix: Use number for r attribute
                <circle key={i} r={1.5} fill="#FF0080" >
                   <animateMotion path={`M 270 100 Q ${280 + Math.random()*10} ${80 + Math.random()*20}, 300 95`} dur={`${1 + Math.random()}s`} begin={`${i*0.05}s`} fill="freeze" />
                </circle>
            ))}

            {defenseIsShown && (
                <>
                    <g transform="translate(220, 70)" className="opacity-0">
                         <ShieldIcon className="text-green-500 scale-150" />
                         {/* Fix: Use numbers for SVG attributes */}
                         {!reducedMotion && <circle cx={30} cy={45} r={10} fill="none" stroke="#32D74B" strokeWidth={3} className="shockwave" />}
                         <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.2s" fill="freeze" />
                    </g>
                </>
            )}

            <Microcopy text={!defenseIsShown ? microcopy : module.animationSteps[4].microcopy} />
            <FocusHighlight point={focusPoint} isPaused={isFocusPaused} />
        </svg>
    );
};

const RansomwareAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion, isFocusPaused, focusPoint }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    const infectionHappens = isAfter(1) && !showDefense;

    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <g className={infectionHappens && !reducedMotion ? 'shake' : ''}>
              <ComputerIcon x={170} y={80} className="text-cyan-400" />
            </g>

            {[...Array(3)].map((_, i) => (
                <g key={i}>
                    <FileIcon x={100 + i * 80} y={90} className={`transition-colors duration-500 ${infectionHappens ? 'text-slate-600' : 'text-cyan-400'}`} />
                    <g className={`transition-opacity duration-500 ${infectionHappens ? 'opacity-100' : 'opacity-0'}`}>
                        <PadlockIcon x={120 + i * 80} y={85} className="text-red-500" />
                    </g>
                </g>
            ))}

            {isAfter(2) && !showDefense && (
                 <rect x="0" y="0" width="400" height="200" fill="black" fillOpacity="0.8" />
            )}
            {isAfter(2) && !showDefense && (
                 // Fix: Use number for fontSize
                 <text x={200} y={100} textAnchor="middle" fill="#FF0080" fontSize={20} className={`font-bold font-mono ${!reducedMotion ? 'glitch' : ''}`}>
                    Your files are locked.
                </text>
            )}
            
             {showDefense && isAfter(4) && (
                <>
                    <DatabaseIcon x={30} y={40} className="text-green-400" />
                    {!reducedMotion && [...Array(15)].map((_, i) => (
                        // Fix: Use number for r attribute
                        <circle key={i} r={2} fill="#32D74B" >
                           <animateMotion path={`M 50 50 Q 100 20, ${120 + (i%3 * 80)} 85`} dur="2s" begin={`${i*0.1}s`} fill="freeze" />
                        </circle>
                    ))}
                    {[...Array(3)].map((_, i) => (
                        <g key={i}>
                             <FileIcon x={100 + i * 80} y={90} className="text-cyan-400">
                                 <animate attributeName="opacity" from="0" to="1" dur="1s" begin={`${0.5 + i*0.3}s`} fill="freeze" />
                            </FileIcon>
                            <g className={`transition-opacity duration-500 ${infectionHappens ? 'opacity-100' : 'opacity-0'}`}>
                                <PadlockIcon x={120 + i * 80} y={85} className="text-red-500">
                                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin={`${0.5 + i*0.3}s`} fill="freeze" />
                                </PadlockIcon>
                            </g>
                        </g>
                    ))}
                </>
            )}
            <Microcopy text={microcopy} />
            <FocusHighlight point={focusPoint} isPaused={isFocusPaused} />
        </svg>
    );
};

const DdosAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion, isFocusPaused, focusPoint }) => {
  const isAfter = (step: number) => currentStep >= step;
  const microcopy = module.animationSteps[currentStep]?.microcopy;
  const isOverloaded = isAfter(2) && !showDefense;
  const serverColor = isOverloaded ? 'text-red-500' : 'text-cyan-400';

  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      <g>
        <ServerIcon x={300} y={75} className={`transition-colors duration-500 ${serverColor}`} />
        {isOverloaded && !reducedMotion && (
            // Fix: Use number for strokeWidth
            <circle cx="330" cy="95" r="30" fill="none" stroke="#FF3B30" strokeWidth={2} className="opacity-50">
                <animate attributeName="r" from="5" to="30" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
        )}
      </g>
      {/* Fix: Use number for fontSize */}
      {isAfter(3) && !showDefense && <text x={310} y={130} fill="#FF3B30" fontSize={10}>OFFLINE</text>}

      {isAfter(1) && [...Array(3)].map((_, i) => (
        // Fix: Use number for strokeWidth
        <path key={i} d="M 0 0 L 10 0" stroke="#00FFFF" strokeWidth={2}>
          {!reducedMotion && <animateMotion path={`M 20 ${80 + i * 20} L 300 ${90 + i*5}`} dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />}
        </path>
      ))}

      {isAfter(1) && !showDefense && [...Array(50)].map((_, i) => {
        const startY = 10 + Math.random() * 180;
        const endY = 75 + Math.random() * 40;
        const isDeflected = showDefense && isAfter(4);
        const path = isDeflected ? `M 20 ${startY} L 260 ${95 + (Math.random()-0.5)*50} L 200 ${startY - 50}` : `M 20 ${startY} L 300 ${endY}`;
        return (
             // Fix: Use number for strokeWidth
             <path key={i} d="M 0 0 L 5 0" stroke="#FF0080" strokeWidth={1.5}>
                {!reducedMotion && <animateMotion path={path} dur={`${1 + Math.random()}s`} repeatCount="indefinite" begin={`${i * 0.05}s`} />}
            </path>
        )
      })}
      
      {showDefense && isAfter(4) && (
        <g>
            {/* Fix: Use numbers for SVG attributes */}
            <line x1={270} y1={50} x2={270} y2={150} stroke="#32D74B" strokeWidth={4} >
                {!reducedMotion && <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />}
            </line>
             <text x={275} y={45} fill="#32D74B" fontSize={10}>Filter</text>
        </g>
      )}
      <Microcopy text={microcopy} />
       <FocusHighlight point={focusPoint} isPaused={isFocusPaused} />
    </svg>
  );
};


const SpywareAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion, isFocusPaused, focusPoint }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;

    const cameraIsActive = isAfter(1) && !showDefense;
    const dataIsStreaming = isAfter(3) && !showDefense;

    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <defs>
                <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <style>{`
              @keyframes pulse-red { 0%, 100% { fill: #ef4444; } 50% { fill: #f87171; } }
              .pulsing-red { animation: pulse-red 1.5s ease-in-out infinite; }
            `}</style>
            <ComputerIcon x={170} y={80} className="text-cyan-400" />
            
            {/* Camera Eye */}
            {/* Fix: Use numbers for SVG attributes */}
            <circle cx={200} cy={88} r={3} fill="black" />
            <circle 
                cx={200} 
                cy={88} 
                r={1.5} 
                className={`transition-colors duration-500 ${cameraIsActive ? 'pulsing-red' : 'fill-slate-600'}`} 
                style={cameraIsActive && !reducedMotion ? { filter: 'url(#red-glow)' } : {}}
            />

            {/* Data Stream */}
            {dataIsStreaming && !reducedMotion && [...Array(25)].map((_, i) => {
                const duration = 1.5 + Math.random() * 1.5;
                const controlX = 290 + (Math.random() - 0.5) * 40;
                const controlY = 70 + (Math.random() - 0.5) * 40;
                const path = `M 230 100 Q ${controlX} ${controlY}, 350 40`;
                return (
                    <circle key={i} r={1 + Math.random()} fill="#FF0080" opacity="0">
                        <animateMotion 
                            path={path}
                            dur={`${duration}s`} 
                            begin={`${i * 0.08}s`} 
                            repeatCount="indefinite" />
                        <animate 
                            attributeName="opacity" 
                            values="0; 0.9; 0" 
                            dur={`${duration}s`} 
                            begin={`${i * 0.08}s`} 
                            repeatCount="indefinite" />
                    </circle>
                );
            })}
            {dataIsStreaming && reducedMotion && (
                 // Fix: Use number for strokeWidth
                 <path d="M 230 100 L 350 40" stroke="#FF0080" strokeWidth={1} strokeDasharray="3 3" />
            )}

            <InterceptorIcon x={350} y={20} className={`text-red-500 transition-opacity duration-500 ${dataIsStreaming ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Fix: Use numbers for SVG attributes */}
            <rect x={130} y={50} width={140} height={40} rx={5} className={`fill-yellow-400/20 stroke-yellow-400 transition-opacity duration-500 ${isAfter(0) && currentStep < 2 ? 'opacity-100' : 'opacity-0'}`} />
            <text x={140} y={75} fill="yellow" fontSize={8} className={`transition-opacity duration-500 ${isAfter(0) && currentStep < 2 ? 'opacity-100' : 'opacity-0'}`}>"Allow camera access?"</text>

            {showDefense && isAfter(4) && (
                 <ShieldIcon x={170} y={60} className="text-green-500" />
            )}
            <Microcopy text={microcopy} />
            <FocusHighlight point={focusPoint} isPaused={isFocusPaused} />
        </svg>
    );
};

const SocialEngineeringAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion, isFocusPaused, focusPoint }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <InterceptorIcon x={20} y={80} className="text-red-500" />
            <UserIcon x={320} y={80} className="text-cyan-400" />
            <PhoneIcon x={280} y={90} className={`transition-opacity duration-500 ${isAfter(0) ? 'opacity-100' : 'opacity-0'}`} />
            
            <g className={`transition-opacity duration-500 ${isAfter(1) ? 'opacity-100' : 'opacity-0'}`}>
                <CommentIcon x={150} y={40} />
                {/* Fix: Use number for fontSize */}
                <text x={160} y={60} fill="white" fontSize={8} className={`transition-opacity duration-500 ${isAfter(2) ? 'opacity-100' : 'opacity-0'}`}>"Please share your OTP"</text>
            </g>

            {isAfter(3) && !showDefense && (
                // Fix: Use number for fontSize
                <text x={250} y={105} fill="#FF0080" fontSize={12} fontFamily="monospace">
                    123456
                    {!reducedMotion && <animateMotion path="M 0 0 L -180 -10" dur="2s" begin="0.2s" fill="freeze" />}
                </text>
            )}

            {showDefense && isAfter(4) && (
                <>
                    <PhoneIcon x={250} y={30} className="text-green-500" />
                    {/* Fix: Use number for fontSize */}
                    <text x={240} y={80} fill="#32D74B" fontSize={10}>Verifying...</text>
                    {/* Fix: Use number for strokeWidth */}
                    <line x1={160} y1={65} x2={280} y2={65} stroke="red" strokeWidth={2} className={`transition-opacity duration-500 ${showDefense ? 'opacity-100' : 'opacity-0'}`} />
                </>
            )}
            <Microcopy text={microcopy} />
            <FocusHighlight point={focusPoint} isPaused={isFocusPaused} />
        </svg>
    );
};

const TrojanHorseAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion, isFocusPaused, focusPoint }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    const infectionHappens = isAfter(2) && !showDefense;
    const computerColor = isAfter(3) && !showDefense ? 'text-red-500' : 'text-cyan-400';

    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <ComputerIcon x={250} y={80} className={`transition-colors duration-500 ${computerColor}`} />
            
            <g className={`transition-transform duration-1000 ${isAfter(1) ? 'translate-x-[180px]' : ''}`}>
                <HorseIcon x={50} y={80} className="text-yellow-600" />
            </g>

            {infectionHappens && (
                // Fix: Use number for strokeWidth
                <path d="M 235 100 L 225 110 L 240 115" stroke="white" strokeWidth={1} fill="none" className="opacity-0">
                    <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin="0s" fill="freeze" />
                </path>
            )}

            {infectionHappens && !reducedMotion && [...Array(20)].map((_, i) => (
                // Fix: Use number for r attribute
                <circle key={i} r={1.5} fill="#FF0080" cx="230" cy="110" className="opacity-0">
                   <animate attributeName="opacity" from="0" to="1" dur="0.1s" begin={`${i*0.05}s`} fill="freeze" />
                   <animateMotion path={`M 0 0 Q ${Math.random()*20} ${-20 + Math.random()*20}, 40 -20`} dur={`${0.5 + Math.random()*0.5}s`} begin={`${i*0.05}s`} fill="freeze" />
                </circle>
            ))}

            {isAfter(3) && !showDefense && !reducedMotion && (
                // Fix: Use number for strokeWidth
                <line x1={280} y1={80} x2={380} y2={20} stroke="#FF0080" strokeWidth={2}>
                     <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                </line>
            )}
            
            {showDefense && isAfter(4) && (
                <g>
                    <ShieldIcon x={150} y={70} className="text-green-500 scale-125" />
                    <rect x={230} y={80} width={40} height={50} className="fill-green-900/50" />
                </g>
            )}
            <Microcopy text={microcopy} />
            <FocusHighlight point={focusPoint} isPaused={isFocusPaused} />
        </svg>
    );
};

const MalwareAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <ComputerIcon x={150} y={75} className="text-cyan-400" />
            
            <g className={`transition-opacity duration-500 ${isAfter(2) ? 'opacity-0' : 'opacity-100'}`}>
                {!reducedMotion ? (
                    <g className={`transition-transform duration-1000 ${isAfter(1) ? 'translate-x-[160px]' : ''}`}>
                        <FileIcon x={20} y={90} className="text-blue-400" />
                    </g>
                ): (
                     <FileIcon x={isAfter(1) ? 180: 20} y={90} className="text-blue-400 transition-all duration-500" />
                )}
            </g>

            {isAfter(2) && !showDefense && [...Array(5)].map((_, i) => (
                <FileIcon key={i} x={250 + (i*25)} y={90} className={`transition-colors duration-500 ${isAfter(3) ? 'text-red-500' : 'text-slate-500'}`} />
            ))}

            {showDefense && isAfter(4) && (
                <>
                    {[...Array(5)].map((_, i) => (
                        <FileIcon key={i} x={250 + (i*25)} y={90} className="text-red-500">
                           {!reducedMotion && <animate attributeName="fill" from="#ef4444" to="#64748b" dur="1s" begin={`${i*0.2}s`} fill="freeze" />}
                        </FileIcon>
                    ))}
                    {/* Fix: Use numbers for SVG attributes */}
                    <rect x={0} y={70} width={10} height={80} fill="#32D74B" opacity={0.5} className={`${!isAfter(4) && 'hidden'}`}>
                        {!reducedMotion && <animate attributeName="x" from="0" to="400" dur="2s" fill="freeze" />}
                    </rect>
                </>
            )}
             <Microcopy text={microcopy} />
        </svg>
    );
};
const MitmAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
  const isAfter = (step: number) => currentStep >= step;
  const microcopy = module.animationSteps[currentStep]?.microcopy;
  const attackInProgress = isAfter(1) && !showDefense;
  
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      <ComputerIcon x={20} y={80} className="text-cyan-400" />
      <ComputerIcon x={320} y={80} className={`transition-colors duration-500 ${isAfter(3) && !showDefense ? 'text-red-500' : 'text-cyan-400'}`} />
      
      {attackInProgress && <InterceptorIcon x={180} y={30} className="text-red-500" />}

      {/* Data Stream */}
      {!showDefense && !reducedMotion && [...Array(15)].map((_, i) => {
          const isIntercepted = isAfter(2);
          const startX = 70;
          const endX = 320;
          const midX = 195;
          const midY = 50;

          const path = isIntercepted
              ? `M ${startX} 100 Q ${startX} ${midY}, ${midX} ${midY} T ${endX} 100`
              : `M ${startX} 100 L ${endX} 100`;
          
          const color = isAfter(3) ? '#FF0080' : '#00FFFF';

          return (
              // Fix: Use number for r attribute
              <circle key={i} r={2} fill={color}>
                  <animateMotion path={path} dur={`${2 + Math.random()}s`} begin={`${i * 0.15}s`} repeatCount="indefinite" />
              </circle>
          )
      })}


      {showDefense && isAfter(4) && (
        <>
            {/* Fix: Use numbers for SVG attributes */}
            <rect x={70} y={90} width={250} height={20} rx={10} stroke="#32D74B" strokeWidth={2} fill="none" strokeDasharray="10 5">
                {!reducedMotion && <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1s" repeatCount="indefinite" />}
            </rect>
            <PadlockIcon x={180} y={40} className="text-green-500" />
             {!reducedMotion && [...Array(10)].map((_, i) => (
                // Fix: Use number for r attribute
                <circle key={i} r={2} fill="#32D74B">
                    <animateMotion path="M 70 100 L 320 100" dur="2s" begin={`${i*0.2}s`} repeatCount="indefinite" />
                </circle>
             ))}
        </>
      )}
      <Microcopy text={microcopy} />
    </svg>
  );
};
const SqlInjectionAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
  const isAfter = (step: number) => currentStep >= step;
  const microcopy = module.animationSteps[currentStep]?.microcopy;
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
        <UserIcon x={20} y={80} className="text-cyan-400" />
        {/* Fix: Use numbers for SVG attributes */}
        <rect x={80} y={90} width={100} height={20} rx={2} fill="#1E293B" />
        <DatabaseIcon x={280} y={80} className={`transition-colors duration-500 ${isAfter(3) && !showDefense ? 'text-red-500' : 'text-cyan-400'}`} />

        <CodeIcon x={120} y={92} className={`transition-opacity duration-500 ${isAfter(2) ? 'opacity-100' : 'opacity-0'}`} />

        {isAfter(3) && !showDefense && [...Array(5)].map((_, i) => (
             // Fix: Use numbers for SVG attributes
             <rect key={i} x={280} y={100} width={60} height={5} fill="#FF0080" className="opacity-0">
                {!reducedMotion && <animateMotion path={`M 0 0 L ${-50 - Math.random()*50} 0`} dur="2s" begin={`${i*0.2}s`} fill="freeze" />}
                <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin={`${i*0.2}s`} fill="freeze" />
             </rect>
        ))}

        {showDefense && isAfter(4) && (
            <g>
                {/* Fix: Use numbers for SVG attributes */}
                <line x1={220} y1={80} x2={220} y2={120} stroke="#32D74B" strokeWidth={4} />
                <text x={225} y={75} fill="#32D74B" fontSize={10}>Sanitizer</text>
                <CodeIcon x={180} y={92} className="text-red-500">
                    {!reducedMotion && <animateMotion path="M 0 0 L 20 -20" dur="0.5s" begin="0.2s" fill="freeze" />}
                </CodeIcon>
            </g>
        )}
        <Microcopy text={microcopy} />
    </svg>
  );
};
const XssAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
        <UserIcon x={20} y={80} className="text-red-500" />
        <CommentIcon x={80} y={90} className={`transition-opacity duration-500 ${isAfter(2) ? 'opacity-100' : 'opacity-0'}`} />
        <CodeIcon x={95} y={98} className={`transition-opacity duration-500 ${isAfter(2) ? 'opacity-100' : 'opacity-0'}`} />

        {[...Array(3)].map((_, i) => (
            <UserIcon key={i} x={280} y={20 + i*60} className="text-cyan-400" />
        ))}
        
        {isAfter(3) && !showDefense && [...Array(3)].map((_, i) => (
            <CookieIcon key={i} x={330} y={30 + i*60} className="text-yellow-400">
                {!reducedMotion && <animateMotion path="M 0 0 L -200 50" dur="2s" begin={`${i*0.2}s`} fill="freeze" />}
            </CookieIcon>
        ))}

        {showDefense && isAfter(4) && (
            <>
                <ShieldIcon x={150} y={70} className="text-green-500" />
                <CodeIcon x={95} y={98} className="text-red-500 opacity-50" />
                {/* Fix: Use number for strokeWidth */}
                <line x1={100} y1={100} x2={120} y2={120} stroke="red" strokeWidth={2} />
                <line x1={100} y1={120} x2={120} y2={100} stroke="red" strokeWidth={2} />
            </>
        )}
        <Microcopy text={microcopy} />
    </svg>
  );
};
const PasswordAttackAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <CodeIcon x={20} y={80} className="text-red-500 scale-150" />
            <PadlockIcon x={300} y={80} className={`text-cyan-400 scale-[2] ${isAfter(3) && !showDefense ? 'text-red-500' : ''}`} />

            {isAfter(2) && !showDefense && [...Array(10)].map((_, i) => (
                // Fix: Use number for r attribute
                <circle key={i} r={2} fill="#FF0080" cx={60} cy={100}>
                    {!reducedMotion && <animateMotion path={`M 0 0 L 250 0`} dur="1s" begin={`${i*0.1}s`} repeatCount="indefinite" />}
                </circle>
            ))}

            {showDefense && isAfter(4) && (
                <>
                    <ShieldIcon x={250} y={30} className="text-green-500" />
                    {/* Fix: Use number for fontSize */}
                    <text x={280} y={140} fill="#32D74B" fontSize={10}>2FA Enabled</text>
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};
const InsiderThreatAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Fix: Use numbers for SVG attributes */}
            <rect x={10} y={10} width={380} height={180} rx={10} stroke="#00FFFF" strokeDasharray="5 5" fill="none" />
            <text x={20} y={30} fill="#00FFFF" fontSize={10}>Company Network</text>
            <UserIcon x={40} y={80} className="text-yellow-400" />

            <FileIcon x={150} y={90} className="text-cyan-400" />
            <FileIcon x={180} y={90} className="text-cyan-400" />

            {isAfter(2) && !showDefense && (
                // FIX: Wrap icon in a 'g' tag for positioning to avoid type conflicts with animation transforms.
                <g transform="translate(300, 90)">
                    <UsbIcon className="text-red-500">
                        {!reducedMotion && (
                            <animateTransform attributeName="transform" type="translate" from="0 0" to="-120 0" dur="2s" fill="freeze" additive="sum" />
                        )}
                    </UsbIcon>
                </g>
            )}
            
            {showDefense && isAfter(4) && (
                <>
                    <FileIcon x={180} y={90} className="text-slate-600" />
                    <PadlockIcon x={185} y={85} className="text-green-500" />
                    {/* Fix: Use number for fontSize */}
                    <text x={150} y={70} fill="#32D74B" fontSize={10}>Access Denied</text>
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};
const SupplyChainAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <ServerIcon x={20} y={80} className={`transition-colors duration-500 ${isAfter(2) ? 'text-red-500' : 'text-cyan-400'}`} />
            {/* Fix: Use number for fontSize */}
            <text x={15} y={135} fontSize={8} fill="#FFF">Vendor</text>

            {[...Array(5)].map((_, i) => (
                <ComputerIcon key={i} x={200 + (i%2 * 100)} y={20 + Math.floor(i/2)*60} className={`transition-colors duration-500 ${isAfter(3) && !showDefense ? 'text-red-500' : 'text-cyan-400'}`} />
            ))}

            {isAfter(3) && !showDefense && [...Array(5)].map((_, i) => (
                // Fix: Use number for r attribute
                <circle key={i} r={2} fill="#FF0080" cx={80} cy={100}>
                    {!reducedMotion && <animateMotion path={`M 0 0 L ${120 + (i%2 * 100)} ${-80 + Math.floor(i/2)*60}`} dur="2s" begin={`${i*0.1}s`} fill="freeze" />}
                </circle>
            ))}

            {showDefense && isAfter(4) && (
                <SignatureIcon x={120} y={80} className="text-green-500" />
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};
const ZeroDayAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <ComputerIcon x={170} y={80} className={`transition-colors duration-500 ${isAfter(3) && !showDefense ? 'text-red-500' : 'text-cyan-400'}`} />
            {/* Vulnerability */}
            {/* Fix: Use numbers for SVG attributes */}
            <circle cx={200} cy={100} r={5} fill="black" stroke="#FF0080" strokeWidth={1} className={`transition-opacity duration-500 ${isAfter(1) ? 'opacity-100' : 'opacity-0'}`} />

            {isAfter(2) && !showDefense && (
                 // Fix: Use number for strokeWidth
                 <path d="M 50 100 L 195 100" stroke="#FF0080" strokeWidth={2} fill="none">
                    <animate attributeName="stroke-dasharray" from="0 145" to="145 0" dur="1s" fill="freeze" />
                 </path>
            )}
            
            {showDefense && isAfter(4) && (
                <>
                    <PatchIcon x="190" y="90" className="text-green-500" />
                    {/* Fix: Use number for strokeWidth */}
                    <circle cx={200} cy={100} r={5} fill="none" stroke="#32D74B" strokeWidth={1} />
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};
const AdwareAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* FIX: Wrap icon in 'g' tag for positioning to avoid conflicts between CSS and SVG transforms. */}
            <g transform="translate(170, 80)" className={`transition-transform duration-500 ${isAfter(3) && !showDefense ? 'scale-95' : ''}`}>
                <ComputerIcon>
                    {isAfter(3) && !showDefense && !reducedMotion && <animateTransform attributeName="transform" type="translate" values="0 0; 1 -1; -1 1; 0 0" dur="0.3s" repeatCount="indefinite" additive="sum"/>}
                </ComputerIcon>
            </g>
            
            {isAfter(2) && !showDefense && [...Array(5)].map((_, i) => (
                <PopupIcon key={i} x={Math.random() * 300} y={Math.random() * 150} className="text-magenta-500 opacity-0">
                    {!reducedMotion && <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${i*0.3}s`} fill="freeze" />}
                </PopupIcon>
            ))}
            
            {showDefense && isAfter(4) && (
                <>
                    <ShieldIcon x={50} y={60} className="text-green-500" />
                    {/* Fix: Use number for fontSize */}
                    <text x={40} y={160} fill="#32D74B" fontSize={10}>Ad-Blocker</text>
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};
const KeyloggerAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <UserIcon x={20} y={80} className="text-cyan-400" />
            <KeyboardIcon x={100} y={100} className="text-slate-400" />
            <InterceptorIcon x={320} y={20} className={`text-red-500 transition-opacity duration-500 ${isAfter(3) && !showDefense ? 'opacity-100' : 'opacity-0'}`} />

            {isAfter(2) && !showDefense && [...Array(10)].map((_, i) => (
                // FIX: Wrap text node in curly braces for correct JSX parsing.
                // Fix: Use number for fontSize
                <text key={i} x={105 + (i*5)} y={110} fill="#FF0080" fontSize={8} className="opacity-0">
                    {'*'}
                    {!reducedMotion && <animate attributeName="opacity" values="0;1;0" dur="1s" begin={`${i*0.2}s`} repeatCount="indefinite" />}
                </text>
            ))}

            {isAfter(3) && !showDefense && !reducedMotion && (
                // Fix: Use number for strokeWidth
                <path d="M 150 100 Q 250 50, 350 40" stroke="#FF0080" strokeWidth={1} fill="none">
                    <animate attributeName="stroke-dasharray" from="5 5" to="5 5" values="0 250; 250 0" dur="2s" begin="0.5s" fill="freeze" />
                </path>
            )}

            {showDefense && isAfter(4) && (
                 // Fix: Use numbers for SVG attributes
                 <rect x={90} y={40} width={100} height={50} fill="#0B0C10" stroke="#32D74B" rx={5}>
                    <animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" />
                 </rect>
            )}
             {showDefense && isAfter(4) && (
                // Fix: Use numbers for SVG attributes
                <text x={100} y={35} fill="#32D74B" fontSize={10}>On-Screen Keyboard</text>
             )}
            <Microcopy text={microcopy} />
        </svg>
    );
};

const DataBreachAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <DatabaseIcon x={50} y={80} className={`transition-colors duration-500 ${isAfter(2) && !showDefense ? 'text-red-500' : 'text-cyan-400'}`} />
            <InterceptorIcon x={320} y={20} className={`text-red-500 transition-opacity duration-500 ${isAfter(3) && !showDefense ? 'opacity-100' : 'opacity-0'}`} />
            
            {isAfter(2) && !showDefense && [...Array(10)].map((_,i) => (
                <DataBreachIcon key={i} x={100} y={100} className="text-red-500 opacity-0">
                    {!reducedMotion && <animateMotion path={`M 0 0 L ${180 + Math.random()*40} ${-60 + Math.random()*20}`} dur="2s" begin={`${i*0.1}s`} fill="freeze" />}
                    <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin={`${i * 0.1}s`} fill="freeze" />
                </DataBreachIcon>
            ))}
            
            {showDefense && isAfter(4) && (
                <>
                    <PadlockIcon x={150} y={40} className="text-green-500 scale-150" />
                    {/* Fix: Use number for fontSize */}
                    <text x={120} y={140} fill="#32D74B" fontSize={10}>Data Encrypted</text>
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};

const SpoofingAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <UserIcon x={20} y={80} className="text-cyan-400" />

            <g className={`transition-opacity duration-500 ${isAfter(1) ? 'opacity-100' : 'opacity-0'}`}>
                <BrowserIcon x={100} y={50} className="text-red-500" />
                {/* Fix: Use number for fontSize */}
                <text x={135} y={68} fill="white" fontSize={8}>mybanc.com</text>
                <PadlockIcon x={115} y={60} className="text-red-500" />
            </g>

            {isAfter(2) && !showDefense && (
                 // Fix: Use number for strokeWidth
                 <path d="M 60 100 L 150 75" stroke="#FF0080" strokeWidth={2} fill="none">
                    <animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="1s" fill="freeze" />
                 </path>
            )}

            {showDefense && isAfter(4) && (
                <>
                    <BrowserIcon x={100} y={50} className="text-green-500" />
                    {/* Fix: Use number for fontSize */}
                    <text x={135} y={68} fill="white" fontSize={8}>mybank.com</text>
                    <PadlockIcon x={115} y={60} className="text-green-500" />
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};

const ClickjackingAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* The hidden button */}
            <g className={`transition-opacity duration-500 ${isAfter(1) ? 'opacity-100' : 'opacity-0'}`}>
                {/* Fix: Use numbers for SVG attributes */}
                <rect x={120} y={80} width={160} height={40} rx={5} fill="#FF0080" />
                <text x={200} y={105} textAnchor="middle" fill="white" fontSize={12}>Buy Now!</text>
            </g>
            {/* The visible button */}
            <g className={`transition-opacity duration-500 ${isAfter(2) ? 'opacity-20' : 'opacity-100'}`}>
                {/* Fix: Use numbers for SVG attributes */}
                <rect x={120} y={80} width={160} height={40} rx={5} fill="#00FFFF" />
                <text x={200} y={105} textAnchor="middle" fill="black" fontSize={12}>Play Video</text>
            </g>
            
            <CursorIcon x={80} y={100} className={`text-white transition-transform duration-1000 ${isAfter(2) ? 'translate-x-[50px] translate-y-[-10px]' : ''}`} />

            {showDefense && isAfter(4) && (
                <>
                    {/* Fix: Use number for strokeWidth */}
                    <line x1={120} y1={80} x2={280} y2={120} stroke="red" strokeWidth={3} />
                    <line x1={120} y1={120} x2={280} y2={80} stroke="red" strokeWidth={3} />
                    {/* Fix: Use number for fontSize */}
                    <text x={130} y={70} fill="#32D74B" fontSize={10}>Browser blocked frame</text>
                </>
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};

const RootkitAnimation: React.FC<AnimationComponentProps> = ({ module, currentStep, showDefense, reducedMotion }) => {
    const isAfter = (step: number) => currentStep >= step;
    const microcopy = module.animationSteps[currentStep]?.microcopy;
    return (
        <svg viewBox="0 0 400 200" className="w-full h-full">
            <ComputerIcon x={170} y={80} className={`transition-colors duration-500 ${isAfter(3) && !showDefense ? 'text-red-500' : 'text-cyan-400'}`} />
            {/* Fix: Use numbers for SVG attributes */}
            <rect x={180} y={90} width={40} height={10} fill="#0f172a" />
            <text x={182} y={98} fill="#64748b" fontSize={6}>OS Core</text>

            <RootkitIcon x={190} y={105} className={`text-red-500 transition-opacity duration-500 ${isAfter(1) && !showDefense ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Antivirus Scan */}
            <g className={`transition-opacity duration-500 ${isAfter(2) && currentStep < 4 ? 'opacity-100' : 'opacity-0'}`}>
                {/* Fix: Use numbers for SVG attributes */}
                <rect x={175} y={85} width={50} height={30} fill="none" stroke="#32D74B" strokeDasharray="2 2">
                    {!reducedMotion && <animate attributeName="stroke-dashoffset" from="160" to="0" dur="2s" repeatCount="indefinite" />}
                </rect>
            </g>

            {showDefense && isAfter(4) && (
                <ShieldIcon x={100} y={60} className="text-green-500" />
            )}
            <Microcopy text={microcopy} />
        </svg>
    );
};


const DefaultAnimation: React.FC<{ module: AttackModuleData }> = ({ module }) => (
  <div className="text-center text-slate-500">
    <h3 className="text-xl font-bold">{module.title}</h3>
    <p>Animation coming soon!</p>
  </div>
);