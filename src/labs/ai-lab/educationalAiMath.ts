/**
 * Pure deterministic educational mathematical models for Geniusphere AI Lab.
 *
 * NOTE: These algorithms are designed for educational demonstrations of AI concepts
 * (tokenization, embeddings, scaled dot-product attention, neural forward pass,
 * temperature softmax sampling, and prompt security boundaries).
 * They are clearly disclosed in the UI as pedagogical models, not production LLM weights.
 */

export interface TokenItem {
  id: number;
  text: string;
  position: number;
  charStart: number;
  charEnd: number;
}

/**
 * Deterministic educational tokenizer.
 * Splits on word boundaries, contractions, and punctuation while preserving character offsets.
 */
export function tokenizeText(input: string): TokenItem[] {
  if (!input || !input.trim()) {
    return [];
  }

  // Regex matching words, contractions (e.g. don't, I'm), numbers, and individual punctuation marks
  const tokenRegex = /[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?|[^\s\w]/g;
  const tokens: TokenItem[] = [];
  let match: RegExpExecArray | null;
  let pos = 0;

  while ((match = tokenRegex.exec(input)) !== null) {
    const text = match[0];
    const charStart = match.index;
    const charEnd = charStart + text.length;

    // Polynomial rolling hash to produce stable deterministic token IDs between 1000 and 9999
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    const id = 1000 + (hash % 9000);

    tokens.push({
      id,
      text,
      position: pos++,
      charStart,
      charEnd,
    });
  }

  return tokens;
}

export interface EmbeddingCoord {
  token: TokenItem;
  x: number; // in [-1.0, 1.0]
  y: number; // in [-1.0, 1.0]
  vector: number[]; // 4D pedagogical latent vector
}

/**
 * Deterministic 2D educational coordinate projection.
 * Projects each token into a bounded 2D educational embedding plane [-1, 1] x [-1, 1].
 */
export function projectEducationalEmbeddings(tokens: TokenItem[]): EmbeddingCoord[] {
  return tokens.map((token, idx) => {
    // Generate deterministic pseudo-semantic coordinate based on character composition and position
    let sumChars = 0;
    let alternating = 0;
    const lower = token.text.toLowerCase();

    for (let i = 0; i < lower.length; i++) {
      const code = lower.charCodeAt(i);
      sumChars += code;
      alternating += (i % 2 === 0 ? 1 : -1) * code;
    }

    // Normalized coordinates with position dispersion to avoid exact collisions
    const angle = (sumChars * 0.17 + idx * 0.45) % (2 * Math.PI);
    const radius = 0.25 + (((Math.abs(alternating) % 100) / 100) * 0.65);

    const x = parseFloat((Math.cos(angle) * radius).toFixed(3));
    const y = parseFloat((Math.sin(angle) * radius).toFixed(3));

    // 4D latent representation for attention dot-products
    const vector = [
      x,
      y,
      parseFloat((Math.sin(sumChars) * 0.8).toFixed(3)),
      parseFloat((Math.cos(alternating) * 0.8).toFixed(3)),
    ];

    return { token, x, y, vector };
  });
}

/**
 * Scaled Dot-Product Self-Attention:
 * Attention(Q, K) = Softmax((Q * K^T) / sqrt(d_k))
 */
export interface AttentionResult {
  matrix: number[][]; // N x N attention weights, where rows sum to 1.0
  queryScores: number[]; // attention from selected query to all keys
}

export function computeScaledDotProductAttention(
  embeddings: EmbeddingCoord[],
  queryIndex: number
): AttentionResult {
  const n = embeddings.length;
  if (n === 0) {
    return { matrix: [], queryScores: [] };
  }

  const d_k = 4;
  const sqrtDk = Math.sqrt(d_k);
  const matrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    const rawScores: number[] = [];
    const qVec = embeddings[i].vector;

    for (let j = 0; j < n; j++) {
      const kVec = embeddings[j].vector;
      // Dot product Q . K
      let dot = 0;
      for (let d = 0; d < d_k; d++) {
        dot += qVec[d] * kVec[d];
      }
      // Distance decay so adjacent tokens retain natural syntactic affinity
      const distancePenalty = Math.abs(i - j) * 0.15;
      rawScores.push((dot / sqrtDk) - distancePenalty);
    }

    // Row-level Softmax
    const maxScore = Math.max(...rawScores);
    const expScores = rawScores.map(s => Math.exp(s - maxScore));
    const sumExp = expScores.reduce((acc, val) => acc + val, 0);
    const normalizedRow = expScores.map(v => parseFloat((v / sumExp).toFixed(4)));

    matrix.push(normalizedRow);
  }

  const validQueryIdx = Math.max(0, Math.min(n - 1, queryIndex));
  const queryScores = matrix[validQueryIdx] || [];

  return { matrix, queryScores };
}

/**
 * 2-Layer Neural Forward Pass:
 * Layer 1 (Hidden):
 *   z1 = w11*x1 + w12*x2 + b1
 *   z2 = w21*x1 + w22*x2 + b2
 *   a1 = max(0, z1) (ReLU)
 *   a2 = max(0, z2) (ReLU)
 *
 * Layer 2 (Output):
 *   z_out = w_out1*a1 + w_out2*a2 + b_out
 *   y = sigmoid(z_out) = 1 / (1 + exp(-z_out))
 */
export interface NeuralNetworkState {
  x1: number;
  x2: number;
  w11: number;
  w12: number;
  w21: number;
  w22: number;
  b1: number;
  b2: number;
  w_out1: number;
  w_out2: number;
  b_out: number;
  z1: number;
  z2: number;
  a1: number;
  a2: number;
  z_out: number;
  y: number;
}

export function computeForwardPass(params: {
  x1: number;
  x2: number;
  w11: number;
  w12: number;
  w21: number;
  w22: number;
  b1: number;
  b2: number;
  w_out1: number;
  w_out2: number;
  b_out: number;
}): NeuralNetworkState {
  const { x1, x2, w11, w12, w21, w22, b1, b2, w_out1, w_out2, b_out } = params;

  // Linear combinations
  const z1 = parseFloat((w11 * x1 + w12 * x2 + b1).toFixed(4));
  const z2 = parseFloat((w21 * x1 + w22 * x2 + b2).toFixed(4));

  // ReLU activations
  const a1 = parseFloat(Math.max(0, z1).toFixed(4));
  const a2 = parseFloat(Math.max(0, z2).toFixed(4));

  // Output linear combination
  const z_out = parseFloat((w_out1 * a1 + w_out2 * a2 + b_out).toFixed(4));

  // Sigmoid activation
  const y = parseFloat((1 / (1 + Math.exp(-z_out))).toFixed(4));

  return {
    ...params,
    z1,
    z2,
    a1,
    a2,
    z_out,
    y,
  };
}

/**
 * 2D Neural Classification Playground Simulation Model
 * Live interactive scatter plot of data points, decision hyperplane,
 * and real-time precision/confidence evaluation.
 */
export interface ClassifierDataPoint {
  id: number;
  x: number; // Feature 1: Keyword Density [0-100]
  y: number; // Feature 2: Urgency Level [0-100]
  label: 'legitimate' | 'malicious';
}

export function generateClassifierDataset(seed = 42): ClassifierDataPoint[] {
  const points: ClassifierDataPoint[] = [];

  // Cluster A: Legitimate emails (Cyan cluster, concentrated in lower-left / mid-left)
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const r = ((Math.sin(seed + i * 3.1) + 1) / 2) * 22;
    const cx = 35 + Math.cos(angle) * r * 1.2 + ((Math.cos(seed + i * 5.7) + 1) / 2) * 10;
    const cy = 40 + Math.sin(angle) * r * 0.9 + ((Math.sin(seed + i * 4.3) + 1) / 2) * 8;
    points.push({
      id: i + 1,
      x: Math.round(Math.min(95, Math.max(8, cx))),
      y: Math.round(Math.min(95, Math.max(8, cy))),
      label: 'legitimate',
    });
  }

  // Cluster B: Malicious / Spam emails (Emerald cluster, concentrated in upper-right / mid-right)
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const r = ((Math.cos(seed + i * 2.9) + 1) / 2) * 22;
    const cx = 72 + Math.cos(angle) * r * 1.2 + ((Math.sin(seed + (i + 20) * 3.3) + 1) / 2) * 8;
    const cy = 68 + Math.sin(angle) * r * 0.9 + ((Math.cos(seed + (i + 20) * 4.1) + 1) / 2) * 10;
    points.push({
      id: i + 33,
      x: Math.round(Math.min(95, Math.max(8, cx))),
      y: Math.round(Math.min(95, Math.max(8, cy))),
      label: 'malicious',
    });
  }

  return points;
}

export interface ClassifierSimulationMetrics {
  precision: number;
  recall: number;
  accuracy: number;
  confidence: number;
  classifiedMaliciousCount: number;
  classifiedLegitimateCount: number;
}

export function evaluateClassifierBoundary(
  points: ClassifierDataPoint[],
  keywordWeight: number, // [0 - 100]
  urgencyWeight: number, // [0 - 100]
  reputationDiscount: number // [0 - 100]
): ClassifierSimulationMetrics {
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;

  // Decision boundary equation: w1 * (x / 100) + w2 * (y / 100) - (threshold - discount) >= 0
  const threshold = 0.55;
  const repEffect = (reputationDiscount / 100) * 0.25;

  for (const p of points) {
    const score = (keywordWeight / 100) * (p.x / 100) * 0.6 +
                  (urgencyWeight / 100) * (p.y / 100) * 0.5 - repEffect;
    const predicted = score >= threshold ? 'malicious' : 'legitimate';

    if (predicted === 'malicious' && p.label === 'malicious') truePositives++;
    else if (predicted === 'malicious' && p.label === 'legitimate') falsePositives++;
    else if (predicted === 'legitimate' && p.label === 'legitimate') trueNegatives++;
    else falseNegatives++;
  }

  const precision = truePositives + falsePositives > 0
    ? Math.round((truePositives / (truePositives + falsePositives)) * 100)
    : 100;
  const recall = truePositives + falseNegatives > 0
    ? Math.round((truePositives / (truePositives + falseNegatives)) * 100)
    : 100;
  const accuracy = points.length > 0
    ? Math.round(((truePositives + trueNegatives) / points.length) * 100)
    : 100;

  // Average confidence score
  const confidence = Math.min(99, Math.max(72, Math.round((precision * 0.55) + (accuracy * 0.45))));

  return {
    precision,
    recall,
    accuracy,
    confidence,
    classifiedMaliciousCount: truePositives + falsePositives,
    classifiedLegitimateCount: trueNegatives + falseNegatives,
  };
}

/**
 * Temperature-Scaled Softmax and Probabilistic Sampling:
 * P(token_i) = exp(z_i / T) / sum_j exp(z_j / T)
 */
export interface CandidateTokenProb {
  token: string;
  logit: number;
  probability: number; // percentage in [0, 100]
  rawProb: number; // in [0, 1]
}

export function computeSoftmaxWithTemperature(
  candidates: { token: string; logit: number }[],
  temperature: number
): CandidateTokenProb[] {
  const safeTemp = Math.max(0.05, Math.min(2.5, temperature));
  const scaledLogits = candidates.map(c => c.logit / safeTemp);
  const maxScaled = Math.max(...scaledLogits);

  const expValues = scaledLogits.map(s => Math.exp(s - maxScaled));
  const sumExp = expValues.reduce((acc, v) => acc + v, 0);

  return candidates.map((c, i) => {
    const rawProb = expValues[i] / sumExp;
    return {
      token: c.token,
      logit: c.logit,
      rawProb: parseFloat(rawProb.toFixed(4)),
      probability: parseFloat((rawProb * 100).toFixed(2)),
    };
  });
}

/**
 * Sample a candidate token based on categorical probability distribution.
 */
export function sampleFromDistribution(
  probs: CandidateTokenProb[],
  seedRandom?: number
): { selectedToken: string; sampledIndex: number; roll: number } {
  if (probs.length === 0) {
    return { selectedToken: '', sampledIndex: -1, roll: 0 };
  }

  const roll = seedRandom !== undefined ? seedRandom : Math.random();
  let cumulative = 0;

  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i].rawProb;
    if (roll <= cumulative || i === probs.length - 1) {
      return {
        selectedToken: probs[i].token,
        sampledIndex: i,
        roll: parseFloat(roll.toFixed(4)),
      };
    }
  }

  return {
    selectedToken: probs[probs.length - 1].token,
    sampledIndex: probs.length - 1,
    roll: parseFloat(roll.toFixed(4)),
  };
}

/**
 * Prompt Security and Instruction Boundary Evaluation.
 * Evaluates whether an untrusted user payload attempts to override system instructions.
 */
export interface PromptDefenseEvaluation {
  isOverridden: boolean;
  detectedThreatPatterns: string[];
  safeOutputText: string;
  defenseStatus: 'BLOCKED' | 'FLAGGED' | 'SANITIZED' | 'SAFE';
  analysisNotes: string[];
}

export function evaluatePromptDefense(
  systemPrompt: string,
  userPrompt: string,
  options: {
    delimiterSandboxEnabled: boolean;
    patternHeuristicsEnabled: boolean;
    semanticPolicyEnforced: boolean;
  }
): PromptDefenseEvaluation {
  const threatPatterns = [
    { pattern: /ignore\s+(all\s+)?(previous|prior)\s+instructions/i, name: 'Direct Instruction Override' },
    { pattern: /system\s*(override|reset|bypass)/i, name: 'System Command Simulation' },
    { pattern: /(reveal|print|disclose|show)\s+(the\s+)?(secret|system\s+prompt|hidden|password|key)/i, name: 'Secret Extraction Probe' },
    { pattern: /(you\s+are\s+now|roleplay\s+as|dan\s+mode|jailbreak)/i, name: 'Persona Entrapment' },
    { pattern: /<\/?user_data>/i, name: 'Delimiter Tag Escape' },
  ];

  const matchedThreats: string[] = [];
  for (const { pattern, name } of threatPatterns) {
    if (pattern.test(userPrompt)) {
      matchedThreats.push(name);
    }
  }

  const analysisNotes: string[] = [];
  let isOverridden = false;
  let defenseStatus: PromptDefenseEvaluation['defenseStatus'] = 'SAFE';

  if (matchedThreats.length > 0) {
    analysisNotes.push(`Suspicious patterns detected: ${matchedThreats.join(', ')}.`);

    if (options.patternHeuristicsEnabled && options.semanticPolicyEnforced) {
      defenseStatus = 'BLOCKED';
      analysisNotes.push('Heuristic filter and policy boundary triggered. Untrusted command rejected.');
    } else if (options.delimiterSandboxEnabled) {
      defenseStatus = 'SANITIZED';
      analysisNotes.push('Input safely encapsulated in <user_data> boundary. Processed as text data rather than instructions.');
    } else if (options.patternHeuristicsEnabled) {
      defenseStatus = 'FLAGGED';
      analysisNotes.push('Pattern flagged, but lack of boundary isolation allows partial prompt confusion.');
      isOverridden = true;
    } else {
      defenseStatus = 'FLAGGED';
      analysisNotes.push('No defensive boundaries active! System instruction was compromised by user input.');
      isOverridden = true;
    }
  } else {
    defenseStatus = 'SAFE';
    analysisNotes.push('No adversarial instruction triggers detected. Query passed within policy boundaries.');
  }

  let safeOutputText = '';
  if (defenseStatus === 'BLOCKED') {
    safeOutputText = '[SECURITY SHIELD]: Prompt rejected. Attempted override of academic policy.';
  } else if (isOverridden) {
    safeOutputText = '[COMPROMISED]: Warning: Model executed user instruction over system prompt.';
  } else {
    safeOutputText = `Academic Tutor Response: I have analyzed your question "${userPrompt.slice(0, 50)}${userPrompt.length > 50 ? '...' : ''}" according to the curriculum guidelines.`;
  }

  return {
    isOverridden,
    detectedThreatPatterns: matchedThreats,
    safeOutputText,
    defenseStatus,
    analysisNotes,
  };
}
