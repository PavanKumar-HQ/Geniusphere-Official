
import { Scenario, SkillType } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: SkillType.SPEAKING,
    description: "You're trying to explain a complex science project to your partner.",
    prompt: "How do you present your ideas?",
    animationType: 'student',
    choices: [
      {
        id: '1a',
        text: "Use simple words and break down steps clearly.",
        feedback: "Great! Your partner understood perfectly.",
        impact: { clarity: 20, listening: 0, confidence: 10, respect: 5 },
        lesson: "Clarity matters more than complexity."
      },
      {
        id: '1b',
        text: "Speak quickly and use many technical terms to sound smart.",
        feedback: "Your partner looks confused and lost.",
        impact: { clarity: -10, listening: 0, confidence: 5, respect: -5 },
        lesson: "Complex words don't help if they aren't understood."
      }
    ]
  },
  {
    id: 2,
    title: SkillType.LISTENING,
    description: "Your best friend is sharing a story about their weekend.",
    prompt: "How do you respond while they talk?",
    animationType: 'listening',
    choices: [
      {
        id: '2a',
        text: "Keep eye contact and nod along while they speak.",
        feedback: "Your friend feels heard and continues happily.",
        impact: { clarity: 0, listening: 25, confidence: 5, respect: 15 },
        lesson: "Listening is half of communication."
      },
      {
        id: '2b',
        text: "Interrupt them to tell your own story because it's cooler.",
        feedback: "Your friend stops talking and looks disappointed.",
        impact: { clarity: 0, listening: -15, confidence: 10, respect: -15 },
        lesson: "Don't just wait for your turn to talk; listen."
      }
    ],
    didYouKnow: "More than half of communication is non-verbal."
  },
  {
    id: 3,
    title: SkillType.BODY_LANGUAGE,
    description: "You're walking into a meeting for the school magazine.",
    prompt: "What posture do you adopt?",
    animationType: 'body',
    choices: [
      {
        id: '3a',
        text: "Sit upright, shoulders back, and make relaxed eye contact.",
        feedback: "You look approachable and ready to contribute.",
        impact: { clarity: 5, listening: 5, confidence: 20, respect: 10 },
        lesson: "Your body speaks before your words do."
      },
      {
        id: '3b',
        text: "Slouch in the chair and avoid looking at anyone.",
        feedback: "People think you're uninterested or bored.",
        impact: { clarity: 0, listening: -5, confidence: -15, respect: -5 },
        lesson: "Open body language invites connection."
      }
    ]
  },
  {
    id: 4,
    title: SkillType.TONE,
    description: "You need to ask a classmate to return a book they borrowed.",
    prompt: "Which tone do you use?",
    animationType: 'tone',
    choices: [
      {
        id: '4a',
        text: "Use a calm and polite tone: 'Hey, could I get my book back soon?'",
        feedback: "They apologize and promise to bring it tomorrow.",
        impact: { clarity: 10, listening: 5, confidence: 5, respect: 15 },
        lesson: "Tone changes the meaning of your words."
      },
      {
        id: '4b',
        text: "Use a sharp, sarcastic tone: 'Oh, so you're keeping my book forever now?'",
        feedback: "They get defensive and a small argument starts.",
        impact: { clarity: 5, listening: -5, confidence: 5, respect: -20 },
        lesson: "Sarcasm often hides the real message and creates friction."
      }
    ]
  },
  {
    id: 5,
    title: SkillType.QUESTIONS,
    description: "The teacher just finished explaining a difficult math problem.",
    prompt: "You're still confused. How do you ask for help?",
    animationType: 'classroom',
    choices: [
      {
        id: '5a',
        text: "Raise your hand and ask: 'Could you please re-explain the second step?'",
        feedback: "The teacher appreciates the specific question and helps out.",
        impact: { clarity: 15, listening: 10, confidence: 10, respect: 10 },
        lesson: "Good questions improve understanding for everyone."
      },
      {
        id: '5b',
        text: "Mutter 'This makes no sense' loudly to yourself.",
        feedback: "The teacher is annoyed and the class is distracted.",
        impact: { clarity: -10, listening: -5, confidence: -10, respect: -10 },
        lesson: "Constructive questions get better results than complaints."
      }
    ]
  },
  {
    id: 6,
    title: SkillType.FEEDBACK,
    description: "Your peer shows you a drawing they made. It needs some work.",
    prompt: "What do you say?",
    animationType: 'peer',
    choices: [
      {
        id: '6a',
        text: "Point out what's good and suggest one area to improve.",
        feedback: "Your peer feels encouraged to keep practicing.",
        impact: { clarity: 10, listening: 5, confidence: 5, respect: 20 },
        lesson: "Constructive feedback helps growth."
      },
      {
        id: '6b',
        text: "Tell them it doesn't look very good and they should restart.",
        feedback: "They feel discouraged and want to quit drawing.",
        impact: { clarity: 5, listening: 0, confidence: -10, respect: -25 },
        lesson: "Focus on the work, not the person, and be kind."
      }
    ]
  },
  {
    id: 7,
    title: SkillType.PUBLIC_SPEAKING,
    description: "You're standing on stage for the morning assembly.",
    prompt: "How do you start your speech?",
    animationType: 'stage',
    choices: [
      {
        id: '7a',
        text: "Take a deep breath, scan the room, and speak at a steady pace.",
        feedback: "The audience is quiet and attentive to your words.",
        impact: { clarity: 15, listening: 0, confidence: 25, respect: 10 },
        lesson: "Confidence grows with deliberate practice."
      },
      {
        id: '7b',
        text: "Look at your notes and rush through the intro to get it over with.",
        feedback: "People can't hear you clearly and start whispering.",
        impact: { clarity: -15, listening: 0, confidence: -10, respect: -5 },
        lesson: "Pausing and breathing are secret weapons of great speakers."
      }
    ]
  },
  {
    id: 8,
    title: SkillType.DIGITAL,
    description: "You're texting a group chat to plan a meeting time.",
    prompt: "What message do you send?",
    animationType: 'chat',
    choices: [
      {
        id: '8a',
        text: "Suggest a specific time and ask if it works for everyone.",
        feedback: "The group agrees quickly and plans are made.",
        impact: { clarity: 20, listening: 10, confidence: 10, respect: 10 },
        lesson: "Online words have real impact. Be clear and polite."
      },
      {
        id: '8b',
        text: "Just text 'idk when r we meeting' and wait.",
        feedback: "Nobody replies because the message is vague.",
        impact: { clarity: -15, listening: -5, confidence: -5, respect: -5 },
        lesson: "Ambiguity leads to digital confusion."
      }
    ]
  },
  {
    id: 9,
    title: SkillType.CONFLICT,
    description: "A classmate accidentally spilled water on your homework.",
    prompt: "How do you react?",
    animationType: 'conflict',
    choices: [
      {
        id: '9a',
        text: "Explain how you feel calmly and look for a solution together.",
        feedback: "They apologize and help you dry the paper or rewrite it.",
        impact: { clarity: 10, listening: 15, confidence: 15, respect: 20 },
        lesson: "Problems are solved through dialogue, not shouting."
      },
      {
        id: '9b',
        text: "Shout at them and call them names for being clumsy.",
        feedback: "A teacher has to intervene and both of you are in trouble.",
        impact: { clarity: -5, listening: -10, confidence: -10, respect: -30 },
        lesson: "Anger shuts down communication paths."
      }
    ]
  }
];
