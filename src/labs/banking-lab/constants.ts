
import { AccountType, AccountModule } from './types';

export const ACCOUNT_MODULES: AccountModule[] = [
  {
    id: AccountType.SAVINGS,
    title: 'Savings Account',
    description: 'Savings accounts are used to keep money safe and earn a little bit of interest over time.',
    bestUse: 'Daily savings, students, families',
    growthMethod: 'Money grows through compound interest. The bank pays you a small percentage (APY) for keeping your money with them.',
    color: '#3BF0FF',
    icon: 'PiggyBank',
    simplified: true,
    didYouKnow: 'The interest is calculated daily but usually credited to your account every 3 months!'
  },
  {
    id: AccountType.CURRENT,
    title: 'Current Account',
    description: 'Current accounts are for businesses with frequent transactions. They have no limits on withdrawals.',
    bestUse: 'Shops, companies, traders',
    growthMethod: 'Money does not grow via interest here. It flows in and out rapidly. Value comes from service features, not growth.',
    color: '#00FFA3',
    icon: 'Store',
    simplified: false,
    didYouKnow: 'Most current accounts do not pay any interest because the money moves in and out too fast.'
  },
  {
    id: AccountType.FIXED_DEPOSIT,
    title: 'Fixed Deposit (FD)',
    description: 'Fixed deposits give safe and predictable returns by locking your money for a fixed period.',
    bestUse: 'Long-term safe savings',
    growthMethod: 'Money grows at a higher fixed rate than savings. You agree not to touch it for a set time, and the bank rewards you with more interest.',
    color: '#4DA3FF',
    icon: 'Lock',
    simplified: false,
    status: 'GUARANTEED_RETURN',
    didYouKnow: 'If you withdraw money from an FD before the time is up, the bank might charge a small penalty fee.'
  },
  {
    id: AccountType.RECURRING_DEPOSIT,
    title: 'Recurring Deposit (RD)',
    description: 'Recurring deposits build savings slowly by putting away a small amount every month.',
    bestUse: 'Students, monthly savers',
    growthMethod: 'Growth comes from small monthly deposits + interest. It helps you build a large lump sum without needing all the money upfront.',
    color: '#4DA3FF',
    icon: 'CalendarClock',
    simplified: true,
    didYouKnow: 'RDs are perfect for saving up for big goals like a new bicycle or a laptop!'
  },
  {
    id: AccountType.SALARY,
    title: 'Salary Account',
    description: 'Salary accounts receive monthly income from employers. They often come with extra perks.',
    bestUse: 'Employees',
    growthMethod: 'Money grows through active income. Your employer deposits a large sum monthly, which you then spend on life needs.',
    color: '#7C6BFF',
    icon: 'Briefcase',
    simplified: false,
    didYouKnow: 'Salary accounts can often be converted to regular savings accounts if you change jobs.'
  },
  {
    id: AccountType.STUDENT,
    title: 'Student Account',
    description: 'These accounts help students learn banking safely with spending limits and no minimum balance.',
    bestUse: 'Children and teenagers',
    growthMethod: 'Grows via small allowances and birthday gifts. Some banks offer "educational interest" to encourage kids to save.',
    color: '#3BF0FF',
    icon: 'GraduationCap',
    simplified: true,
    status: 'SAFE_FOR_STUDENTS',
    didYouKnow: 'Banks often give free educational gifts or higher interest rates to encourage students to save!'
  },
  {
    id: AccountType.JOINT,
    title: 'Joint Account',
    description: 'Joint accounts are shared by two or more people. Everyone can see the balance and spend.',
    bestUse: 'Families, partners',
    growthMethod: 'Grows through pooled resources. When two or more people contribute, the balance increases much faster than individually.',
    color: '#7C6BFF',
    icon: 'Users',
    simplified: false,
    didYouKnow: 'There are two types: "Either or Survivor" (anyone can use) or "Jointly" (everyone must sign to spend).'
  },
  {
    id: AccountType.COMPARISON,
    title: 'Final Check',
    description: 'Choosing the right account matters for your financial future.',
    bestUse: 'Critical Thinking',
    growthMethod: 'The best growth comes from choosing the account that matches your goal.',
    color: '#FF4D4D',
    icon: 'Trophy',
    simplified: true
  }
];

export const BANKING_SMART_TIPS = [
  'Choose account based on purpose',
  'Don’t mix personal & business money',
  'Check interest and charges',
  'Use digital banking safely',
  'Track account activity regularly'
];
