import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Box, Fingerprint, Award } from 'lucide-react';

export const NFTSim: React.FC<{ step: number }> = ({ step }) => {
  const isMetadata = step >= 2;
  const isMinting = step === 3;
  const isMinted = step >= 4;

  return (
    <div className="w-full h-full flex items-center justify-center p-12 gap-12">
      <div className="relative group">
        <motion.div 
          animate={isMinted ? { y: -10, rotate: [0, 2, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 4 }}
          className={`w-64 h-80 rounded-2xl border-2 ${isMinted ? 'border-lab-blue shadow-[0_0_30px_rgba(59,240,255,0.4)]' : 'border-gray-800 bg-gray-900/50'} relative overflow-hidden flex flex-col p-4 backdrop-blur-sm`}
        >
          <div className="h-48 bg-lab-bg rounded-lg border border-gray-800 flex items-center justify-center relative overflow-hidden">
            {isMinted ? (
              <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=blockchain" className="w-full h-full object-cover" alt="NFT" />
            ) : (
              <ImageIcon size={48} className="text-gray-700" />
            )}
            {isMinting && <div className="absolute inset-0 bg-lab-blue/20 animate-pulse" />}
          </div>
          <div className="mt-4 space-y-2">
            <div className={`h-4 ${isMinted ? 'bg-lab-blue/20' : 'bg-gray-800'} rounded w-3/4`} />
            <div className={`h-3 ${isMinted ? 'bg-lab-blue/10' : 'bg-gray-800'} rounded w-1/2`} />
          </div>
          {isMinted && (
             <div className="absolute top-2 right-2 bg-lab-blue text-black p-1 rounded">
               <Fingerprint size={16} />
             </div>
          )}
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 w-72">
        <ConceptBox active={step >= 1} label="DIGITAL ASSET" value="CyberArt_#402.png" />
        <ConceptBox active={isMetadata} label="METADATA (IPFS)" value="ipfs://QmXoyp...3n8" />
        <ConceptBox active={isMinted} label="TOKEN_ID" value="0x77c2...e81a" />
        {isMinted && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="bg-lab-green/10 border border-lab-green p-4 rounded-xl flex items-center gap-3"
          >
            <Award className="text-lab-green" size={24} />
            <div className="text-xs text-lab-green font-bold uppercase tracking-wider">Provenance Verified</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ConceptBox = ({ active, label, value }: any) => (
  <div className={`p-3 rounded-xl border transition-all ${active ? 'border-lab-blue bg-lab-blue/5' : 'border-gray-800 opacity-30'}`}>
    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">{label}</div>
    <div className="font-mono text-xs text-white truncate">{value}</div>
  </div>
);
