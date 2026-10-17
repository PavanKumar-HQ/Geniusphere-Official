
import { AIModule, ModuleCategory } from './types';

export const AI_MODULES: AIModule[] = [
  {
    id: 'prompt-injection',
    title: 'Prompt Injection Attack',
    category: ModuleCategory.SECURITY,
    scenario: 'A chatbot is answering user questions. A hidden malicious prompt tries to override core instructions.',
    flow: [
      'Initializing chat interface...',
      'Intercepting user query buffer...',
      'Analyzing for recursive instruction calls...',
      'Detecting system-level bypass attempts'
    ],
    task: 'Identify which input is attempting to override the AI system instructions and apply a filter.',
    defense: [
      'Strict input validation',
      'Immutable system instruction blocks',
      'Output semantic filtering'
    ],
    didYouKnow: 'Prompt injection is similar to SQL injection, but targets the LLM reasoning process.'
  },
  {
    id: 'hallucination-detection',
    title: 'AI Hallucination Detection',
    category: ModuleCategory.PRACTICAL,
    scenario: 'The AI confidently presents fake facts. Can you spot the divergence from reality?',
    flow: [
      'Scanning knowledge graph metadata...',
      'Cross-referencing verified databases...',
      'Checking confidence intervals...',
      'Flagging high-confidence inaccuracies'
    ],
    task: 'Verify the AI output below and flag specific claims that lack external source validation.',
    defense: [
      'Chain-of-verification prompting',
      'Integration with Grounded Search',
      'Explicit citation requirements'
    ],
    didYouKnow: 'Hallucinations often occur because LLMs predict the most likely "next token," not necessarily the most truthful one.'
  },
  {
    id: 'bias-audit',
    title: 'Bias in AI Responses',
    category: ModuleCategory.ETHICS,
    scenario: 'An automated resume screening AI is favoring specific demographics based on historical patterns.',
    flow: [
      'Auditing training data weights...',
      'Simulating diverse candidate profiles...',
      'Measuring output parity...',
      'Visualizing disparate impact'
    ],
    task: 'Rewrite the scoring prompt to remove historical bias triggers found in the data sample.',
    defense: [
      'Diverse training set curation',
      'Adversarial debiasing techniques',
      'Continuous output monitoring'
    ],
    didYouKnow: 'AI bias usually stems from historical biases present in the human-generated training data.'
  },
  {
    id: 'data-leakage',
    title: 'AI Data Leakage Simulation',
    category: ModuleCategory.PRIVACY,
    scenario: 'A user attempts to "socially engineer" the AI into revealing training-set secrets.',
    flow: [
      'Analyzing probe request semantics...',
      'Checking PII protection layer...',
      'Evaluating context window leakage...',
      'Applying differential privacy mask'
    ],
    task: 'Configure the AI to block queries that request internal documentation or sensitive user data.',
    defense: [
      'Strict PII scrubbing',
      'Restricted context windows',
      'Internal data masking'
    ],
    didYouKnow: 'Indirect prompt leakage can sometimes reveal parts of the hidden system instructions.'
  },
  {
    id: 'deepfake-detection',
    title: 'Deepfake Analysis Lab',
    category: ModuleCategory.SECURITY,
    scenario: 'A video message from the CEO arrives, but the lip-syncing seems slightly off.',
    flow: [
      'Deconstructing video frames...',
      'Analyzing facial mesh consistency...',
      'Checking audio-visual synchronization...',
      'Extracting digital signature metadata'
    ],
    task: 'Examine the metadata and visual artifacts to determine if this media is authentic.',
    defense: [
      'Content provenance (C2PA)',
      'Digital watermarking',
      'Biometric verification'
    ],
    didYouKnow: 'State-of-the-art deepfakes often struggle with consistent eye reflections and natural blinking patterns.'
  },
  {
    id: 'jailbreak-simulation',
    title: 'Jailbreak Attempt Lab',
    category: ModuleCategory.SECURITY,
    scenario: 'User uses the "DAN" (Do Anything Now) persona to bypass safety guardrails.',
    flow: [
      'Detecting roleplay entrapment...',
      'Mapping intent to safety policy...',
      'Analyzing recursive hypothetical scenarios...',
      'Enforcing core safety constraints'
    ],
    task: 'Identify the linguistic pattern used to trick the AI and implement a persona-shift detector.',
    defense: [
      'Safety policy layering',
      'Persona-independent filtering',
      'Real-time intent classification'
    ],
    didYouKnow: 'Jailbreaking is a cat-and-mouse game between red-teamers and AI safety engineers.'
  },
  {
    id: 'training-poisoning',
    title: 'Data Poisoning Attack',
    category: ModuleCategory.SECURITY,
    scenario: 'Malicious actors inject corrupted data into a public fine-tuning dataset.',
    flow: [
      'Filtering incoming dataset...',
      'Identifying out-of-distribution samples...',
      'Calculating anomaly scores...',
      'Isolating compromised nodes'
    ],
    task: 'Scan the dataset for "backdoor" patterns that would trigger malicious behavior during inference.',
    defense: [
      'Rigorous data sanitization',
      'Source attribution tracking',
      'Model robustness testing'
    ],
    didYouKnow: 'A single poisoned sample in every 10,000 can sometimes create a reliable backdoor in an LLM.'
  },
  {
    id: 'prompt-engineering',
    title: 'Engineering Efficiency',
    category: ModuleCategory.PRACTICAL,
    scenario: 'A vague prompt leads to high costs and poor results. Optimize it for production.',
    flow: [
      'Measuring token efficiency...',
      'Evaluating instruction clarity...',
      'Testing zero-shot vs few-shot...',
      'Profiling output latency'
    ],
    task: 'Refactor the prompt below to reduce token usage by 30% while maintaining accuracy.',
    defense: [
      'Structured XML tags',
      'Explicit output formatting',
      'Iterative refinement'
    ],
    didYouKnow: 'Better prompts can often reduce API costs by over 50% without losing quality.'
  }
];
