import React from 'react';
// Import AnimatePresence from framer-motion to enable conditional mounting/unmounting animations
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, Mail, Signature, ShieldCheck } from 'lucide-react';

export const WalletSim: React.FC<{ step: number }> = ({ step }) => {
  const showPriv = step >= 1;
  const showPub = step >= 2;
  const showAddress = step >= 3;
  const showSign = step >= 4;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 overflow-hidden">
      <div className="grid grid-cols-2 gap-12 max-w-4xl w-full">
        <div className="space-y-4">
          <h3 className="text-lab-purple font-mono text-sm uppercase flex items-center gap-2">
            <Key size={14} /> Identity Generation
          </h3>
          <div className="space-y-4">
            <Element visible={showPriv} label="Private Key" color="text-lab-red" value="4f3a...b7d2" icon={<Lock size={12} />} />
            <Element visible={showPub} label="Public Key" color="text-lab-blue" value="0x8e1f...2c90" icon={<ShieldCheck size={12} />} />
            <Element visible={showAddress} label="Wallet Address" color="text-lab-green" value="0x123...abcD" icon={<Mail size={12} />} />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {showSign && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-lab-card/80 border border-lab-purple p-6 rounded-2xl shadow-2xl backdrop-blur-xl h-full flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="p-4 bg-lab-purple/10 rounded-full">
                  <Signature size={48} className="text-lab-purple" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">DIGITAL SIGNATURE</h4>
                  <p className="text-xs text-gray-500">Authorized by Private Key</p>
                </div>
                <div className="font-mono text-[10px] text-lab-purple bg-black/40 p-2 rounded border border-lab-purple/20 w-full overflow-hidden truncate">
                  30450221008f...c92a
                </div>
                <Badge variant="green">VALID_SIGNATURE</Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Element = ({ visible, label, value, color, icon }: any) => (
  <motion.div 
    initial={{ x: -20, opacity: 0 }} animate={visible ? { x: 0, opacity: 1 } : {}}
    className={`bg-lab-card border border-gray-800 p-4 rounded-xl flex items-center gap-4 ${!visible && 'opacity-20'}`}
  >
    <div className={`p-2 rounded-lg bg-gray-800 ${color}`}>{icon}</div>
    <div className="flex-1">
      <div className="text-[10px] uppercase text-gray-500 font-bold">{label}</div>
      <div className={`font-mono text-sm ${color} truncate`}>{value}</div>
    </div>
  </motion.div>
);

const Badge = ({ children, variant }: any) => {
  const colors: any = { green: 'bg-lab-green/10 text-lab-green border-lab-green/30' };
  return <span className={`px-2 py-1 rounded text-[10px] font-bold border ${colors[variant]}`}>{children}</span>;
}