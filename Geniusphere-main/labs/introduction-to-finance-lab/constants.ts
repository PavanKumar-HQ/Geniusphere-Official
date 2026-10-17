
import { ModuleId, FinanceModule } from './types';

export const COLORS = {
  background: '#070B1A',
  income: '#00FFA3',
  expense: '#FF4D4D',
  savings: '#3BF0FF',
  growth: '#7C6BFF',
  text: '#E6E9F0'
};

export const MODULES: FinanceModule[] = [
  { id: ModuleId.WHAT_IS_MONEY, title: "1. What is Money", description: "Money is a medium to exchange value.", statusLabel: "EXCHANGE_READY", statusColor: 'blue' },
  { id: ModuleId.INCOME_EXPENSES, title: "2. Income & Expenses", description: "Money comes in and goes out.", statusLabel: "CASH_FLOW_ACTIVE", statusColor: 'yellow' },
  { id: ModuleId.BUDGETING, title: "3. Budgeting", description: "A budget helps control money.", statusLabel: "BUDGET_BALANCED", statusColor: 'green' },
  { id: ModuleId.SAVING, title: "4. Saving Money", description: "Saving prepares you for future needs.", statusLabel: "FUND_ACCUMULATING", statusColor: 'blue' },
  { id: ModuleId.BANKING, title: "5. Banking Basics", description: "Banks keep money safe and accessible.", statusLabel: "BANK_SECURE", statusColor: 'blue' },
  { id: ModuleId.INTEREST, title: "6. Interest (Simple & Compound)", description: "Money can grow over time.", statusLabel: "INTEREST_CALCULATING", statusColor: 'purple' },
  { id: ModuleId.INVESTMENT, title: "7. Investment Basics", description: "Investing helps money grow, but takes time.", statusLabel: "LONG_TERM_GROWTH", statusColor: 'green' },
  { id: ModuleId.RISK_REWARD, title: "8. Risk & Reward", description: "Higher returns usually come with higher risk.", statusLabel: "MARKET_VOLATILE", statusColor: 'yellow' },
  { id: ModuleId.DIGITAL_PAYMENTS, title: "9. Digital Payments", description: "Money can move digitally and instantly.", statusLabel: "PAYMENT_SUCCESSFUL", statusColor: 'green' },
  { id: ModuleId.DISCIPLINE, title: "10. Financial Discipline", description: "Good habits matter more than income.", statusLabel: "FINANCIALLY_AWARE", statusColor: 'green' },
];

export const SMART_TIPS = [
  "Track income and expenses",
  "Save before spending",
  "Avoid unnecessary debt",
  "Plan long-term",
  "Be patient with money"
];

export const DID_YOU_KNOW = [
  "Financial habits formed early often last a lifetime.",
  "The earliest form of money was obsidian and shells.",
  "Compound interest is often called the 8th wonder of the world.",
  "Most millionaires follow a strict budget.",
  "Digital payments now account for over 60% of daily transactions."
];
