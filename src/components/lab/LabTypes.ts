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

export interface KeyPoint {
    title: string;
    description: string;
}

export interface LabModule {
    id: string;
    title: string;
    description: string;
    analogy: string; // "Kid Friendly" explanation
    animationSteps: AnimationStep[];
    keyPoints: KeyPoint[]; // Was "defenses"
    quiz: QuizQuestion;
    miniSim: MiniSim;
    funFact: string;
    badge: string;
    icon?: string; // Icon name from lucide-react
    animationType?: 'process_flow' | 'neural_network' | 'growth_chart' | 'budget_pie' | 'hashing' | 'iot_sensor' | 'classroom' | 'conversation';
}

export interface LabConfig {
    id: string; // e.g., 'sim_ai_neural'
    title: string;
    theme: 'red' | 'blue' | 'green' | 'purple' | 'amber' | 'cyan';
    modules: LabModule[];
}
