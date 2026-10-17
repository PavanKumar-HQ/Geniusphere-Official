
import React from 'react';
import { EventType, GlobalEvent } from '../types';
import { GLOBAL_EVENTS } from '../constants';

interface LeftPanelProps {
  onSelectEvent: (type: EventType) => void;
  selectedEvent: EventType;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ onSelectEvent, selectedEvent }) => {
  return (
    <div className="h-full flex flex-col p-4 bg-[#0A0F24] border-r border-[#1E293B] overflow-y-auto">
      <h2 className="text-sm font-bold text-[#4DA3FF] mb-4 tracking-widest uppercase">Global Events</h2>
      <div className="space-y-2">
        {Object.values(GLOBAL_EVENTS).map((event) => (
          <button
            key={event.type}
            onClick={() => onSelectEvent(event.type)}
            className={`w-full text-left p-3 rounded-lg transition-all border ${
              selectedEvent === event.type 
                ? 'bg-[#1E293B] border-[#4DA3FF] shadow-[0_0_15px_rgba(77,163,255,0.2)]' 
                : 'bg-transparent border-[#1E293B] hover:border-[#334155]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{event.icon}</span>
              <div>
                <div className="text-sm font-semibold">{event.label}</div>
                <div className="text-[10px] text-gray-400 leading-tight">{event.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface RightPanelProps {
  selectedEvent: GlobalEvent;
  currentStep: number;
}

export const RightPanel: React.FC<RightPanelProps> = ({ selectedEvent, currentStep }) => {
  return (
    <div className="h-full flex flex-col p-4 bg-[#0A0F24] border-l border-[#1E293B] overflow-y-auto">
      <h2 className="text-sm font-bold text-[#4DA3FF] mb-4 tracking-widest uppercase">Real-Life Impact</h2>
      
      <div className="bg-[#1E293B] rounded-lg p-4 mb-6 border border-[#334155]">
        <div className="text-xs text-[#4DA3FF] mb-1 font-bold">CURRENT FOCUS</div>
        <div className="text-lg font-bold flex items-center gap-2">
          <span>{selectedEvent.icon}</span>
          {selectedEvent.label}
        </div>
        <ul className="mt-3 space-y-2">
          {selectedEvent.realLifeImpact.map((impact, idx) => (
            <li key={idx} className="text-xs flex items-start gap-2">
              <span className="text-[#2AFFA2] mt-1">•</span>
              {impact}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 mb-2">MYTHS VS REALITY</h3>
        <div className="space-y-3">
          <div className="p-3 bg-[#1A1F35] rounded border-l-4 border-red-500">
            <div className="text-[10px] text-red-400 font-bold mb-1">❌ MYTH</div>
            <p className="text-xs">Global events don't affect students like me.</p>
          </div>
          <div className="p-3 bg-[#1A1F35] rounded border-l-4 border-green-500">
            <div className="text-[10px] text-green-400 font-bold mb-1">✅ REALITY</div>
            <p className="text-xs">They affect education costs, your future job market, and daily prices.</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-4 bg-gradient-to-br from-[#1E293B] to-[#0A0F24] rounded-lg border border-[#4DA3FF]/30">
          <div className="text-xs font-bold text-[#4DA3FF] mb-1">💡 DID YOU KNOW?</div>
          <p className="text-xs leading-relaxed italic">
            "A rise in oil prices can affect transport, food, electricity, and even the price of your school supplies."
          </p>
        </div>
      </div>
    </div>
  );
};
