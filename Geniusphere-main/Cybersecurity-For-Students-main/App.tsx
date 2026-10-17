import React, { useState, useMemo } from 'react';
import { HomePage } from './components/HomePage';
import { AttackModule } from './components/AttackModule';
import { CyberGuideChat } from './components/CyberGuideChat';
import { ATTACK_MODULES } from './constants';
import { IntroWorld } from './components/IntroWorld';
import { SimulatePage } from './components/SimulatePage';
import { DefendPage } from './components/DefendPage';
import { GamesPage } from './components/GamesPage';

export type View = 'home' | 'learn' | 'simulate' | 'defend' | 'games' | 'module';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setView('module');
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => new Set(prev).add(moduleId));
    setSelectedModuleId(null);
    setView('learn');
  };
  
  const handleNavigate = (newView: View) => {
    setSelectedModuleId(null);
    setView(newView);
  }

  const selectedModule = useMemo(() => {
    return ATTACK_MODULES.find(m => m.id === selectedModuleId) || null;
  }, [selectedModuleId]);

  const renderContent = () => {
    switch(view) {
      case 'home':
        return <IntroWorld onNavigate={handleNavigate} />;
      case 'learn':
        return <HomePage 
            modules={ATTACK_MODULES} 
            onSelectModule={handleSelectModule} 
            completedModules={completedModules}
            onBack={() => handleNavigate('home')}
          />;
      case 'simulate':
        return <SimulatePage onBack={() => handleNavigate('home')} />;
      case 'defend':
        return <DefendPage onBack={() => handleNavigate('home')} />;
      case 'games':
        return <GamesPage onBack={() => handleNavigate('home')} />;
      case 'module':
        if (selectedModule) {
          return <AttackModule 
            module={selectedModule} 
            onComplete={handleModuleComplete}
            onBack={() => handleNavigate('learn')}
          />
        }
        return null; // Should not happen
      default:
        return <IntroWorld onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className="bg-[#0B0C10] min-h-screen font-sans text-slate-200">
       <header className="p-4 border-b border-cyan-500/20 flex justify-between items-center">
        <h1 
          className="text-xl md:text-2xl font-bold text-cyan-400 cursor-pointer"
          onClick={() => handleNavigate('home')}
        >
          CyberSphere Junior Lab
        </h1>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4 text-sm">
            <button onClick={() => handleNavigate('learn')} className="hover:text-cyan-400 transition-colors">Learn</button>
            <button onClick={() => handleNavigate('simulate')} className="hover:text-cyan-400 transition-colors">Simulate</button>
            <button onClick={() => handleNavigate('defend')} className="hover:text-cyan-400 transition-colors">Defend</button>
            <button onClick={() => handleNavigate('games')} className="hover:text-cyan-400 transition-colors">Play</button>
          </nav>
          <div className="text-sm bg-slate-800 px-3 py-1 rounded-full">
            Progress: {completedModules.size} / {ATTACK_MODULES.length} Badges
          </div>
        </div>
      </header>
      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
      <CyberGuideChat />
    </div>
  );
};

export default App;