import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleType } from '../types';
import { BasicsSim } from './Simulation/Modules/BasicsSim';
import { AttackSim } from './Simulation/Modules/AttackSim';
import { SmartContractSim } from './Simulation/Modules/SmartContractSim';
import { DbComparisonSim } from './Simulation/Modules/DbComparisonSim';
import { MiningSim } from './Simulation/Modules/MiningSim';
import { WalletSim } from './Simulation/Modules/WalletSim';
import { NFTSim } from './Simulation/Modules/NFTSim';
import { DAOSim } from './Simulation/Modules/DAOSim';
import { DeFiSim } from './Simulation/Modules/DeFiSim';
import { StakingSim } from './Simulation/Modules/StakingSim';
import { Layer2Sim } from './Simulation/Modules/Layer2Sim';
import { OracleSim } from './Simulation/Modules/OracleSim';
import { BridgeSim } from './Simulation/Modules/BridgeSim';
import { ZKPSim } from './Simulation/Modules/ZKPSim';
import { GasSim } from './Simulation/Modules/GasSim';
import { InteropSim } from './Simulation/Modules/InteropSim';
import { CBDCSim } from './Simulation/Modules/CBDCSim';
import { TokenomicsSim } from './Simulation/Modules/TokenomicsSim';
import { HistorySim } from './Simulation/Modules/HistorySim';

interface SimulationStageProps {
  activeModule: ModuleType;
  step: number;
  simplified: boolean;
}

export const SimulationStage: React.FC<SimulationStageProps> = ({ activeModule, step, simplified }) => {
  return (
    <div className="relative w-full min-h-[350px] lg:h-[500px] bg-[#070B1A] rounded-2xl border border-[#1E293B] overflow-hidden shadow-2xl shadow-black/50">

      {/* Grid Overlay for Aesthetic */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-10 w-full h-full overflow-x-auto lg:overflow-visible scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="w-full h-full lg:min-w-0 flex flex-col items-center justify-center p-2"
          >
            {/* Scale container for mobile to ensure content fits */}
            <div className="w-full max-w-[600px] lg:max-w-none origin-top-left lg:origin-center transform sm:scale-100 scale-[0.85] xs:scale-100">
              {activeModule === ModuleType.BASICS && <BasicsSim step={step} simplified={simplified} />}
              {activeModule === ModuleType.ATTACK && <AttackSim />}
              {activeModule === ModuleType.SMART_CONTRACTS && <SmartContractSim step={step} />}
              {activeModule === ModuleType.DB_COMPARISON && <DbComparisonSim step={step} />}
              {activeModule === ModuleType.MINING && <MiningSim step={step} />}
              {activeModule === ModuleType.WALLET && <WalletSim step={step} />}
              {activeModule === ModuleType.NFT && <NFTSim step={step} />}
              {activeModule === ModuleType.DAO && <DAOSim step={step} />}
              {activeModule === ModuleType.DEFI && <DeFiSim step={step} />}
              {activeModule === ModuleType.STAKING && <StakingSim step={step} />}
              {activeModule === ModuleType.LAYER2 && <Layer2Sim step={step} />}
              {activeModule === ModuleType.ORACLES && <OracleSim step={step} />}
              {activeModule === ModuleType.BRIDGES && <BridgeSim step={step} />}
              {activeModule === ModuleType.ZKP && <ZKPSim step={step} />}
              {activeModule === ModuleType.GAS && <GasSim step={step} />}
              {activeModule === ModuleType.INTEROP && <InteropSim step={step} />}
              {activeModule === ModuleType.CBDC && <CBDCSim step={step} />}
              {activeModule === ModuleType.TOKENOMICS && <TokenomicsSim step={step} />}
              {activeModule === ModuleType.HISTORY && <HistorySim step={step} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};