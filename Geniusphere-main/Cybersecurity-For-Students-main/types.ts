export interface AnimationStep {
  time: number;
  label: string;
  text: string;
  microcopy?: string;
  focusPoint?: { x: number; y: number };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MiniSim {
  description: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  feedback: { correct: string; incorrect: string };
}

export interface Defense {
  point: string;
  description: string;
}

export interface AttackModuleData {
  id: string;
  title: string;
  simpleDefinition: string;
  kidFriendly: string;
  animationSteps: AnimationStep[];
  defenses: Defense[];
  quiz: QuizQuestion;
  miniSim: MiniSim;
  funFact: string;
  badge: string;
}