
export enum SkillCategory {
  Communication = 'Communication',
  Teamwork = 'Teamwork',
  TimeManagement = 'Time Management',
  ProblemSolving = 'Problem Solving',
  EmotionalIntelligence = 'Emotional Intelligence',
  Leadership = 'Leadership Basics',
  WorkEthics = 'Work Ethics & Discipline',
  Adaptability = 'Adaptability & Learning',
  Etiquette = 'Professional Etiquette',
  DigitalProfessionalism = 'Digital Professionalism'
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  impact: {
    confidence: number;
    communication: number;
    teamwork: number;
    responsibility: number;
    growth: number;
  };
  feedback: string;
}

export interface Scenario {
  id: number;
  category: SkillCategory;
  title: string;
  description: string;
  animationType: string;
  choices: Choice[];
  lesson: string;
  didYouKnow: string;
}

export interface Scores {
  confidence: number;
  communication: number;
  teamwork: number;
  responsibility: number;
  growth: number;
}
