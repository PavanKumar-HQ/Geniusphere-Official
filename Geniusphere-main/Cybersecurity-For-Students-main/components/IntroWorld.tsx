import React from 'react';
import type { View } from '../App';
import { playSound } from '../utils/sounds';

interface IntroWorldProps {
  onNavigate: (view: View) => void;
}

export const IntroWorld: React.FC<IntroWorldProps> = ({ onNavigate }) => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="w-full max-w-md h-64 relative mb-6">
        <CyberWorldAnimation />
      </div>
      
      <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 mb-4">Step into the Cyber World</h2>
      <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
        “Welcome to CyberSphere Junior! Let’s explore how hackers work — and how you can stop them!”
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <NavCard 
          title="Learn" 
          description="Explore a library of animated cyber attacks." 
          onClick={() => onNavigate('learn')} 
        />
        <NavCard 
          title="Simulate" 
          description="Trigger attacks in a safe cyber lab." 
          onClick={() => onNavigate('simulate')} 
        />
        <NavCard 
          title="Defend" 
          description="Use protection tools to stop threats." 
          onClick={() => onNavigate('defend')} 
        />
        <NavCard 
          title="Play" 
          description="Test your skills with cyber games and quizzes." 
          onClick={() => onNavigate('games')} 
        />
      </div>
    </div>
  );
};

const NavCard: React.FC<{title: string, description: string, onClick: () => void}> = ({ title, description, onClick }) => {
    const handleClick = () => {
        playSound('click');
        onClick();
    }
    return (
        <div 
            onClick={handleClick}
            className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:scale-105 hover:bg-slate-800"
        >
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
}

const CyberWorldAnimation: React.FC = () => (
  <svg viewBox="0 0 400 200" className="w-full h-full">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#00FFFF', stopOpacity: 0.5 }} />
        <stop offset="100%" style={{ stopColor: '#0B0C10', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
    <circle cx="200" cy="100" r="80" fill="url(#glow)" />
    <circle cx="200" cy="100" r="60" fill="#0B0C10" stroke="#00FFFF" strokeWidth="1" />
    
    {[...Array(6)].map((_, i) => (
        <ellipse key={i} cx="200" cy="100" rx="60" ry={i * 10} stroke="#00FFFF" strokeWidth="0.5" fill="none" strokeOpacity="0.5" />
    ))}
    
    <path d="M150 80 Q 200 60, 250 80" stroke="#FF0080" strokeWidth="1" fill="none">
        <animate attributeName="stroke-dasharray" values="0 100; 5 5; 0 100" dur="5s" repeatCount="indefinite" />
    </path>
    <path d="M160 120 Q 200 140, 240 120" stroke="#00FFFF" strokeWidth="1" fill="none">
        <animate attributeName="stroke-dasharray" values="100 0; 5 5; 100 0" dur="4s" repeatCount="indefinite" />
    </path>
  </svg>
);