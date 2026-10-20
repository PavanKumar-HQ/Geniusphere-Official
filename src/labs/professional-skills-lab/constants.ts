
import { SkillCategory, Scenario } from './types';

export const INITIAL_SCORES = {
  confidence: 50,
  communication: 50,
  teamwork: 50,
  responsibility: 50,
  growth: 50
};

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    category: SkillCategory.Communication,
    title: "The Group Discussion",
    description: "You are in a group project meeting. Everyone is talking at once. How do you share your idea?",
    animationType: "speaking",
    choices: [
      {
        id: "a",
        text: "Wait for a pause, then speak clearly and respectfully.",
        isCorrect: true,
        impact: { confidence: 10, communication: 15, teamwork: 5, responsibility: 0, growth: 5 },
        feedback: "Excellent! Waiting for your turn shows respect and ensures you are heard."
      },
      {
        id: "b",
        text: "Interrupt loudly so people are forced to listen to you.",
        isCorrect: false,
        impact: { confidence: -5, communication: -10, teamwork: -10, responsibility: 0, growth: 0 },
        feedback: "Interrupting can make others feel disrespected and blocks team harmony."
      }
    ],
    lesson: "Good communication builds trust and ensures everyone's voice matters.",
    didYouKnow: "70% of workplace mistakes are due to poor communication."
  },
  {
    id: 2,
    category: SkillCategory.Teamwork,
    title: "Task Distribution",
    description: "Your team is assigned a big science poster. Who does what?",
    animationType: "project-board",
    choices: [
      {
        id: "a",
        text: "Volunteer for a specific task and ask others what they'd like to do.",
        isCorrect: true,
        impact: { confidence: 5, communication: 5, teamwork: 15, responsibility: 10, growth: 5 },
        feedback: "Fair distribution of work keeps the team synchronized and happy!"
      },
      {
        id: "b",
        text: "Stay quiet and hope someone else does the hard parts.",
        isCorrect: false,
        impact: { confidence: 0, communication: -5, teamwork: -15, responsibility: -10, growth: 0 },
        feedback: "Avoiding responsibility creates conflict and delays the project."
      }
    ],
    lesson: "Team success depends on cooperation and fair sharing of efforts.",
    didYouKnow: "Teamwork makes the dream work - it's a cliché because it's true!"
  },
  {
    id: 3,
    category: SkillCategory.TimeManagement,
    title: "The Big Deadline",
    description: "You have an exam tomorrow and a project due. Your friends want to play games.",
    animationType: "clock-stress",
    choices: [
      {
        id: "a",
        text: "Plan your study blocks and finish the project first.",
        isCorrect: true,
        impact: { confidence: 10, communication: 0, teamwork: 0, responsibility: 15, growth: 10 },
        feedback: "Prioritization reduces stress and helps you achieve your goals."
      },
      {
        id: "b",
        text: "Play games now and pull an all-nighter later.",
        isCorrect: false,
        impact: { confidence: -10, communication: 0, teamwork: 0, responsibility: -15, growth: -5 },
        feedback: "Procrastination leads to panic and poor quality work."
      }
    ],
    lesson: "Managing time effectively reduces stress and improves performance.",
    didYouKnow: "Most successful people plan their day the night before."
  },
  {
    id: 4,
    category: SkillCategory.ProblemSolving,
    title: "The Missing File",
    description: "You're about to present, but your presentation file is missing from your USB.",
    animationType: "challenge",
    choices: [
      {
        id: "a",
        text: "Stay calm, check your email backup, and ask for 2 minutes to recover it.",
        isCorrect: true,
        impact: { confidence: 15, communication: 5, teamwork: 0, responsibility: 10, growth: 10 },
        feedback: "Great job! A calm mind finds solutions while a panicked one finds more problems."
      },
      {
        id: "b",
        text: "Panic, apologize profusely, and say you can't present today.",
        isCorrect: false,
        impact: { confidence: -15, communication: -5, teamwork: 0, responsibility: -5, growth: -5 },
        feedback: "Giving up is the only real failure. Always look for a workaround."
      }
    ],
    lesson: "Calm thinking beats panic in any unexpected challenge.",
    didYouKnow: "Problem-solving is considered the top skill by 90% of employers."
  },
  {
    id: 5,
    category: SkillCategory.EmotionalIntelligence,
    title: "Constructive Feedback",
    description: "A teacher suggests you improve your writing. You worked really hard on it.",
    animationType: "emotion-indicator",
    choices: [
      {
        id: "a",
        text: "Listen carefully and ask for specific tips to get better.",
        isCorrect: true,
        impact: { confidence: 5, communication: 10, teamwork: 0, responsibility: 5, growth: 20 },
        feedback: "Seeing feedback as a gift is the hallmark of a growth mindset."
      },
      {
        id: "b",
        text: "Get upset and assume the teacher just doesn't like your style.",
        isCorrect: false,
        impact: { confidence: -5, communication: -5, teamwork: 0, responsibility: 0, growth: -15 },
        feedback: "Reacting emotionally stops you from learning and growing."
      }
    ],
    lesson: "Understanding and managing emotions improves your relationships and skills.",
    didYouKnow: "EQ is often a better predictor of success than IQ."
  },
  {
    id: 6,
    category: SkillCategory.Leadership,
    title: "Leaderless Group",
    description: "The team is confused about the instructions. No one knows what to do next.",
    animationType: "leadership-moment",
    choices: [
      {
        id: "a",
        text: "Suggest a way forward and ask if everyone is comfortable with it.",
        isCorrect: true,
        impact: { confidence: 20, communication: 10, teamwork: 10, responsibility: 10, growth: 10 },
        feedback: "Leadership is about guiding and supporting, not controlling."
      },
      {
        id: "b",
        text: "Wait for someone else to step up, or start doing the whole thing alone.",
        isCorrect: false,
        impact: { confidence: -10, communication: -5, teamwork: -10, responsibility: 0, growth: 0 },
        feedback: "Stepping up when needed is how you build trust and influence."
      }
    ],
    lesson: "Leadership is service and guidance, not power or control.",
    didYouKnow: "The best leaders are actually great listeners."
  },
  {
    id: 7,
    category: SkillCategory.WorkEthics,
    title: "The Honest Mistake",
    description: "You accidentally broke a small piece of equipment in the lab. No one saw.",
    animationType: "ethics-check",
    choices: [
      {
        id: "a",
        text: "Inform the supervisor immediately and offer to help fix or replace it.",
        isCorrect: true,
        impact: { confidence: 10, communication: 5, teamwork: 5, responsibility: 25, growth: 5 },
        feedback: "Integrity builds a reputation that lasts a lifetime."
      },
      {
        id: "b",
        text: "Put it back quietly and pretend it was like that when you found it.",
        isCorrect: false,
        impact: { confidence: -20, communication: 0, teamwork: -10, responsibility: -30, growth: 0 },
        feedback: "Excuses and hiding mistakes destroy trust and respect."
      }
    ],
    lesson: "Integrity and honesty are the foundations of professional respect.",
    didYouKnow: "Honesty is the fastest way to turn a mistake into a learning moment."
  },
  {
    id: 8,
    category: SkillCategory.Adaptability,
    title: "New Tools",
    description: "The school just switched to a new digital portal you've never used before.",
    animationType: "adapt-tool",
    choices: [
      {
        id: "a",
        text: "Explore the new tool and watch a quick tutorial to learn the ropes.",
        isCorrect: true,
        impact: { confidence: 5, communication: 0, teamwork: 0, responsibility: 5, growth: 20 },
        feedback: "Being a lifelong learner keeps you relevant in a changing world."
      },
      {
        id: "b",
        text: "Complain that the old way was better and refuse to use it.",
        isCorrect: false,
        impact: { confidence: -5, communication: -5, teamwork: -5, responsibility: -5, growth: -20 },
        feedback: "Resistance to change is the biggest barrier to progress."
      }
    ],
    lesson: "Learning and adapting keeps you useful and relevant.",
    didYouKnow: "Adaptability is one of the top skills for the 21st century."
  },
  {
    id: 9,
    category: SkillCategory.Etiquette,
    title: "Emailing a Teacher",
    description: "You need to ask a teacher for an extension on your homework.",
    animationType: "email-draft",
    choices: [
      {
        id: "a",
        text: "Write a polite email with a clear subject line and formal greeting.",
        isCorrect: true,
        impact: { confidence: 5, communication: 15, teamwork: 0, responsibility: 10, growth: 5 },
        feedback: "Professional etiquette opens doors that talent alone cannot."
      },
      {
        id: "b",
        text: "Send a quick text-style message: 'Hey, can't do it today. Thx.'",
        isCorrect: false,
        impact: { confidence: -5, communication: -15, teamwork: 0, responsibility: -10, growth: 0 },
        feedback: "Being overly casual in professional settings can be seen as disrespectful."
      }
    ],
    lesson: "Manners and professional etiquette matter in every interaction.",
    didYouKnow: "Good manners are often free but carry immense value."
  },
  {
    id: 10,
    category: SkillCategory.DigitalProfessionalism,
    title: "The Public Post",
    description: "You're frustrated with a school rule. You want to post about it online.",
    animationType: "social-media",
    choices: [
      {
        id: "a",
        text: "Think about the impact and choose to discuss it privately with a teacher.",
        isCorrect: true,
        impact: { confidence: 5, communication: 5, teamwork: 0, responsibility: 20, growth: 10 },
        feedback: "A responsible digital footprint protects your future opportunities."
      },
      {
        id: "b",
        text: "Post a mean comment and tag the school to show your anger.",
        isCorrect: false,
        impact: { confidence: -10, communication: -10, teamwork: -10, responsibility: -20, growth: -5 },
        feedback: "The internet never forgets. Careless posts can haunt your career later."
      }
    ],
    lesson: "Your online behavior directly affects your real-world reputation.",
    didYouKnow: "Over 70% of recruiters check social media before hiring."
  }
];

export const MYTHS_VS_REALITY = [
  { myth: "Soft skills are optional", reality: "Soft skills are essential for career growth." },
  { myth: "Leaders are born", reality: "Leadership is a skill that can be trained and learned." },
  { myth: "Skills can't be improved", reality: "Any skill grows with practice and reflection." }
];
