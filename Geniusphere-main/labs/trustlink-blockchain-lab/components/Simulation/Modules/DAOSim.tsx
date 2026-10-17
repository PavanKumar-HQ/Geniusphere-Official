import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, XCircle, Vote } from 'lucide-react';

export const DAOSim: React.FC<{ step: number }> = ({ step }) => {
  const isProposal = step >= 1;
  const isVoting = step >= 2;
  const isFinal = step >= 4;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 items-center justify-center">
      <div className="w-full max-w-2xl bg-lab-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gray-800/50 p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-lab-purple" />
            <span className="font-bold text-sm">DAO_GOVERNANCE_PORTAL</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-lab-green" />
            <div className="w-2 h-2 rounded-full bg-lab-blue" />
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className={`transition-all ${isProposal ? 'opacity-100' : 'opacity-20'}`}>
            <h3 className="text-xl font-bold mb-2 text-white">#042: Upgrade Smart Contract?</h3>
            <p className="text-gray-400 text-sm">Change base fee distribution from 2% to 1.5% to increase staking yields.</p>
          </div>

          {isVoting && (
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
                <span className="text-lab-green">Approve (72%)</span>
                <span className="text-lab-red">Reject (28%)</span>
              </div>
              <div className="h-4 w-full bg-gray-800 rounded-full flex overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} className="h-full bg-lab-green" />
                <motion.div initial={{ width: 0 }} animate={{ width: '28%' }} className="h-full bg-lab-red" />
              </div>
              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                   <Vote size={12} /> Quorum: 40% (Met)
                </div>
              </div>
            </div>
          )}

          {isFinal && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-lab-green/10 border border-lab-green p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-lab-green" />
                <span className="font-bold text-lab-green">PROPOSAL PASSED</span>
              </div>
              <button className="text-[10px] bg-lab-green text-black px-3 py-1 rounded font-bold uppercase">Execute on Chain</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
