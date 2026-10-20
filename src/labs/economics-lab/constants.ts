
import { EventType, SimulationStep, GlobalEvent } from './types';

export const SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 1,
    title: 'CONNECTED WORLD',
    description: 'Countries depend on each other for trade, energy, food, and technology.',
  },
  {
    id: 2,
    title: 'GLOBAL EVENT TRIGGERS',
    description: 'A major global event begins in one region.',
    status: 'EVENT_DETECTED',
    statusColor: '#4DA3FF',
  },
  {
    id: 3,
    title: 'SUPPLY CHAIN DISRUPTION',
    description: 'Events can interrupt the supply of goods and services.',
    status: 'WARNING',
    statusColor: '#FF4D4D',
  },
  {
    id: 4,
    title: 'PRICE CHANGES',
    description: 'When supply changes, prices often change too.',
    status: 'PRICE_FLUCTUATION',
    statusColor: '#FFA14D',
  },
  {
    id: 5,
    title: 'IMPACT ON COUNTRIES',
    description: 'Different countries are affected in different ways.',
  },
  {
    id: 6,
    title: 'IMPACT ON BUSINESSES',
    description: 'Businesses may face higher costs, shortages, or new opportunities.',
  },
  {
    id: 7,
    title: 'IMPACT ON JOBS',
    description: 'Global events influence employment and income.',
    status: 'JOB_MARKET_SHIFT',
    statusColor: '#4DA3FF',
  },
  {
    id: 8,
    title: 'GOVERNMENT RESPONSE',
    description: 'Governments respond using laws, budgets, and economic policies.',
  },
  {
    id: 9,
    title: 'IMPACT ON DAILY LIFE',
    description: 'People feel the impact through prices, jobs, and lifestyle changes.',
  },
  {
    id: 10,
    title: 'LONG-TERM EFFECTS',
    description: 'Some events cause short-term shocks, others reshape the world.',
    status: 'RECOVERY / RECESSION',
    statusColor: '#2AFFA2',
  },
];

export const GLOBAL_EVENTS: Record<EventType, GlobalEvent> = {
  [EventType.WAR]: {
    type: EventType.WAR,
    label: 'Wars & Conflicts',
    icon: '⚔️',
    color: '#FF4D4D',
    description: 'Geopolitical tensions disrupting regions.',
    realLifeImpact: ['Fuel & food prices rise', 'Trade routes blocked', 'Resource scarcity'],
  },
  [EventType.PANDEMIC]: {
    type: EventType.PANDEMIC,
    label: 'Pandemics & Health Crises',
    icon: '🦠',
    color: '#FFA14D',
    description: 'Global health emergencies affecting movement.',
    realLifeImpact: ['Job loss in service sectors', 'Digital industry growth', 'Healthcare strain'],
  },
  [EventType.ELECTION]: {
    type: EventType.ELECTION,
    label: 'Elections & Policy Changes',
    icon: '🗳️',
    color: '#4DA3FF',
    description: 'Shifts in leadership and national priorities.',
    realLifeImpact: ['Market uncertainty', 'New trade laws', 'Budget reallocations'],
  },
  [EventType.TRADE]: {
    type: EventType.TRADE,
    label: 'Trade Agreements & Sanctions',
    icon: '🤝',
    color: '#2AFFA2',
    description: 'Economic cooperation or restrictions between nations.',
    realLifeImpact: ['Tariff changes', 'Shift in manufacturing hubs', 'Import/Export volume'],
  },
  [EventType.ENERGY]: {
    type: EventType.ENERGY,
    label: 'Oil & Energy Events',
    icon: '🛢️',
    color: '#FFD700',
    description: 'Fluctuations in global energy supply and cost.',
    realLifeImpact: ['Transport costs shift', 'Electricity bills change', 'Renewable tech investment'],
  },
  [EventType.CLIMATE]: {
    type: EventType.CLIMATE,
    label: 'Climate Disasters',
    icon: '🌪️',
    color: '#00CED1',
    description: 'Environmental events affecting agriculture and safety.',
    realLifeImpact: ['Crop damage', 'Infrastructure repair costs', 'Mass migration pressures'],
  },
  [EventType.TECH]: {
    type: EventType.TECH,
    label: 'Tech Breakthroughs',
    icon: '🚀',
    color: '#8A2BE2',
    description: 'Rapid advancements in AI, energy, or connectivity.',
    realLifeImpact: ['New career paths', 'Productivity gains', 'Older industry disruption'],
  },
  [EventType.CRISIS]: {
    type: EventType.CRISIS,
    label: 'Financial Crises',
    icon: '📉',
    color: '#FF4D4D',
    description: 'Systemic banking or market failures.',
    realLifeImpact: ['Savings value fluctuation', 'Lending freezes', 'Global growth slowdown'],
  },
};

export const COLORS = {
  bg: '#070B1A',
  neutral: '#4DA3FF',
  growth: '#2AFFA2',
  stress: '#FFA14D',
  crisis: '#FF4D4D',
  info: '#E6E9F0',
};
