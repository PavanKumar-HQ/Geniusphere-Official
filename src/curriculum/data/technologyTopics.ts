import { TopicSpecification } from '../types';
import { TECH_PART_1 } from './techPart1';
import { TECH_PART_2 } from './techPart2';

// Combined Canonical Technology Topics (Topics 1 to 6)
// 1. Artificial Intelligence (AI) - 10 lessons, 10 labs
// 2. Blockchain Technology - 10 lessons, 10 labs
// 3. Microsoft Office - 10 lessons, 10 labs
// 4. Cybersecurity Basics - 10 lessons, 10 labs
// 5. Coding Basics - 10 lessons, 10 labs
// 6. Internet of Things (IoT) - 10 lessons, 10 labs
// Total: 60 Lessons, 60 Interactive Labs
export const TECHNOLOGY_TOPICS: TopicSpecification[] = [
  ...TECH_PART_1,
  ...TECH_PART_2,
];
