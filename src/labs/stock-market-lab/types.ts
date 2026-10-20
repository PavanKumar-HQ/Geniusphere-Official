
export enum SimulationStep {
  COMPANY_NEEDS_MONEY = 0,
  SHARES_CREATED = 1,
  INVESTORS_BUY = 2,
  MARKET_CONNECTS = 3,
  PRICE_MOVEMENT = 4,
  LONG_TERM_GROWTH = 5,
  MARKET_RISK = 6,
  MYTH_VS_REALITY = 7
}

export interface Topic {
  id: SimulationStep;
  title: string;
  description: string;
}

export interface StepData {
  id: SimulationStep;
  title: string;
  shortDesc: string;
  longDesc: string;
  status?: string;
}
