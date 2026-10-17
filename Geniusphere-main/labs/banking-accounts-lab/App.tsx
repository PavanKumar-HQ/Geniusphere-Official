
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { AccountType, SimState } from './types';
import { ACCOUNT_MODULES, BANKING_SMART_TIPS } from './constants';
import { IconMap, Play, Pause, RotateCcw, Info, ArrowRight, CheckCircle, XCircle, Trophy } from './components/Icons';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

const motion = motionBase as any;

export default function App({ onClose }: { onClose?: () => void }) {
  const [activeAccount, setActiveAccount] = useState<AccountType>(AccountType.SAVINGS);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [simState, setSimState] = useState<SimState>({
    isPlaying: true,
    progress: 0,
    balance: 500,
    transactions: [],
    timer: 0
  });
  const [comparisonResult, setComparisonResult] = useState<{ correct: boolean | null, message: string }>({ correct: null, message: '' });

  const currentModule = useMemo(() =>
    ACCOUNT_MODULES.find(m => m.id === activeAccount) || ACCOUNT_MODULES[0]
    , [activeAccount]);

  const visibleModules = useMemo(() =>
    simplifiedMode ? ACCOUNT_MODULES.filter(m => m.simplified) : ACCOUNT_MODULES
    , [simplifiedMode]);

  useEffect(() => {
    const initialBalance = activeAccount === AccountType.FIXED_DEPOSIT ? 1000 :
      activeAccount === AccountType.CURRENT ? 5000 :
        activeAccount === AccountType.SALARY ? 0 : 500;
    setSimState({
      isPlaying: true,
      progress: 0,
      balance: initialBalance,
      transactions: [],
      timer: 0
    });
    setComparisonResult({ correct: null, message: '' });
  }, [activeAccount]);

  useEffect(() => {
    if (!simState.isPlaying || activeAccount === AccountType.COMPARISON) return;

    const interval = setInterval(() => {
      setSimState(prev => {
        let newBalance = prev.balance;
        let newProgress = prev.progress + 1;
        const newTransactions = [...prev.transactions].slice(-5);

        switch (activeAccount) {
          case AccountType.SAVINGS:
            if (newProgress % 20 === 0) {
              const interest = Math.floor(prev.balance * 0.001 * 100) / 100;
              newBalance += interest;
              newTransactions.push({
                id: Math.random().toString(),
                amount: interest,
                type: 'IN',
                label: 'Interest Added',
                timestamp: Date.now()
              });
            }
            break;

          case AccountType.CURRENT:
            if (newProgress % 10 === 0) {
              const isGain = Math.random() > 0.4;
              const amount = Math.floor(Math.random() * 500) + 100;
              newBalance = isGain ? newBalance + amount : Math.max(0, newBalance - amount);
              newTransactions.push({
                id: Math.random().toString(),
                amount,
                type: isGain ? 'IN' : 'OUT',
                label: isGain ? 'Client Payment' : 'Vendor Bill',
                timestamp: Date.now()
              });
            }
            break;

          case AccountType.FIXED_DEPOSIT:
            if (newProgress >= 100) {
              const interest = 120;
              newBalance += interest;
              newTransactions.push({
                id: 'fd-end',
                amount: interest,
                type: 'IN',
                label: 'Maturity Interest',
                timestamp: Date.now()
              });
              return { ...prev, isPlaying: false, progress: 100, balance: newBalance, transactions: newTransactions };
            }
            break;

          case AccountType.RECURRING_DEPOSIT:
            if (newProgress % 20 === 0 && newProgress < 100) {
              const deposit = 100;
              newBalance += deposit;
              newTransactions.push({
                id: Math.random().toString(),
                amount: deposit,
                type: 'IN',
                label: 'Monthly Installment',
                timestamp: Date.now()
              });
            }
            if (newProgress >= 100) {
              const interest = 45;
              newBalance += interest;
              newTransactions.push({ id: 'rd-end', amount: interest, type: 'IN', label: 'Bonus Interest', timestamp: Date.now() });
              return { ...prev, isPlaying: false, progress: 100, balance: newBalance, transactions: newTransactions };
            }
            break;

          case AccountType.SALARY:
            if (newProgress === 10) {
              const salary = 2500;
              newBalance += salary;
              newTransactions.push({
                id: 'sal-1',
                amount: salary,
                type: 'IN',
                label: 'Salary Credited',
                timestamp: Date.now()
              });
            }
            if (newProgress > 10 && newProgress % 15 === 0) {
              const expense = Math.floor(Math.random() * 200) + 50;
              newBalance = Math.max(0, newBalance - expense);
              newTransactions.push({ id: Math.random().toString(), amount: expense, type: 'OUT', label: 'Grocery/Rent', timestamp: Date.now() });
            }
            break;

          case AccountType.STUDENT:
            if (newProgress % 15 === 0) {
              const allowance = 50;
              newBalance += allowance;
              newTransactions.push({ id: Math.random().toString(), amount: allowance, type: 'IN', label: 'Guardian Transfer', timestamp: Date.now() });
            }
            break;

          case AccountType.JOINT:
            if (newProgress % 12 === 0) {
              const isUser1 = Math.random() > 0.5;
              const expense = 60;
              newBalance = Math.max(0, newBalance - expense);
              newTransactions.push({
                id: Math.random().toString(),
                amount: expense,
                type: 'OUT',
                label: `${isUser1 ? 'User A' : 'User B'} Expense`,
                timestamp: Date.now()
              });
            }
            break;
        }

        if (newProgress > 100 && activeAccount !== AccountType.SAVINGS && activeAccount !== AccountType.CURRENT) {
          newProgress = 100;
        } else if (newProgress > 100) {
          newProgress = 0;
        }

        return {
          ...prev,
          balance: Math.max(0, newBalance),
          progress: newProgress,
          transactions: newTransactions
        };
      });
    }, 150);

    return () => clearInterval(interval);
  }, [simState.isPlaying, activeAccount]);

  const handleComparison = (choice: string) => {
    if (choice === 'savings_for_biz') {
      setComparisonResult({ correct: false, message: '❌ Oops! Using a Savings Account for thousands of business transactions can lead to bank limits and legal issues. Use a Current Account instead.' });
    } else if (choice === 'current_for_savings') {
      setComparisonResult({ correct: false, message: '❌ Bad idea! You are losing out on interest. Money just sits there without growing.' });
    } else {
      setComparisonResult({ correct: true, message: '✅ Correct! Matching the account to your goal is the first step to financial freedom.' });
    }
  };

  const renderVisuals = () => {
    const Icon = IconMap[currentModule.icon];
    const color = currentModule.color;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        <div
          className="absolute inset-0 rounded-full blur-[120px] opacity-10 animate-pulse-slow"
          style={{ backgroundColor: color }}
        />

        <div className="z-10 flex flex-col items-center gap-6">
          <div className="p-8 glass rounded-full border-2" style={{ borderColor: `${color}44` }}>
            <Icon size={80} color={color} />
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-2" style={{ color }}>{currentModule.title}</h2>
            <p className="text-blue-200/40 mono text-sm uppercase tracking-[0.2em]">{currentModule.status || 'ACTIVE_SIMULATION'}</p>
          </div>

          <div className="glass px-10 py-6 rounded-2xl min-w-[320px] text-center">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">Estimated Balance</p>
            <div className="text-5xl font-bold mono tracking-tighter">
              ${simState.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full mt-8 overflow-y-auto md:overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${simState.progress}%`, backgroundColor: color }}
              />
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 bottom-4 w-64 flex flex-col gap-2 overflow-y-auto md:overflow-hidden py-4">
          <p className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-widest px-2">Live Ledger</p>
          {simState.transactions.slice().reverse().map(tx => (
            <div key={tx.id} className="glass p-3 rounded-lg border-l-2 text-[11px] animate-in slide-in-from-right duration-300" style={{ borderLeftColor: tx.type === 'IN' ? '#00FFA344' : '#FF4D4D44' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold opacity-70">{tx.label}</span>
                <span className={tx.type === 'IN' ? 'text-[#00FFA3]' : 'text-[#FF4D4D]'}>
                  {tx.type === 'IN' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
              </div>
              <div className="text-[9px] opacity-30 mono uppercase">SYS_LOG_{tx.id.slice(0, 6)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparison = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 max-w-2xl mx-auto">
        <Trophy size={64} color="#FF4D4D" className="mb-8 opacity-80" />
        <h2 className="text-3xl font-bold mb-6 text-center">Banking Challenge: Scenario Test</h2>
        <p className="text-gray-400 text-center mb-10 leading-relaxed text-sm">
          The ultimate rule of banking: <span className="text-white italic">"There is an account for every dream, but using the wrong one costs you money."</span>
          Test your knowledge below.
        </p>

        <div className="grid gap-4 w-full">
          <button
            onClick={() => handleComparison('savings_for_biz')}
            className="glass hover:bg-white/5 p-5 rounded-xl border border-white/5 transition-all text-left flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-lg mb-1">Scenario A</p>
              <p className="text-xs text-gray-400 italic">"I have a fast-growing tech shop. I'll use a Savings Account for my 1,000 monthly sales."</p>
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleComparison('current_for_savings')}
            className="glass hover:bg-white/5 p-5 rounded-xl border border-white/5 transition-all text-left flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-lg mb-1">Scenario B</p>
              <p className="text-xs text-gray-400 italic">"I want to save my pocket money for 5 years. I'll keep it in a Current Account."</p>
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleComparison('correct')}
            className="glass hover:bg-white/5 p-5 rounded-xl border border-white/5 transition-all text-left flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-lg mb-1">Scenario C</p>
              <p className="text-xs text-gray-400 italic">"I have $10,000 I don't need for 2 years. I'll put it in a Fixed Deposit to earn max interest."</p>
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {comparisonResult.message && (
          <div className={`mt-8 p-6 rounded-2xl glass border w-full animate-in zoom-in-95 duration-300 ${comparisonResult.correct ? 'border-[#00FFA3]/30 bg-[#00FFA3]/5' : 'border-[#FF4D4D]/30 bg-[#FF4D4D]/5'}`}>
            <div className="flex items-start gap-4">
              {comparisonResult.correct ? <CheckCircle color="#00FFA3" size={24} /> : <XCircle color="#FF4D4D" size={24} />}
              <p className="text-xs leading-relaxed">{comparisonResult.message}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title={currentModule.title}
          description={
            <>
              <p>{currentModule.description}</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono text-cyan-400">
                {activeAccount} // {simplifiedMode ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          badges={[
            <MobileBadge variant="cyan" key="b1">VAULT_LAB_V2.5</MobileBadge>,
            simState.isPlaying ? <MobileBadge variant="yellow" key="b2">ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-4">
              {activeAccount === AccountType.COMPARISON ? renderComparison() : renderVisuals()}
            </div>
          }
          controls={
            <MobileControlGroup
              onPlay={() => setSimState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
              onReset={() => {
                setSimState({
                  isPlaying: true,
                  progress: 0,
                  balance: activeAccount === AccountType.FIXED_DEPOSIT ? 1000 : activeAccount === AccountType.CURRENT ? 5000 : activeAccount === AccountType.SALARY ? 0 : 500,
                  transactions: [],
                  timer: 0
                });
                setComparisonResult({ correct: null, message: '' });
              }}
              onNext={() => {
                const currentIndex = visibleModules.findIndex(m => m.id === activeAccount);
                if (currentIndex < visibleModules.length - 1) {
                  setActiveAccount(visibleModules[currentIndex + 1].id);
                }
              }}
              onPrev={() => {
                const currentIndex = visibleModules.findIndex(m => m.id === activeAccount);
                if (currentIndex > 0) {
                  setActiveAccount(visibleModules[currentIndex - 1].id);
                }
              }}
              isPlaying={simState.isPlaying}
            />
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-cyan-400">Account Info</h4>
              <p className="text-sm">{currentModule.description}</p>
              {currentModule.smartTip && (
                <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <p className="text-xs text-blue-300">{currentModule.smartTip}</p>
                </div>
              )}
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={onClose || (() => {
            const referrer = document.referrer;
            const currentOrigin = window.location.origin;
            if (referrer && referrer.startsWith(currentOrigin) && window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/';
            }
          })}
        />

        {/* Sidebar Portal for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 z-[90] shadow-2xl bg-[#070B1A] border-r border-white/10 flex flex-col p-6"
              >
                <div className="mb-10">
                  <h1 className="text-xl font-bold tracking-tighter uppercase mb-1">Vault_Lab v2.5</h1>
                  <p className="text-[10px] text-blue-400 font-bold mono">MOD_BANKING_TYPES</p>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
                  {visibleModules.map((module) => {
                    const Icon = IconMap[module.icon];
                    const isActive = activeAccount === module.id;
                    return (
                      <button
                        key={module.id}
                        onClick={() => {
                          setActiveAccount(module.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${isActive
                          ? 'glass border-white/10 bg-white/5 scale-[1.01]'
                          : 'border-transparent hover:bg-white/5 opacity-40 hover:opacity-100'
                          }`}
                      >
                        <div className="p-2 rounded-lg" style={{ color: module.color }}>
                          <Icon size={18} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold">{module.title}</p>
                          <p className="text-[9px] opacity-40 mono uppercase">{module.id}</p>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setSimplifiedMode(!simplifiedMode)}
                    className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {simplifiedMode ? 'Full Mode' : 'Simplified Mode'}
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex flex-col md:flex-row min-h-screen md:h-screen w-full bg-[#070B1A] grid-bg overflow-y-auto md:overflow-hidden text-[#E6E9F0]">
        <aside className="w-full md:w-80 border-r border-white/10 flex flex-col p-6 glass">
          <div className="mb-10">
            <h1 className="text-xl font-bold tracking-tighter uppercase mb-1">Vault_Lab v2.5</h1>
            <p className="text-[10px] text-blue-400 font-bold mono">MOD_BANKING_TYPES</p>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
            {visibleModules.map((module) => {
              const Icon = IconMap[module.icon];
              const isActive = activeAccount === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveAccount(module.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${isActive
                    ? 'glass border-white/10 bg-white/5 scale-[1.01]'
                    : 'border-transparent hover:bg-white/5 opacity-40 hover:opacity-100'
                    }`}
                >
                  <div className="p-2 rounded-lg" style={{ color: module.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">{module.title}</p>
                    <p className="text-[9px] opacity-40 mono uppercase">{module.id}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Simplified Mode</span>
              <button
                onClick={() => setSimplifiedMode(!simplifiedMode)}
                className={`w-8 h-4 rounded-full relative transition-all ${simplifiedMode ? 'bg-[#3BF0FF]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${simplifiedMode ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative flex flex-col">
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-8 glass">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] opacity-50" />
              <span className="text-[10px] font-bold mono uppercase opacity-30">Simulation Feed_01</span>
            </div>
            <div className="px-3 py-1 glass rounded text-[9px] mono border border-white/10 opacity-40">
              LOC: SECURE_CORE_0xAF
            </div>
          </header>

          <div className="flex-1 relative">
            {activeAccount === AccountType.COMPARISON ? renderComparison() : renderVisuals()}
          </div>

          <footer className="h-20 border-t border-white/10 flex items-center justify-between px-8 glass">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSimState(s => ({ ...s, isPlaying: !s.isPlaying }))}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                {simState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => setSimState(s => ({ ...s, balance: 500, progress: 0, transactions: [], isPlaying: true }))}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <RotateCcw size={20} />
              </button>
              <div className="h-8 w-px bg-white/10 mx-2" />
              <div className="hidden lg:block">
                <p className="text-[9px] text-gray-600 uppercase font-bold mb-1">Module Sequence</p>
                <div className="flex gap-1">
                  {ACCOUNT_MODULES.map(m => (
                    <div
                      key={m.id}
                      className={`h-1 w-5 rounded-full transition-all duration-500 ${activeAccount === m.id ? 'bg-[#3BF0FF]' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Step {ACCOUNT_MODULES.findIndex(m => m.id === activeAccount) + 1} / {ACCOUNT_MODULES.length}</span>
              <button
                onClick={() => {
                  const idx = ACCOUNT_MODULES.findIndex(m => m.id === activeAccount);
                  if (idx < ACCOUNT_MODULES.length - 1) setActiveAccount(ACCOUNT_MODULES[idx + 1].id);
                }}
                className="px-6 py-2 rounded-xl bg-[#3BF0FF]/80 text-[#070B1A] font-bold text-xs hover:bg-[#3BF0FF] active:scale-95 transition-all"
              >
                Next Module
              </button>
            </div>
          </footer>
        </main>

        <aside className="w-full md:w-96 border-l border-white/10 flex flex-col p-8 glass overflow-y-auto">
          <div className="mb-10">
            <h3 className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={12} /> Account Overview
            </h3>
            <p className="text-lg font-medium leading-relaxed mb-6">{currentModule.description}</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Ideal Usage</p>
                <p className="text-sm font-bold text-white/90">{currentModule.bestUse}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#00FFA3]/5 border border-[#00FFA3]/10">
                <p className="text-[10px] font-bold text-[#00FFA3]/60 uppercase mb-2 flex items-center gap-2">
                  <ArrowRight size={10} className="-rotate-45" /> How Money Grows
                </p>
                <p className="text-xs leading-relaxed text-[#00FFA3]/90 italic">{currentModule.growthMethod}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Professional Insights</h3>
              <ul className="space-y-4">
                {BANKING_SMART_TIPS.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-gray-400">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentModule.didYouKnow && (
              <div className="p-5 rounded-2xl glass border border-white/5 relative bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-[10px] font-bold text-[#3BF0FF]/70 uppercase mb-2">The Extra Mile</h3>
                <p className="text-[11px] leading-relaxed text-blue-100/50">{currentModule.didYouKnow}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
