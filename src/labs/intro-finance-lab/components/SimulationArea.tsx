
import React, { useMemo } from 'react';
import { ModuleId, FinanceModule } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface SimProps {
  moduleId: ModuleId;
  simStep: number;
  isSimplified: boolean;
  moduleData: FinanceModule;
}

const SimulationArea: React.FC<SimProps> = ({ moduleId, simStep, isSimplified, moduleData }) => {
  const statusColors = {
    green: 'bg-income/20 text-income border-income/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    red: 'bg-expense/20 text-expense border-expense/30',
    blue: 'bg-savings/20 text-savings border-savings/30',
    purple: 'bg-growth/20 text-growth border-growth/30'
  };

  const renderSim = () => {
    switch (moduleId) {
      case ModuleId.WHAT_IS_MONEY:
        return <Module1 simStep={simStep} />;
      case ModuleId.INCOME_EXPENSES:
        return <Module2 simStep={simStep} isSimplified={isSimplified} />;
      case ModuleId.BUDGETING:
        return <Module3 isSimplified={isSimplified} />;
      case ModuleId.SAVING:
        return <Module4 simStep={simStep} />;
      case ModuleId.BANKING:
        return <Module5 simStep={simStep} />;
      case ModuleId.INTEREST:
        return <Module6 isSimplified={isSimplified} />;
      case ModuleId.INVESTMENT:
        return <Module7 isSimplified={isSimplified} />;
      case ModuleId.RISK_REWARD:
        return <Module8 isSimplified={isSimplified} />;
      case ModuleId.DIGITAL_PAYMENTS:
        return <Module9 simStep={simStep} />;
      case ModuleId.DISCIPLINE:
        return <Module10 isSimplified={isSimplified} />;
      default:
        return <div className="text-white/30 text-center py-20">Simulation Loading...</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{moduleData.title.split('. ')[1]}</h2>
          <p className="text-white/60 text-lg max-w-2xl">{moduleData.description}</p>
        </div>
        {moduleData.statusLabel && (
          <div className={`px-4 py-2 rounded-full border text-xs font-mono font-bold tracking-widest ${statusColors[moduleData.statusColor || 'blue']}`}>
            {moduleData.statusLabel}
          </div>
        )}
      </div>

      <div className="flex-1 glass rounded-3xl border-white/10 p-8 flex flex-col overflow-hidden relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
        </div>
        {renderSim()}
      </div>
    </div>
  );
};

/* --- Module 1: What is Money --- */
const Module1: React.FC<{ simStep: number }> = ({ simStep }) => {
  const stage = Math.floor(simStep / 33.4) % 3;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12">
      <div className="flex items-center gap-16">
        <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${stage === 0 ? 'scale-125 opacity-100' : 'scale-90 opacity-20 grayscale'}`}>
          <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center text-5xl">🍎</div>
          <span className="text-xs font-mono uppercase tracking-widest">Barter</span>
        </div>
        <div className="text-white/20 text-2xl font-bold">→</div>
        <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${stage === 1 ? 'scale-125 opacity-100' : 'scale-90 opacity-20 grayscale'}`}>
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-5xl">💵</div>
          <span className="text-xs font-mono uppercase tracking-widest">Cash</span>
        </div>
        <div className="text-white/20 text-2xl font-bold">→</div>
        <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${stage === 2 ? 'scale-125 opacity-100' : 'scale-90 opacity-20 grayscale'}`}>
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center text-5xl">📱</div>
          <span className="text-xs font-mono uppercase tracking-widest">Digital</span>
        </div>
      </div>
      <div className="glass p-6 rounded-2xl max-w-lg text-center border-white/5">
        <p className="text-white/80 leading-relaxed italic">
          {stage === 0 && "In the past, people traded goods like apples for wheat. This was hard!"}
          {stage === 1 && "Later, paper money made it easier to set a clear price for everything."}
          {stage === 2 && "Today, money is mostly digital bits moving between devices instantly."}
        </p>
      </div>
    </div>
  );
};

/* --- Module 2: Income & Expenses --- */
const Module2: React.FC<{ simStep: number; isSimplified: boolean }> = ({ simStep, isSimplified }) => {
  return (
    <div className="flex-1 grid grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-4">
        <div className="text-xs font-mono uppercase text-income tracking-widest mb-2">Income Source</div>
        <div className="glass bg-income/5 p-6 rounded-2xl border-income/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-income/10 rounded-xl flex items-center justify-center text-2xl text-income">🎁</div>
            <div>
              <div className="font-bold">Monthly Allowance</div>
              <div className="text-xs text-white/50">From Parents</div>
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-income">+₹500</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-xs font-mono uppercase text-expense tracking-widest mb-2">Daily Outflow</div>
        <div className="space-y-3">
          {[
            { icon: '🍔', label: 'Snacks', val: -50 },
            { icon: '🎮', label: 'Games', val: -120 },
            { icon: '🚌', label: 'Travel', val: -30 },
          ].map((ex, i) => (
            <div key={i} className={`glass bg-expense/5 p-4 rounded-xl border-expense/20 flex items-center justify-between transition-all duration-700 ${simStep > i * 20 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{ex.icon}</span>
                <span className="text-sm font-medium">{ex.label}</span>
              </div>
              <span className="font-mono text-expense text-sm">{ex.val}</span>
            </div>
          ))}
        </div>
      </div>
      {!isSimplified && (
        <div className="col-span-2 glass bg-white/5 p-4 rounded-2xl border-white/5 flex items-center justify-around">
          <div className="text-center">
            <div className="text-[10px] uppercase text-white/40 mb-1">Net Balance</div>
            <div className="text-2xl font-bold font-mono text-savings">₹300</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] uppercase text-white/40 mb-1">Flow Velocity</div>
            <div className="text-2xl font-bold font-mono text-white/80">0.42x</div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Module 3: Budgeting --- */
const Module3: React.FC<{ isSimplified: boolean }> = ({ isSimplified }) => {
  const [val, setVal] = React.useState(70);
  const isOver = val > 90;

  return (
    <div className="flex-1 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border transition-all ${isOver ? 'bg-expense/10 border-expense/30' : 'bg-income/10 border-income/30'}`}>
          <div className="text-xs font-mono uppercase mb-4">Allowance Allocation</div>
          <input
            type="range"
            min="0"
            max="100"
            value={val}
            onChange={(e) => setVal(parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-income"
          />
          <div className="mt-4 flex justify-between font-mono">
            <span className="text-white/40">Used</span>
            <span className={isOver ? 'text-expense font-bold' : 'text-income'}>{val}%</span>
          </div>
        </div>

        <div className="col-span-2 glass p-6 rounded-2xl border-white/10 flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center text-xl">🍕</div>
            <span className="text-[10px] uppercase text-white/40">Food</span>
            <div className="h-1 w-12 bg-income rounded-full"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center text-xl">🎨</div>
            <span className="text-[10px] uppercase text-white/40">Hobbies</span>
            <div className="h-1 w-12 bg-savings rounded-full"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center text-xl">📚</div>
            <span className="text-[10px] uppercase text-white/40">Books</span>
            <div className="h-1 w-12 bg-growth rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 glass bg-white/5 rounded-2xl p-6 border-white/5 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className={`text-5xl mb-4 transition-transform duration-500 ${isOver ? 'rotate-12' : 'rotate-0'}`}>
            {isOver ? '🚨' : '✅'}
          </div>
          <h4 className="text-xl font-bold mb-2">{isOver ? 'Budget Alert!' : 'Balanced Budget'}</h4>
          <p className="text-sm text-white/60">
            {isOver
              ? "You're spending more than you receive. Try cutting down on non-essential items."
              : "Great job! You're living within your means and have extra for savings."}
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- Module 4: Saving Money --- */
const Module4: React.FC<{ simStep: number }> = ({ simStep }) => {
  const savings = Math.min(simStep * 5, 450);
  const emergencyOccurred = simStep > 60;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <div className="text-[120px] filter drop-shadow-[0_0_20px_rgba(59,240,255,0.2)]">🐷</div>
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <div className="text-xl font-mono font-bold text-black bg-savings px-2 rounded">₹{emergencyOccurred ? Math.max(0, savings - 200) : savings}</div>
        </div>
      </div>

      {emergencyOccurred && (
        <div className="bg-expense/20 border border-expense/30 p-4 rounded-xl flex items-center gap-4 animate-bounce">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-bold text-expense">EMERGENCY EXPENSE</div>
            <div className="text-xs text-white/70">Phone screen cracked: -₹200</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-white/40">
          <span>Progress to Goal (₹1000)</span>
          <span>{Math.round(((emergencyOccurred ? savings - 200 : savings) / 1000) * 100)}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div className="h-full bg-savings rounded-full transition-all duration-300" style={{ width: `${((emergencyOccurred ? savings - 200 : savings) / 1000) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

/* --- Module 5: Banking --- */
const Module5: React.FC<{ simStep: number }> = ({ simStep }) => {
  return (
    <div className="flex-1 grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-4">
        <div className="glass p-6 rounded-2xl border-white/10 flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2 text-savings">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <span className="text-xs font-mono uppercase font-bold">Safe Storage</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="text-[10px] uppercase text-white/40">Total Secured Balance</div>
            <div className="text-4xl font-bold font-mono">₹2,400.00</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-[10px] uppercase font-bold transition-colors">Deposit</button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-[10px] uppercase font-bold transition-colors">Withdraw</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="glass p-6 rounded-2xl border-white/10 flex flex-col gap-4 h-full">
          <div className="text-xs font-mono uppercase text-white/40 mb-2">Banking Utilities</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5 hover:border-growth/40 transition-colors cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏧</div>
              <div className="text-[10px] font-bold uppercase">ATM Search</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5 hover:border-growth/40 transition-colors cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔒</div>
              <div className="text-[10px] font-bold uppercase">e-Locker</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5 hover:border-growth/40 transition-colors cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📑</div>
              <div className="text-[10px] font-bold uppercase">Statement</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center border border-white/5 hover:border-growth/40 transition-colors cursor-pointer group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📞</div>
              <div className="text-[10px] font-bold uppercase">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Module 6: Interest --- */
const Module6: React.FC<{ isSimplified: boolean }> = ({ isSimplified }) => {
  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 10; i++) {
      arr.push({
        year: i,
        simple: 1000 + (1000 * 0.1 * i),
        compound: 1000 * Math.pow(1.1, i)
      });
    }
    return arr;
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex items-center gap-8 px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-savings"></div>
          <span className="text-xs font-mono text-white/60">Simple Interest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-growth"></div>
          <span className="text-xs font-mono text-white/60">Compound Interest</span>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={10} label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} hide={isSimplified} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(7, 11, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Line type="monotone" dataKey="simple" stroke="#3BF0FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="compound" stroke="#7C6BFF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!isSimplified && (
        <div className="text-center text-[10px] font-mono text-white/30 tracking-widest bg-white/5 p-2 rounded-lg">
          SIMULATION_PARAMS: INITIAL_PRINCIPAL=₹1000 | RATE_OF_INTEREST=10%_PA
        </div>
      )}
    </div>
  );
};

/* --- Module 7: Investment Basics --- */
const Module7: React.FC<{ isSimplified: boolean }> = ({ isSimplified }) => {
  const data = [
    { name: 'Fixed Deposit', value: 30, color: '#3BF0FF', desc: 'Low risk, stable return' },
    { name: 'Mutual Fund', value: 45, color: '#7C6BFF', desc: 'Moderate risk, high growth' },
    { name: 'Gold', value: 25, color: '#00FFA3', desc: 'Inflation hedge' },
  ];

  return (
    <div className="flex-1 flex gap-8 items-center">
      <div className="w-1/2 h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={8}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(7, 11, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-4">
        {data.map((item, i) => (
          <div key={i} className="glass p-4 rounded-xl border-white/5 flex flex-col gap-1 hover:border-white/20 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold" style={{ color: item.color }}>{item.name}</span>
              <span className="text-[10px] font-mono opacity-50">{item.value}% PORTFOLIO</span>
            </div>
            <p className="text-xs text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- Module 8: Risk & Reward --- */
const Module8: React.FC<{ isSimplified: boolean }> = ({ isSimplified }) => {
  const data = useMemo(() => {
    const arr = [];
    let high = 100;
    let low = 100;
    for (let i = 0; i < 20; i++) {
      high = high * (0.9 + Math.random() * 0.3);
      low = low * (0.98 + Math.random() * 0.05);
      arr.push({ step: i, high, low });
    }
    return arr;
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-col">
          <span className="text-xs font-mono text-white/40 uppercase">Growth Volatility</span>
          <span className="text-xs text-expense font-bold">⚠️ UNSTABLE ASSETS</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-expense"></div><span className="text-[10px] text-white/60">High Risk</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-income"></div><span className="text-[10px] text-white/60">Low Risk</span></div>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="step" hide />
            <YAxis hide />
            <Tooltip />
            <Area type="monotone" dataKey="high" stroke="#FF4D4D" fillOpacity={0.1} fill="#FF4D4D" />
            <Area type="monotone" dataKey="low" stroke="#00FFA3" fillOpacity={0.1} fill="#00FFA3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="glass p-4 rounded-xl border-white/5 text-center">
        <p className="text-sm text-white/80">"Higher potential returns always come with higher uncertainty."</p>
      </div>
    </div>
  );
};

/* --- Module 9: Digital Payments --- */
const Module9: React.FC<{ simStep: number }> = ({ simStep }) => {
  const success = simStep > 60;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8">
      <div className={`relative transition-all duration-700 ${success ? 'scale-110' : 'scale-100'}`}>
        <div className="w-48 h-80 bg-[#121A2E] rounded-[40px] border-4 border-[#2A354E] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 w-full h-8 bg-black/40 flex items-center justify-center">
            <div className="w-16 h-1 rounded-full bg-white/10"></div>
          </div>
          <div className="mt-12 px-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-growth/20 rounded-full flex items-center justify-center text-xl mb-4">💳</div>
            <div className="text-xs font-mono text-white/40 mb-1">Transferring to</div>
            <div className="text-sm font-bold mb-4">Mamma's Shop</div>
            <div className="text-2xl font-bold mb-8 font-mono">₹45.00</div>

            {success ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-income rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(0,255,163,0.4)]">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="text-income font-bold text-xs">SUCCESS!</div>
              </div>
            ) : (
              <div className="w-full h-10 bg-white/5 rounded-xl flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-growth rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-growth rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-2 h-2 bg-growth rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            )}
          </div>
        </div>
        {!success && (
          <div className="absolute top-1/2 left-full ml-12 w-32 h-32 border-4 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50">
            <div className="text-2xl">🤳</div>
            <div className="text-[8px] font-mono text-center px-2 uppercase">Scan QR to continue</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Module 10: Financial Discipline --- */
const Module10: React.FC<{ isSimplified: boolean }> = ({ isSimplified }) => {
  return (
    <div className="flex-1 flex flex-col justify-center gap-8 max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-2">The Ultimate Money Secret</h3>
        <p className="text-white/60 italic">"It's not about how much you make, but how much you keep."</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border-white/10 hover:border-expense/40 transition-all group">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
          <h4 className="font-bold text-expense mb-2">Impulse Buying</h4>
          <p className="text-xs text-white/50 leading-relaxed">Buying things as soon as you want them. Often leads to empty pockets and clutter.</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/10 hover:border-income/40 transition-all group">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
          <h4 className="font-bold text-income mb-2">Planned Spending</h4>
          <p className="text-xs text-white/50 leading-relaxed">Wait 24 hours before buying. Usually, the "need" disappears, and you save money!</p>
        </div>
      </div>

      <div className="glass bg-growth/10 p-6 rounded-3xl border-growth/20 text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-growth/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-income/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="text-3xl mb-2">🎓</div>
          <div className="font-bold text-lg mb-1">Status: FINANCIALLY_AWARE</div>
          <p className="text-sm text-white/70">You have completed the Lab! Keep practicing these habits to build a bright future.</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationArea;
