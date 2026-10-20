import { TopicSpecification } from '../types';
import { PROF_PART_1 } from './profPart1';
import { PROF_PART_2 } from './profPart2';

// Combined Canonical Professional Skills Topics (Topics 13 to 17)
// 13. Communication - 10 lessons, 10 labs
// 14. Time Management - 10 lessons, 10 labs
// 15. Soft Skills & Emotional Intelligence - 10 lessons, 10 labs
// 16. Startup Ideation & Venture Creation - 10 lessons, 10 labs
// 17. Social Profile Development & Digital Identity - 10 lessons, 10 labs
// Total: 50 Lessons, 50 Interactive Labs
export const PROFESSIONAL_TOPICS: TopicSpecification[] = [
  ...PROF_PART_1,
  ...PROF_PART_2,
];
