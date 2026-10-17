
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { SimulationStep } from '../types';
import { STEPS, COLORS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';
import { Building2, Users, ArrowRightLeft, TrendingUp, AlertTriangle, Lightbulb, GraduationCap } from 'lucide-react';

interface SimulationStageProps {
  step: SimulationStep;
  isSimplified: boolean;
}

const AnimatedPrice: React.FC<{ value: number }> = ({ value }) => {
  const springValue = useSpring(value, { stiffness: 60, damping: 20 });
  const displayValue = useTransform(springValue, (latest) => latest.toFixed(2));
  const prevValueRef = useRef(value);
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (value > prevValueRef.current) setDirection('up');
    else if (value < prevValueRef.current) setDirection('down');

    springValue.set(value);
    prevValueRef.current = value;

    const timer = setTimeout(() => setDirection('neutral'), 600);
    return () => clearTimeout(timer);
  }, [value, springValue]);

  const colorClass = direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-rose-400' : 'text-emerald-400';

  return (
    <motion.span
      animate={{ scale: direction !== 'neutral' ? 1.05 : 1 }}
      className={`font-black transition-colors duration-300 ${colorClass}`}
    >
      $<motion.span>{displayValue}</motion.span>
    </motion.span>
  );
};

const SimulationStage: React.FC<SimulationStageProps> = ({ step, isSimplified }) => {
  const stepData = STEPS.find(s => s.id === step);
  const [livePoints, setLivePoints] = useState<{ time: number, price: number }[]>([]);
  const [isChartHovered, setIsChartHovered] = useState(false);
  const lastPriceRef = useRef(140);
  const timeRef = useRef(0);

  const marketData = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      time: i,
      price: 50 + Math.sin(i / 2) * 5 + i * 1.5 + (Math.random() * 2),
      trend: 50 + i * 1.5
    }));
  }, []);

  const riskData = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      let price = 100 + i * 0.5;
      if (i > 15 && i < 25) price -= 30;
      if (i >= 25) price = 70 + (i - 25) * 2;
      return { time: i, price };
    });
  }, []);

  useEffect(() => {
    if (step === SimulationStep.PRICE_MOVEMENT) {
      const initialPoints = Array.from({ length: 20 }, (_, i) => {
        const p = 130 + Math.random() * 10;
        timeRef.current = i;
        lastPriceRef.current = p;
        return { time: i, price: p };
      });
      setLivePoints(initialPoints);

      const interval = setInterval(() => {
        setLivePoints(prev => {
          const nextTime = timeRef.current + 1;
          const change = (Math.random() - 0.45) * 4;
          const nextPrice = Math.max(10, lastPriceRef.current + change);
          timeRef.current = nextTime;
          lastPriceRef.current = nextPrice;
          const newPoints = [...prev, { time: nextTime, price: nextPrice }];
          if (newPoints.length > 30) return newPoints.slice(1);
          return newPoints;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const currentLivePrice = livePoints.length > 0 ? livePoints[livePoints.length - 1].price : 142.50;

  const renderContent = () => {
    switch (step) {
      case SimulationStep.COMPANY_NEEDS_MONEY:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-40 h-40 md:w-56 md:h-56 bg-cyan-500/10 rounded-3xl border-2 border-cyan-500/30 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Building2 size={80} className="text-cyan-400" />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-6 bg-cyan-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter"
                >
                  Growth Mode
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">ElectricBikes Co.</h3>
              <div className="text-cyan-400 font-mono tracking-[0.2em] text-[10px] uppercase font-black py-1 px-4 bg-cyan-900/20 rounded-full border border-cyan-500/20">
                STATUS: EXPANSION PHASE
              </div>
            </motion.div>
          </div>
        );

      case SimulationStep.SHARES_CREATED:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-12">
            <div className="grid grid-cols-10 gap-1.5 w-64 h-64 p-4 glass-panel border-slate-800">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className="w-full aspect-square bg-cyan-500/20 rounded-sm border border-cyan-400/30 hover:bg-cyan-400/60 transition-colors"
                />
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="text-lg font-bold text-white uppercase tracking-widest">Ownership Divided</div>
              <div className="text-slate-400 text-sm mt-1">1,000,000 shares ready for participation</div>
            </motion.div>
          </div>
        );

      case SimulationStep.INVESTORS_BUY:
        return (
          <div className="flex flex-col md:flex-row items-center justify-center h-full p-8 gap-16 relative">
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Users size={40} className="text-emerald-400" />
              </div>
              <div className="text-emerald-400 font-black text-[10px] tracking-widest uppercase">Investors</div>
            </motion.div>

            <div className="flex flex-col items-center justify-center w-32 h-1 bg-slate-800 relative">
              <motion.div
                animate={{ left: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"
              />
              <span className="absolute -top-6 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Funds In</span>
            </div>

            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Building2 size={40} className="text-cyan-400" />
              </div>
              <div className="text-cyan-400 font-black text-[10px] tracking-widest uppercase">Company</div>
            </motion.div>
          </div>
        );

      case SimulationStep.MARKET_CONNECTS:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="relative w-64 h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-dashed border-indigo-500/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/50 flex items-center justify-center shadow-2xl">
                  <ArrowRightLeft className="text-indigo-400" size={32} />
                </div>
              </div>
              {/* Nodes representing connections */}
              {[0, 90, 180, 270].map((deg) => (
                <motion.div
                  key={deg}
                  style={{ transform: `rotate(${deg}deg) translateY(-100px)` }}
                  className="absolute top-1/2 left-1/2 -ml-3 -mt-3 w-6 h-6 rounded bg-slate-800 border border-slate-700"
                />
              ))}
            </div>
            <div className="mt-12 text-indigo-400 font-black text-[10px] tracking-[0.3em] uppercase">The Global Exchange</div>
          </div>
        );

      case SimulationStep.PRICE_MOVEMENT:
        return (
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-800/50">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Price Discovery</h3>
                <p className="text-xs text-slate-500">Fluctuating based on market activity (Hover for details)</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Live Feed</div>
                <div className="text-3xl font-black bg-slate-900/50 px-4 py-1 rounded-lg border border-slate-800 min-w-[140px] text-center">
                  <AnimatedPrice value={currentLivePrice} />
                </div>
              </div>
            </div>
            <div
              className="flex-1 min-h-0 bg-slate-950/30 rounded-2xl border border-slate-800/50 p-6 shadow-inner relative overflow-hidden"
              onMouseEnter={() => setIsChartHovered(true)}
              onMouseLeave={() => setIsChartHovered(false)}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={livePoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} opacity={isChartHovered ? 0.4 : 0} />
                  <XAxis
                    dataKey="time"
                    hide={!isChartHovered}
                    stroke="#475569"
                    tick={{ fill: '#475569', fontSize: 10 }}
                    tickLine={{ stroke: '#475569' }}
                  />
                  <YAxis
                    hide={!isChartHovered}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    stroke="#475569"
                    tick={{ fill: '#475569', fontSize: 10 }}
                    tickLine={{ stroke: '#475569' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8', fontSize: '10px' }}
                    itemStyle={{ color: '#00FFA3', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#00FFA3"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                  {livePoints.length > 0 && (
                    <ReferenceDot
                      x={livePoints[livePoints.length - 1].time}
                      y={livePoints[livePoints.length - 1].price}
                      r={8}
                      fill="#00FFA3"
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  )}
                  {livePoints.length > 0 && (
                    <ReferenceLine
                      y={livePoints[livePoints.length - 1].price}
                      stroke="#00FFA3"
                      strokeDasharray="3 3"
                      opacity={0.3}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case SimulationStep.LONG_TERM_GROWTH:
        return (
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white tracking-tight">Patience Rewards Growth</h3>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                10+ Year Trend
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-slate-950/30 rounded-2xl border border-slate-800/50 p-6 relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} opacity={0.5} />
                  <Line type="monotone" dataKey="price" stroke="#3BF0FF" strokeWidth={1.5} dot={false} opacity={0.2} />
                  <Line type="monotone" dataKey="trend" stroke="#00FFA3" strokeWidth={4} dot={false} strokeDasharray="10 10" />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-800 tracking-[1em] pointer-events-none">COMPOUNDING</div>
            </div>
          </div>
        );

      case SimulationStep.MARKET_RISK:
        return (
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Market Cycles</h3>
                <p className="text-xs text-slate-500 italic">Volatility is expected and manageable.</p>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-slate-950/30 rounded-2xl border border-rose-900/10 p-6 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskData}>
                  <Line type="stepAfter" dataKey="price" stroke="#FF4D4D" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case SimulationStep.MYTH_VS_REALITY:
        return (
          <div className="flex flex-col md:flex-row items-center justify-center h-full gap-8 p-12">
            <div className="flex-1 glass-panel p-6 border-rose-500/10 text-center flex flex-col items-center gap-3">
              <div className="text-rose-500 font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-rose-500/5 border border-rose-500/20 rounded-full">Common Myth</div>
              <h4 className="text-lg font-bold text-white">"A Quick Shortcut"</h4>
              <p className="text-xs text-slate-400">Thinking you can double your money overnight.</p>
            </div>
            <div className="flex-1 glass-panel p-6 border-emerald-500/10 text-center flex flex-col items-center gap-3">
              <div className="text-emerald-500 font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full">The Reality</div>
              <h4 className="text-lg font-bold text-white">"Business Ownership"</h4>
              <p className="text-xs text-slate-400">Participating in a company's success over decades.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10">
      {/* Background Watermark Number */}
      <div className="absolute top-0 right-8 text-[18rem] font-black text-white/[0.02] select-none leading-none z-0">
        {step + 1}
      </div>

      {/* Header Container */}
      <div className="px-8 pt-8 pb-4 flex flex-col gap-1 z-10 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-cyan-500 py-1 px-2 bg-cyan-500/10 rounded">MODULE 0{step + 1}</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">{stepData?.title}</h2>
          </div>
          {stepData?.status && (
            <div className={`px-4 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase flex items-center gap-2 ${stepData.status.includes('VOLATILITY') ? 'border-amber-500/40 text-amber-500 bg-amber-500/10' : 'border-cyan-500/40 text-cyan-500 bg-cyan-500/10'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${stepData.status.includes('VOLATILITY') ? 'bg-amber-500' : 'bg-cyan-500'}`} />
              {stepData.status.replace('_', ' ')}
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm">{stepData?.shortDesc}</p>
      </div>

      {/* Main Animation Area */}
      <div className="flex-1 relative min-h-[300px] z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Narrative Footer */}
      <div className="px-8 py-6 bg-slate-900/40 border-t border-slate-800/50 backdrop-blur-md z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <Info className="text-cyan-500 shrink-0 mt-1" size={18} />
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{stepData?.longDesc}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple local Info icon since it's used in footer
const Info = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);

export default SimulationStage;
