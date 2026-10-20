
import { SimulationStep, StepData, Topic } from './types';

export const TOPICS: Topic[] = [
  { id: SimulationStep.COMPANY_NEEDS_MONEY, title: "What is the Stock Market", description: "The starting point of every business." },
  { id: SimulationStep.SHARES_CREATED, title: "Companies & Shares", description: "How ownership is divided." },
  { id: SimulationStep.INVESTORS_BUY, title: "Buyers & Sellers", description: "Becoming a part-owner." },
  { id: SimulationStep.MARKET_CONNECTS, title: "Stock Price Movement", description: "The invisible marketplace." },
  { id: SimulationStep.PRICE_MOVEMENT, title: "Long-Term Investing", description: "Why prices go up and down." },
  { id: SimulationStep.LONG_TERM_GROWTH, title: "Market Risk", description: "The power of patience." },
  { id: SimulationStep.MARKET_RISK, title: "Stock Market Myths", description: "Handling ups and downs." },
  { id: SimulationStep.MYTH_VS_REALITY, title: "Responsible Participation", description: "Fact vs Fiction." },
];

export const STEPS: StepData[] = [
  {
    id: SimulationStep.COMPANY_NEEDS_MONEY,
    title: "Step 1: Company Needs Money",
    shortDesc: "A company needs money to grow its business.",
    longDesc: "Imagine a company that makes amazing electric bikes. To build a factory and reach more people, they need more money than they currently have.",
    status: "FUNDING_REQUIRED"
  },
  {
    id: SimulationStep.SHARES_CREATED,
    title: "Step 2: Shares are Created",
    shortDesc: "The company divides ownership into shares.",
    longDesc: "Instead of borrowing money from a bank, the company decides to divide its ownership into millions of tiny pieces called 'shares'.",
    status: "SHARES_ISSUED"
  },
  {
    id: SimulationStep.INVESTORS_BUY,
    title: "Step 3: Investors Buy Shares",
    shortDesc: "People buy shares and become part-owners.",
    longDesc: "When you buy a share, you're not just 'betting'—you're actually buying a tiny piece of that company. You are now a shareholder!",
    status: "OWNERSHIP_CREATED"
  },
  {
    id: SimulationStep.MARKET_CONNECTS,
    title: "Step 4: The Market Connects People",
    shortDesc: "The stock market connects buyers and sellers.",
    longDesc: "The stock market acts like a digital giant meeting room where people who want to buy shares meet people who want to sell them.",
    status: "MARKET_ACTIVE"
  },
  {
    id: SimulationStep.PRICE_MOVEMENT,
    title: "Step 5: Stock Price Movement",
    shortDesc: "Prices change based on company performance.",
    longDesc: "If the company does well and makes more bikes, more people want to buy its shares. High demand causes the price to go up.",
    status: "PRICE_DISCOVERY"
  },
  {
    id: SimulationStep.LONG_TERM_GROWTH,
    title: "Step 6: Long-Term Growth",
    shortDesc: "Daily ups and downs matter less than the trend.",
    longDesc: "Stock prices wiggle every day, but over many years, companies that grow and provide value tend to see their share prices rise steadily.",
    status: "COMPOUNDING_MODE"
  },
  {
    id: SimulationStep.MARKET_RISK,
    title: "Step 7: Understanding Risk",
    shortDesc: "Markets can fall, but they usually recover.",
    longDesc: "Sometimes bad news or a slow economy causes prices to drop. This is called market risk. Patience is the key to surviving these periods.",
    status: "MARKET_VOLATILITY"
  },
  {
    id: SimulationStep.MYTH_VS_REALITY,
    title: "Step 8: Myth vs Reality",
    shortDesc: "Stock markets reward patience, not shortcuts.",
    longDesc: "The market isn't a casino for quick money. It's a way to participate in the growth of great businesses over your lifetime.",
    status: "FINANCIAL_LITERACY"
  }
];

export const COLORS = {
  bg: "#070B1A",
  company: "#3BF0FF",
  money: "#00FFA3",
  market: "#7C6BFF",
  growth: "#00FFA3",
  risk: "#FF4D4D",
  text: "#E6E9F0",
  secondary: "#94A3B8"
};
