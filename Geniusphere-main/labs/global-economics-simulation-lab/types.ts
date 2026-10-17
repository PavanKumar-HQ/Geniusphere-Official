
export enum EventType {
  WAR = 'WAR',
  PANDEMIC = 'PANDEMIC',
  ELECTION = 'ELECTION',
  TRADE = 'TRADE',
  ENERGY = 'ENERGY',
  CLIMATE = 'CLIMATE',
  TECH = 'TECH',
  CRISIS = 'CRISIS'
}

export interface SimulationStep {
  id: number;
  title: string;
  description: string;
  status?: string;
  statusColor?: string;
}

export interface GlobalEvent {
  type: EventType;
  label: string;
  icon: string;
  color: string;
  description: string;
  realLifeImpact: string[];
}

export interface SimulationState {
  currentStep: number;
  selectedEvent: EventType;
  isPlaying: boolean;
  isSimplified: boolean;
  progress: number;
}
