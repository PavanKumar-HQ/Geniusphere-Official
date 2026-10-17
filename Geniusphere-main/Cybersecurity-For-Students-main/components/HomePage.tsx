import React from 'react';
import type { AttackModuleData } from '../types';
import { playSound } from '../utils/sounds';

interface HomePageProps {
  modules: AttackModuleData[];
  onSelectModule: (moduleId: string) => void;
  completedModules: Set<string>;
  onBack: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ modules, onSelectModule, completedModules, onBack }) => {
  const handleSelect = (moduleId: string) => {
    playSound('click');
    onSelectModule(moduleId);
  }

  const handleBack = () => {
    playSound('click');
    onBack();
  }

  return (
    <div className="text-center">
      <div className="flex justify-start mb-6">
         <button onClick={handleBack} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors">&larr; Back to Hub</button>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 mb-4">Attack Library</h2>
      <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Select a simulation below to learn how an attack works and how to defend against it.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map(module => (
          <ModuleCard 
            key={module.id} 
            module={module} 
            onSelect={() => handleSelect(module.id)}
            isCompleted={completedModules.has(module.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ModuleCardProps {
  module: AttackModuleData;
  onSelect: () => void;
  isCompleted: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onSelect, isCompleted }) => {
  return (
    <div 
      onClick={onSelect}
      className={`bg-slate-800/50 border-2 rounded-lg p-6 text-left cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:scale-105 relative ${isCompleted ? 'border-green-500/80' : 'border-slate-700'}`}
    >
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          COMPLETE
        </div>
      )}
      <h3 className="text-xl font-bold text-cyan-400 mb-2">{module.title}</h3>
      <p className="text-slate-400 text-sm">{module.simpleDefinition}</p>
    </div>
  );
};