
export enum ModuleId {
  WHAT_IS_MONEY = 1,
  INCOME_EXPENSES = 2,
  BUDGETING = 3,
  SAVING = 4,
  BANKING = 5,
  INTEREST = 6,
  INVESTMENT = 7,
  RISK_REWARD = 8,
  DIGITAL_PAYMENTS = 9,
  DISCIPLINE = 10
}

export interface FinanceModule {
  id: ModuleId;
  title: string;
  description: string;
  statusLabel?: string;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

export interface SimulationState {
  currentModuleId: ModuleId;
  isPaused: boolean;
  isSimplified: boolean;
  progress: number;
}
