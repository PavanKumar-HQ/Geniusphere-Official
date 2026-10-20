
export enum SkillType {
  SPEAKING = 'Speaking Clearly',
  LISTENING = 'Active Listening',
  BODY_LANGUAGE = 'Body Language',
  TONE = 'Tone & Emotion',
  QUESTIONS = 'Asking Questions',
  FEEDBACK = 'Giving Feedback',
  PUBLIC_SPEAKING = 'Public Speaking Basics',
  DIGITAL = 'Digital Communication',
  CONFLICT = 'Conflict Communication'
}

export interface Choice {
  id: string;
  text: string;
  feedback: string;
  impact: {
    clarity: number;
    listening: number;
    confidence: number;
    respect: number;
  };
  lesson: string;
}

export interface Scenario {
  id: number;
  title: SkillType;
  description: string;
  prompt: string;
  choices: Choice[];
  didYouKnow?: string;
  animationType: 'student' | 'listening' | 'body' | 'tone' | 'classroom' | 'peer' | 'stage' | 'chat' | 'conflict';
}

export interface ScoreState {
  clarity: number;
  listening: number;
  confidence: number;
  respect: number;
}
