// ====================================================================
// Geniusphere — Authoritative Curriculum Manifest Type Definitions
// Defines the strict schema for 17 Canonical Topics,
// 170 YouTube Video Lessons (10 per topic), and
// 170 Interactive SVG Simulation Labs (10 per topic).
// ====================================================================

export type TopicCategory = 'technology' | 'finance' | 'professional';

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED';

export type LabDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LabControl {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'toggle' | 'button';
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  defaultValue: any;
  unit?: string;
  description?: string;
}

export interface VideoLesson {
  id: string;
  topicId: string;
  orderIndex: number; // 1 to 10
  title: string;
  description: string;
  learningObjectives: string[];
  keyTakeaways: string[];
  youtubeVideoId: string;
  youtubeUrl: string;
  channelTitle: string;
  durationMinutes: number;
  verificationStatus: VerificationStatus;
  relatedLabId: string;
}

export interface SimulationLab {
  id: string;
  topicId: string;
  orderIndex: number; // 1 to 10
  slug: string;
  title: string;
  summary: string;
  learningObjective: string;
  conceptModelled: string;
  initialState: Record<string, any>;
  controls: LabControl[];
  algorithmDescription: string;
  formula: string;
  reflectionQuestion: string;
  completionCriteria: string[];
  modelLimitations: string;
}

export interface TopicSpecification {
  id: string;
  canonicalIndex: number; // 1 to 17
  title: string;
  slug: string;
  category: TopicCategory;
  summary: string;
  learningObjectives: string[];
  difficulty: LabDifficulty;
  estimatedHours: number;
  lessons: VideoLesson[]; // Exactly 10
  labs: SimulationLab[]; // Exactly 10
}

export interface TopicProgressRecord {
  topicId: string;
  completedLessonIds: string[];
  completedLabIds: string[];
  lastAccessedAt: string;
  percentComplete: number;
}
