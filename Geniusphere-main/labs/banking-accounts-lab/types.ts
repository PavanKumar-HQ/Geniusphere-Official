
export enum AccountType {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT',
  FIXED_DEPOSIT = 'FD',
  RECURRING_DEPOSIT = 'RD',
  SALARY = 'SALARY',
  STUDENT = 'STUDENT',
  JOINT = 'JOINT',
  COMPARISON = 'COMPARISON'
}

export interface AccountModule {
  id: AccountType;
  title: string;
  description: string;
  bestUse: string;
  growthMethod: string;
  color: string;
  icon: string;
  simplified: boolean;
  didYouKnow?: string;
  status?: string;
}

export interface SimState {
  isPlaying: boolean;
  progress: number;
  balance: number;
  transactions: Array<{ id: string; amount: number; type: 'IN' | 'OUT'; label: string; timestamp: number }>;
  timer: number;
}
