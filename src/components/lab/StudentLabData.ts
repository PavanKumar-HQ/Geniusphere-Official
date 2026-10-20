import { LabConfig } from './LabTypes';

// This file is for NEW student-facing labs.
// Add your modules below.

export const STUDENT_LAB_CONFIGS: Record<string, LabConfig> = {
    // Example Template (Uncomment and fill to add a lab):
    /*
    'lab_physics_101': {
        id: 'lab_physics_101',
        title: 'Physics: Motion & Force',
        theme: 'blue',
        modules: [
            {
                id: 'newton_laws',
                title: 'Newton\'s Laws',
                description: 'Understand how forces affect motion.',
                analogy: 'Pushing a car vs. pushing a bike.',
                animationSteps: [
                    { time: 0, label: 'Inertia', text: 'Objects keep doing what they are doing.', microcopy: 'Law #1' },
                    { time: 5, label: 'Force', text: 'F = ma. More mass needs more force.', microcopy: 'Law #2' },
                ],
                keyPoints: [
                    { title: 'Inertia', description: 'Resistance to change in motion.' }
                ],
                quiz: {
                    question: 'What is F=ma?',
                    options: ['Force', 'Mass', 'Acceleration', 'Newton'],
                    correctAnswer: 'Force',
                    explanation: 'Force equals mass times acceleration.'
                },
                miniSim: {
                    description: 'Push a heavy box.',
                    options: [
                        { id: 'a', text: 'Push hard', isCorrect: true },
                        { id: 'b', text: 'Do nothing', isCorrect: false }
                    ],
                    feedback: { correct: 'It moved!', incorrect: 'Nothing happened.' }
                },
                funFact: 'Newton was 23 when he discovered this.',
                badge: 'Physics Pro',
                animationType: 'process_flow'
            }
        ]
    }
    */
};
