import { TopicSpecification } from '../types';
import { FIN_PART_1 } from './finPart1';
import { FIN_PART_2 } from './finPart2';

// Combined Canonical Finance Topics (Topics 7 to 12)
// 7. Introduction to Finance - 10 lessons, 10 labs
// 8. Stock Market - 10 lessons, 10 labs
// 9. Cryptocurrency - 10 lessons, 10 labs
// 10. Financial Technology (FinTech) - 10 lessons, 10 labs
// 11. Global Economy - 10 lessons, 10 labs
// 12. Types of Banking Accounts - 10 lessons, 10 labs
// Total: 60 Lessons, 60 Interactive Labs
export const FINANCE_TOPICS: TopicSpecification[] = [
  ...FIN_PART_1,
  ...FIN_PART_2,
];
