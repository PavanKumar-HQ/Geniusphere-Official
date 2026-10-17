import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, ShieldCheck, Edit3, XCircle, CheckCircle } from 'lucide-react';

interface DbComparisonSimProps {
    step?: number;
}

export const DbComparisonSim: React.FC<DbComparisonSimProps> = ({ step = 0 }) => {
  // Step 0: Data Entry (Admin vs Network)
  // Step 1: Modification (Silent Edit vs Alert)
  // Step 2: Comparison Table Highlight

  const isModified = step >= 1;
  const showTable = step >= 2;

  return (
    <div className="w-full h-full flex flex-col p-4 relative">
        
        {/* Split Screen View */}
        <div className={`grid grid-cols-2 gap-8 flex-1 transition-all duration-500 ${showTable ? 'h-1/2' : 'h-full'}`}>
            
            {/* Left: Database */}
            <div className="bg-lab-card/30 rounded-xl border border-gray-800 p-6 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-700" />
                <h3 className="text-xl font-bold mb-4 text-gray-400 flex items-center gap-2">
                    <Database className="text-gray-500" /> TRADITIONAL DB
                </h3>

                <div className="flex flex-col items-center justify-center flex-1 gap-4 w-full">
                    {/* Admin Icon */}
                    <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center border border-gray-500">
                            <span className="text-xs font-bold text-gray-300">ADMIN</span>
                        </div>
                        <div className="h-8 w-0.5 bg-gray-600 my-1" />
                    </motion.div>

                    {/* Server */}
                    <div className="relative">
                         <Server size={64} className="text-gray-600" />
                         {isModified && (
                             <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -right-2 -top-2 bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg"
                             >
                                SILENT EDIT
                             </motion.div>
                         )}
                    </div>

                    {/* Data Record */}
                    <div className="bg-gray-800 p-3 rounded w-full max-w-[200px] border border-gray-700 mt-2">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>ID: 101</span>
                            <span>v2.0</span>
                        </div>
                        <p className={`font-mono text-center transition-colors duration-300 ${isModified ? 'text-yellow-400' : 'text-lab-blue'}`}>
                            {isModified ? "BAL: ₹99,999" : "BAL: ₹500"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Blockchain */}
            <div className="bg-lab-card/30 rounded-xl border border-lab-blue/20 p-6 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lab-blue to-lab-purple" />
                <h3 className="text-xl font-bold mb-4 text-lab-blue flex items-center gap-2">
                    <ShieldCheck /> BLOCKCHAIN
                </h3>

                <div className="flex flex-col items-center justify-center flex-1 gap-4 w-full">
                    {/* Network Icons */}
                    <div className="flex gap-4 mb-2">
                         {[1,2,3].map(i => (
                             <motion.div 
                                key={i}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center ${isModified ? 'border-lab-red bg-lab-red/10' : 'border-lab-blue bg-lab-blue/10'}`}
                             >
                                 <div className={`w-2 h-2 rounded-full ${isModified ? 'bg-lab-red' : 'bg-lab-blue'}`} />
                             </motion.div>
                         ))}
                    </div>

                    {/* Block Chain Visual */}
                    <div className="flex items-center gap-1">
                        <div className={`w-12 h-12 border rounded flex items-center justify-center ${isModified ? 'border-lab-red shadow-lab-red/20' : 'border-lab-green shadow-lab-green/20'}`}>
                            <span className="text-[10px] font-mono">HASH</span>
                        </div>
                        <div className="w-4 h-0.5 bg-gray-600" />
                        <div className={`w-12 h-12 border rounded flex items-center justify-center ${isModified ? 'border-lab-red shadow-lab-red/20' : 'border-lab-green shadow-lab-green/20'}`}>
                            <span className="text-[10px] font-mono">HASH</span>
                        </div>
                    </div>

                    {/* Data Record */}
                    <div className={`bg-lab-card p-3 rounded w-full max-w-[200px] border mt-2 transition-colors duration-300 ${isModified ? 'border-lab-red bg-lab-red/5' : 'border-lab-blue/30'}`}>
                         <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>BLOCK #42</span>
                            {isModified && <span className="text-lab-red font-bold">REJECTED</span>}
                        </div>
                        <p className={`font-mono text-center transition-colors duration-300 ${isModified ? 'text-lab-red' : 'text-lab-blue'}`}>
                            {isModified ? "TAMPER DETECTED" : "BAL: ₹500"}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Comparison Table - The Big Visual Moment */}
        <AnimatePresence>
            {showTable && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-0 left-0 w-full h-1/2 bg-[#070B1A]/95 backdrop-blur-xl border-t border-lab-purple/30 p-6 flex flex-col"
                >
                    <h4 className="text-center text-lab-purple font-bold tracking-widest mb-4 uppercase">Trust Architecture Comparison</h4>
                    
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="grid grid-cols-3 text-sm font-bold text-gray-500 border-b border-gray-800 pb-2 mb-2">
                            <span>FEATURE</span>
                            <span className="text-center">DATABASE</span>
                            <span className="text-right">BLOCKCHAIN</span>
                        </div>

                        <div className="space-y-3">
                            {[
                                { feat: "Control", db: "Single Admin", bc: "Distributed Network", highlight: true },
                                { feat: "Editing", db: "Easy & Silent", bc: "Impossible (Immutable)", highlight: true },
                                { feat: "Transparency", db: "Low (Hidden logs)", bc: "High (Public Ledger)", highlight: false },
                                { feat: "Trust", db: "Required in Admin", bc: "Built into Code", highlight: true }
                            ].map((row, idx) => (
                                <motion.div 
                                    key={row.feat}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.3 }}
                                    className="grid grid-cols-3 text-sm items-center p-2 rounded hover:bg-white/5"
                                >
                                    <span className="text-gray-300 font-mono">{row.feat}</span>
                                    <span className="text-center text-gray-400">{row.db}</span>
                                    <span className={`text-right font-bold ${row.highlight ? 'text-lab-green' : 'text-lab-blue'}`}>{row.bc}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
