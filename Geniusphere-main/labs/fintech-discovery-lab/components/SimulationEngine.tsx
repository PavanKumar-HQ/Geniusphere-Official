
import React, { useState, useEffect } from 'react';
import { ModuleId, SimStatus } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SimulationEngineProps {
  moduleId: ModuleId;
  status: SimStatus;
  simplified: boolean;
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({ moduleId, status, simplified }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (status === 'reset') {
      setStep(0);
      return;
    }

    if (status === 'playing') {
      const interval = setInterval(() => {
        setStep(s => (s + 1) % 100);
      }, simplified ? 80 : 40);
      return () => clearInterval(interval);
    }
  }, [status, simplified]);

  const renderModuleSim = () => {
    switch (moduleId) {
      case ModuleId.WHAT_IS_FINTECH:
        return (
          <div className="flex flex-col md:flex-row items-center justify-around h-full gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-gray-400 text-sm uppercase">Traditional (Slow)</div>
              <div className="relative w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <div className="flex flex-col gap-2 w-3/4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" style={{ opacity: Math.max(0.2, 1 - (step % 20) / 10) }} />
                  ))}
                </div>
                <div className="absolute -bottom-10 text-xs text-red-400">Queue time: {Math.floor(step / 2)}h</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-400">vs</div>
            <div className="flex flex-col items-center gap-4">
              <div className="text-gray-400 text-sm uppercase">FinTech (Instant)</div>
              <div className="relative w-48 h-48 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-500/50">
                <div className={`w-16 h-16 rounded-full border-4 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent animate-spin ${step > 5 ? 'hidden' : ''}`} />
                <div className={`text-blue-400 text-4xl transform transition-transform ${step > 5 ? 'scale-100' : 'scale-0'}`}>✓</div>
                <div className="absolute -bottom-10 text-xs text-green-400">Processing: 0.2s</div>
              </div>
            </div>
          </div>
        );

      case ModuleId.DIGITAL_PAYMENTS:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-64 h-80 glass-card p-6 flex flex-col items-center gap-6 border-green-500/30">
              <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center">
                <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`bg-black rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">Scanning QR...</div>
                <div className="text-lg font-bold text-green-400 mt-2">$24.00 to Coffee Shop</div>
              </div>
              <div className={`w-full py-2 bg-green-500/20 text-green-400 text-center rounded border border-green-500/50 transition-opacity ${step % 20 > 10 ? 'opacity-100' : 'opacity-20'}`}>
                CONFIRMED
              </div>
            </div>
            {step % 20 > 5 && (
              <div className="absolute top-1/4 right-1/4 animate-bounce bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                +$24.00
              </div>
            )}
          </div>
        );

      case ModuleId.ONLINE_BANKING:
        return (
          <div className="w-full h-full p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400">Current Balance</div>
                <div className="text-3xl font-bold text-blue-400 font-mono">$12,450.00</div>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-full px-4 text-xs text-blue-400 border border-blue-500/30">Active</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 border-blue-500/20">
                <div className="text-xs text-gray-500 uppercase">Savings</div>
                <div className="text-lg font-semibold text-white">$8,200</div>
              </div>
              <div className="glass-card p-4 border-blue-500/20">
                <div className="text-xs text-gray-500 uppercase">Checking</div>
                <div className="text-lg font-semibold text-white">$4,250</div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="text-xs text-gray-400 uppercase">Recent Transactions</div>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-2 glass-card border-none bg-white/5">
                  <div className="text-sm">Transaction #{1000 + i}</div>
                  <div className="text-sm text-red-400">-$20.00</div>
                </div>
              ))}
            </div>
          </div>
        );

      case ModuleId.UPI_MOBILE_WALLETS:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-12">
            <div className="flex gap-16 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center border border-gray-700">📱</div>
                <div className="text-xs text-gray-400">Sender</div>
              </div>
              <div className="relative w-48 h-2 bg-gray-800 rounded">
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full"
                  style={{ left: `${step % 100}%` }} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center border border-gray-700">📱</div>
                <div className="text-xs text-gray-400">Receiver</div>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-64 text-center">
              <div className="text-xs text-gray-400">Network Layer</div>
              <div className="text-sm text-blue-400 font-mono mt-1">UPI://SYNC_SUCCESS</div>
            </div>
          </div>
        );

      case ModuleId.SECURITY:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-colors duration-500 ${step % 40 < 20 ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700'}`}>
              <span className="text-3xl">{step % 40 < 10 ? '🔑' : step % 40 < 20 ? '💬' : step % 40 < 30 ? '👆' : '👤'}</span>
            </div>
            <div className="space-y-3 w-64">
              <div className={`h-2 rounded bg-cyan-500 transition-all duration-500`} style={{ width: `${Math.min(100, (step % 40) * 5)}%` }} />
              <div className="text-center text-sm font-mono text-cyan-400">
                {step % 40 < 10 && "STAGES: PASSWORD_MATCH"}
                {step % 40 >= 10 && step % 40 < 20 && "STAGES: OTP_VERIFIED"}
                {step % 40 >= 20 && step % 40 < 30 && "STAGES: BIOMETRIC_SCAN"}
                {step % 40 >= 30 && "STAGES: AUTH_COMPLETE"}
              </div>
            </div>
          </div>
        );

      case ModuleId.FRAUD_DETECTION:
        const isFraud = step % 40 > 25;
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 relative overflow-hidden">
            <div className="w-full px-12 space-y-4">
              <div className="flex justify-between items-center glass-card p-3">
                <div className="text-xs">Location: Tokyo, JP</div>
                <div className="text-xs text-green-400">Trust: 98%</div>
              </div>
              <div className={`flex justify-between items-center glass-card p-3 border-red-500/50 transition-all ${isFraud ? 'bg-red-900/40 translate-x-1' : ''}`}>
                <div className="text-xs">Location: Unknown IP</div>
                <div className={`text-xs ${isFraud ? 'text-red-500 font-bold animate-pulse' : 'text-gray-400'}`}>
                  {isFraud ? 'FRAUD_DETECTED' : 'Scanning...'}
                </div>
              </div>
            </div>
            {isFraud && (
              <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-red-500 rounded-lg p-6 rotate-12 bg-black/80">
                  <div className="text-red-500 font-black text-2xl">BLOCKED</div>
                </div>
              </div>
            )}
          </div>
        );

      case ModuleId.DIGITAL_LENDING:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="w-64 glass-card p-6 flex flex-col gap-4">
              <div className="text-sm font-semibold">Micro-Loan Application</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Credit Score Analysis</span>
                  <span>{Math.min(750, 400 + (step % 50) * 7)}</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
                  <div className="bg-purple-500 h-full transition-all" style={{ width: `${Math.min(100, step % 100)}%` }} />
                </div>
              </div>
              <div className={`p-2 rounded text-center text-sm font-bold transition-all ${step % 100 > 80 ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                {step % 100 > 80 ? "APPROVE REQUEST" : "CALCULATING RISK..."}
              </div>
            </div>
          </div>
        );

      case ModuleId.INVESTING_APPS:
        const chartData = Array.from({ length: 20 }, (_, i) => ({
          time: i,
          val: 1000 + (i * 50) + Math.random() * 100
        }));
        return (
          <div className="w-full h-full p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-400">Total Investments</div>
                <div className="text-2xl font-bold text-white">$2,450.80</div>
                <div className="text-xs text-green-400">+12% Growth</div>
              </div>
              <div className="bg-white/5 p-2 rounded text-xs">Long Term Mode</div>
            </div>
            <div className="flex-1 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="val" stroke="#7C6BFF" strokeWidth={2} dot={false} />
                  <XAxis hide />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip content={() => null} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-500 text-center italic">Investing involves risk. Be patient.</div>
          </div>
        );

      case ModuleId.DAILY_LIFE:
        const icons = ["🍔", "🍿", "🎓", "🚌", "🛍️"];
        return (
          <div className="w-full h-full p-8 flex flex-wrap items-center justify-center gap-6">
            {icons.map((icon, idx) => (
              <div key={idx} className={`w-20 h-20 glass-card flex flex-col items-center justify-center gap-1 transition-all transform ${step % 20 === idx ? 'scale-110 border-blue-400' : 'opacity-50'}`}>
                <span className="text-2xl">{icon}</span>
                <span className="text-[10px] uppercase text-gray-400">Paid</span>
              </div>
            ))}
            <div className="w-full text-center mt-4">
              <div className="text-xs text-gray-400">Everything connects back to your digital wallet.</div>
            </div>
          </div>
        );

      case ModuleId.RESPONSIBLE_USE:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="grid grid-cols-2 gap-4 w-full px-8">
              <div className={`p-4 glass-card border-none transition-all ${step % 20 < 10 ? 'bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-white/5'}`}>
                <div className="text-lg mb-1">Budgeting</div>
                <div className="text-[10px] text-gray-400 uppercase">Status: Controlled</div>
              </div>
              <div className={`p-4 glass-card border-none transition-all ${step % 20 >= 10 ? 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5'}`}>
                <div className="text-lg mb-1">Security</div>
                <div className="text-[10px] text-gray-400 uppercase">Status: Alert</div>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-3/4 text-center">
              <div className="text-sm font-medium">Smart User Check</div>
              <div className="text-xs text-gray-400 mt-2 italic">"I never share my password and I check my spending daily."</div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500 italic">Select a module to start simulation</div>;
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0A0F21] rounded-xl overflow-hidden shadow-2xl border border-white/5">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      {renderModuleSim()}
    </div>
  );
};

export default SimulationEngine;
