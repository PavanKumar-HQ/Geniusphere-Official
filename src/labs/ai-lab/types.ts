
export enum ModuleCategory {
  SECURITY = 'Security',
  ETHICS = 'Ethics',
  PRACTICAL = 'Practical',
  PRIVACY = 'Privacy'
}

export interface SimStep {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

export interface AIModule {
  id: string;
  title: string;
  category: ModuleCategory;
  scenario: string;
  flow: string[];
  task: string;
  defense: string[];
  didYouKnow?: string;
}

export interface AppState {
  activeModuleId: string;
  isSimulating: boolean;
  currentStepIndex: number;
  simulationLogs: string[];
}
