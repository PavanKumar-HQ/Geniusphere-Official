
export enum ModuleId {
  WHAT_IS_FINTECH = 1,
  DIGITAL_PAYMENTS = 2,
  ONLINE_BANKING = 3,
  UPI_MOBILE_WALLETS = 4,
  SECURITY = 5,
  FRAUD_DETECTION = 6,
  DIGITAL_LENDING = 7,
  INVESTING_APPS = 8,
  DAILY_LIFE = 9,
  RESPONSIBLE_USE = 10
}

export interface ModuleData {
  id: ModuleId;
  title: string;
  description: string;
  color: string;
  statusText?: string;
  statusType?: 'success' | 'warning' | 'error' | 'neutral';
}

export type SimStatus = 'playing' | 'paused' | 'reset';
