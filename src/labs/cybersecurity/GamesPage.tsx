import React, { useState, useCallback } from 'react';
import { Trophy, Star, RefreshCw, CheckCircle, XCircle, ArrowRight, Shield } from 'lucide-react';

interface GamesPageProps {
  onBack: () => void;
}

// ──────────────────────────────────────────────
// QUIZ DATA
// ──────────────────────────────────────────────
interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Which of the following is the BEST password?',
    options: ['password123', 'Tr0ub4dor&3', 'qwerty', 'myname2010'],
    correct: 1,
    explanation: '"Tr0ub4dor&3" mixes uppercase, lowercase, numbers, and symbols — making it extremely hard to brute-force.',
  },
  {
    id: 2,
    q: 'You receive an email from "your bank" asking you to click a link and enter your PIN. What do you do?',
    options: [
      'Click the link — it looks official',
      'Delete it and call your bank directly using the number on their website',
      'Reply with your PIN so they can verify you',
      'Forward it to friends to warn them',
    ],
    correct: 1,
    explanation: 'Banks NEVER ask for PINs via email. Always call the bank directly using the official number, not one in the email.',
  },
  {
    id: 3,
    q: 'What does HTTPS in a website URL mean?',
    options: [
      'The website is fast',
      'The website is popular',
      'Communication between you and the site is encrypted',
      'The website is free to use',
    ],
    correct: 2,
    explanation: 'HTTPS encrypts the data between your browser and the website so no one can read it in transit — especially important for banking or login pages.',
  },
  {
    id: 4,
    q: 'A friend sends you a link saying "Free Robux, click now!" — what is this most likely?',
    options: ['A gift from Roblox', 'A phishing scam', 'A beta test invite', 'A bug report'],
    correct: 1,
    explanation: 'Offers that seem too good to be true (like free in-game currency) are classic phishing bait to steal your credentials.',
  },
  {
    id: 5,
    q: 'Two-Factor Authentication (2FA) protects you because...',
    options: [
      'It makes your password longer',
      'Even if someone steals your password, they still need a second code',
      'It deletes your account if someone logs in',
      'It encrypts your files',
    ],
    correct: 1,
    explanation: '2FA means a thief needs BOTH your password AND your phone (or authenticator app) to log in — dramatically reducing risk.',
  },
  {
    id: 6,
    q: 'Which is a sign of a FAKE website trying to steal your info?',
    options: [
      'The URL starts with https://',
      'The URL has a padlock icon',
      'The URL is "paypa1.com" (number "1" instead of "l")',
      'The website loads quickly',
    ],
    correct: 2,
    explanation: 'Typosquatting — replacing a letter with a similar-looking character like "1" for "l" — is a common trick to fool users into landing on a fake site.',
  },
  {
    id: 7,
    q: 'What is a VPN primarily used for?',
    options: [
      'Making your internet faster',
      'Watching more YouTube videos',
      'Encrypting your connection so others can\'t snoop on your traffic',
      'Removing viruses from your computer',
    ],
    correct: 2,
    explanation: 'A VPN creates an encrypted tunnel for your internet traffic, hiding it from ISPs, hackers on public Wi-Fi, or government surveillance.',
  },
  {
    id: 8,
    q: 'You download a game from an unofficial site. It asks for admin access to run. You should...',
    options: [
      'Allow it — games need high permissions',
      'Deny it and delete the file — it may be malware',
      'Ignore the warning and play',
      'Send the file to friends',
    ],
    correct: 1,
    explanation: 'Software from unofficial sources asking for admin privileges is a major red flag — it could be a Trojan or ransomware.',
  },
];

// ──────────────────────────────────────────────
// PASSWORD STRENGTH CHECKER
// ──────────────────────────────────────────────
function analyzePassword(pw: string): { score: number; label: string; color: string; tips: string[] } {
  const tips: string[] = [];
  let score = 0;
  if (pw.length >= 8) score += 1; else tips.push('Use at least 8 characters');
  if (pw.length >= 12) score += 1; else if (pw.length >= 8) tips.push('Use 12+ characters for stronger security');
  if (/[A-Z]/.test(pw)) score += 1; else tips.push('Add an UPPERCASE letter');
  if (/[a-z]/.test(pw)) score += 1; else tips.push('Add a lowercase letter');
  if (/[0-9]/.test(pw)) score += 1; else tips.push('Add a number');
  if (/[^A-Za-z0-9]/.test(pw)) score += 1; else tips.push('Add a special character (!, @, #, ...)');
  if (!/(password|123456|qwerty|abcdef|letmein)/i.test(pw)) score += 1;
  else tips.push('Avoid common words like "password" or "qwerty"');

  const labels: [number, string, string][] = [
    [7, 'Very Strong', '#10B981'],
    [5, 'Strong', '#22C55E'],
    [4, 'Moderate', '#F59E0B'],
    [2, 'Weak', '#F97316'],
    [0, 'Very Weak', '#EF4444'],
  ];
  const [, label, color] = labels.find(([min]) => score >= min) ?? [0, 'Very Weak', '#EF4444'];
  return { score, label, color, tips };
}

// ──────────────────────────────────────────────
// SCAM SPOTTER MINI-GAME
// ──────────────────────────────────────────────
interface ScamCard {
  id: number;
  type: 'SAFE' | 'SCAM';
  message: string;
  explanation: string;
}

const SCAM_CARDS: ScamCard[] = [
  { id: 1, type: 'SCAM', message: '🏆 Congratulations! You won ₹50,000. Send us your Aadhaar & bank details to claim your prize!', explanation: 'Classic prize scam — legitimate contests never ask for your ID and bank info upfront.' },
  { id: 2, type: 'SAFE', message: '📧 Hi! Your order #4567 has shipped. Track it at amazon.in/track. Expected delivery: 3 days.', explanation: 'Looks legitimate — it has a specific order number and links to the real domain.' },
  { id: 3, type: 'SCAM', message: '⚠️ URGENT: Your Google Account will be permanently deleted in 24 hours! Click here to verify: google-security-alerts.xyz', explanation: 'The domain "google-security-alerts.xyz" is NOT Google. The urgency is designed to panic you.' },
  { id: 4, type: 'SAFE', message: '🔒 Two-factor authentication code: 492817. This code expires in 5 minutes. Do not share it with anyone.', explanation: 'A standard 2FA code from a service you\'re logging into. Never share it — but receiving it is normal.' },
  { id: 5, type: 'SCAM', message: '💸 Work from home and earn ₹5,000/day! No experience needed. Just pay ₹999 registration fee to start!', explanation: 'Paying a "registration fee" to earn money is a textbook advance-fee fraud.' },
  { id: 6, type: 'SAFE', message: '📱 Your electricity bill of ₹1,243 is due on 25th Oct. Pay at bescom.org or visit your nearest service center.', explanation: 'Real utility bill with a specific amount, due date, and the official domain.' },
  { id: 7, type: 'SCAM', message: '👮 This is the Cyber Crime Police. We have detected illegal activity on your device. Call 9988776655 immediately or face arrest!', explanation: 'Police never threaten you via SMS or calls like this — this is a fear-based scam.' },
  { id: 8, type: 'SAFE', message: '🛒 Your return request #RTN-0023 has been approved. Refund of ₹549 will be credited in 5-7 business days.', explanation: 'Matches a real return flow with a specific reference number and realistic timelines.' },
];

// ──────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────
type GameMode = 'menu' | 'quiz' | 'password' | 'scam';

export const GamesPage: React.FC<GamesPageProps> = ({ onBack }) => {
  const [mode, setMode] = useState<GameMode>('menu');

  return (
    <div style={{ color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
      <button
        onClick={mode === 'menu' ? onBack : () => setMode('menu')}
        style={{
          alignSelf: 'flex-start',
          background: 'rgba(30,41,59,0.8)',
          border: '1px solid rgba(100,116,139,0.3)',
          color: '#94A3B8',
          padding: '6px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.82rem',
          fontWeight: 600,
        }}
      >
        ← {mode === 'menu' ? 'Back to Hub' : 'Back to Games'}
      </button>

      {mode === 'menu' && <GameMenu onSelect={setMode} />}
      {mode === 'quiz' && <QuizGame />}
      {mode === 'password' && <PasswordGame />}
      {mode === 'scam' && <ScamSpotter />}
    </div>
  );
};

// ──────────────────────────────────────────────
// GAME MENU
// ──────────────────────────────────────────────
const GameMenu: React.FC<{ onSelect: (m: GameMode) => void }> = ({ onSelect }) => (
  <>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#A855F7', margin: 0, letterSpacing: '-0.02em' }}>
        Cyber Games
      </h2>
      <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
        Test your cybersecurity knowledge through interactive challenges
      </p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      {[
        { id: 'quiz' as GameMode, icon: '🧠', title: 'Security Quiz', desc: '8 questions testing your cyber knowledge. Score 6/8 to earn the badge.', color: '#A855F7' },
        { id: 'password' as GameMode, icon: '🔐', title: 'Password Lab', desc: 'Test and improve real passwords. Learn what makes a password strong or weak.', color: '#06B6D4' },
        { id: 'scam' as GameMode, icon: '🎭', title: 'Scam Spotter', desc: 'Can you tell real messages from scams? Swipe left or right to judge each message.', color: '#F59E0B' },
      ].map(game => (
        <button
          key={game.id}
          onClick={() => onSelect(game.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '20px',
            borderRadius: '16px',
            border: `1px solid ${game.color}30`,
            backgroundColor: `${game.color}0D`,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
            color: '#E2E8F0',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>{game.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: game.color }}>{game.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.5 }}>{game.desc}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: game.color, fontWeight: 700, fontSize: '0.8rem' }}>
            Play Now <ArrowRight size={14} />
          </div>
        </button>
      ))}
    </div>
  </>
);

// ──────────────────────────────────────────────
// QUIZ GAME
// ──────────────────────────────────────────────
const QuizGame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[index];

  const choose = useCallback((i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  }, [selected, q.correct]);

  const next = () => {
    if (index < QUIZ_QUESTIONS.length - 1) {
      setIndex(i => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => { setIndex(0); setSelected(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const badge = score >= 6 ? '🏆 Cyber Expert' : score >= 4 ? '🛡 Security Aware' : '📚 Keep Learning';
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
        <div style={{ fontSize: '4rem' }}>{score >= 6 ? '🏆' : score >= 4 ? '🛡' : '📚'}</div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>{badge}</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444', marginTop: '8px' }}>
            {score}/{QUIZ_QUESTIONS.length}
          </div>
          <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{pct}% — {score >= 6 ? 'Excellent!' : score >= 4 ? 'Good effort!' : 'Review the cybersecurity modules and try again.'}</div>
        </div>
        <button
          onClick={restart}
          style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#A855F7', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, color: '#A855F7', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🧠 Security Quiz
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {QUIZ_QUESTIONS.map((_, i) => (
              <div key={i} style={{ width: '20px', height: '4px', borderRadius: '2px', backgroundColor: i < index ? '#10B981' : i === index ? '#A855F7' : 'rgba(100,116,139,0.3)' }} />
            ))}
          </div>
          <span style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>{index + 1}/{QUIZ_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.5, color: '#F8FAFC' }}>{q.q}</div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correct;
          const revealed = selected !== null;

          let bg = 'rgba(15,23,42,0.5)';
          let border = 'rgba(100,116,139,0.2)';
          let textColor = '#CBD5E1';

          if (revealed) {
            if (isCorrect) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.45)'; textColor = '#6EE7B7'; }
            else if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; border = 'rgba(239,68,68,0.45)'; textColor = '#FCA5A5'; }
          } else if (isSelected) {
            bg = 'rgba(168,85,247,0.15)';
            border = 'rgba(168,85,247,0.5)';
            textColor = '#C4B5FD';
          }

          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={revealed}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '11px',
                border: `1px solid ${border}`,
                backgroundColor: bg,
                color: textColor,
                textAlign: 'left',
                cursor: revealed ? 'default' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 800,
                backgroundColor: revealed && isCorrect ? '#10B981' : revealed && isSelected ? '#EF4444' : 'rgba(100,116,139,0.2)',
                color: revealed ? '#fff' : '#94A3B8',
              }}>
                {revealed && isCorrect ? '✓' : revealed && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
              </div>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {selected !== null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.2)', fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
            💡 {q.explanation}
          </div>
          <button
            onClick={next}
            style={{ alignSelf: 'flex-end', padding: '10px 20px', borderRadius: '9px', border: 'none', backgroundColor: '#A855F7', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {index < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// PASSWORD LAB
// ──────────────────────────────────────────────
const PasswordGame: React.FC = () => {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const analysis = pw.length > 0 ? analyzePassword(pw) : null;

  const examples = [
    { label: 'Very Weak', value: 'password' },
    { label: 'Weak', value: 'MyDog2010' },
    { label: 'Moderate', value: 'School@2024' },
    { label: 'Strong', value: 'Tr0ub4dor&3' },
    { label: 'Very Strong', value: 'G7#kL!mXq@9pW' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#06B6D4', margin: 0 }}>🔐 Password Strength Lab</h3>
        <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '4px' }}>Type any password to analyze its strength in real time</p>
      </div>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          placeholder="Type a password to test..."
          value={pw}
          onChange={e => setPw(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 50px 14px 16px',
            borderRadius: '11px',
            border: `2px solid ${analysis ? analysis.color : 'rgba(100,116,139,0.3)'}`,
            backgroundColor: 'rgba(15,23,42,0.7)',
            color: '#E2E8F0',
            fontSize: '1rem',
            fontFamily: 'monospace',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.1rem' }}
        >
          {show ? '🙈' : '👁'}
        </button>
      </div>

      {/* Strength meter */}
      {analysis && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Strength</span>
              <span style={{ fontWeight: 800, color: analysis.color, fontSize: '0.9rem' }}>{analysis.label}</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(100,116,139,0.2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(analysis.score / 7) * 100}%`, backgroundColor: analysis.color, borderRadius: '4px', transition: 'all 0.3s ease' }} />
            </div>
          </div>

          {/* Criteria checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: '8+ characters', pass: pw.length >= 8 },
              { label: '12+ characters', pass: pw.length >= 12 },
              { label: 'Uppercase letter', pass: /[A-Z]/.test(pw) },
              { label: 'Lowercase letter', pass: /[a-z]/.test(pw) },
              { label: 'Number', pass: /[0-9]/.test(pw) },
              { label: 'Special character', pass: /[^A-Za-z0-9]/.test(pw) },
              { label: 'Not a common word', pass: !/(password|123456|qwerty|abcdef|letmein)/i.test(pw) },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: c.pass ? '#10B981' : '#475569' }}>
                {c.pass ? <CheckCircle size={14} color="#10B981" /> : <XCircle size={14} color="#475569" />}
                {c.label}
              </div>
            ))}
          </div>

          {/* Time to crack estimate */}
          <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(100,116,139,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Estimated crack time:</span>
            <span style={{ fontWeight: 800, color: analysis.color, fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {analysis.score <= 1 ? 'Instant' : analysis.score === 2 ? 'Seconds' : analysis.score === 3 ? 'Minutes' : analysis.score === 4 ? 'Hours' : analysis.score === 5 ? 'Years' : analysis.score === 6 ? 'Centuries' : 'Millions of years'}
            </span>
          </div>
        </>
      )}

      {/* Example passwords */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          Try these examples:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {examples.map(ex => (
            <button
              key={ex.value}
              onClick={() => setPw(ex.value)}
              style={{
                padding: '5px 12px',
                borderRadius: '7px',
                border: '1px solid rgba(100,116,139,0.25)',
                backgroundColor: 'rgba(15,23,42,0.5)',
                color: '#94A3B8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// SCAM SPOTTER
// ──────────────────────────────────────────────
const ScamSpotter: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<'SAFE' | 'SCAM' | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const card = SCAM_CARDS[index];

  const judge = (verdict: 'SAFE' | 'SCAM') => {
    if (answered) return;
    setAnswered(verdict);
    if (verdict === card.type) setScore(s => s + 1);
  };

  const next = () => {
    if (index < SCAM_CARDS.length - 1) {
      setIndex(i => i + 1);
      setAnswered(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => { setIndex(0); setAnswered(null); setScore(0); setDone(false); };

  const correct = answered === card.type;

  if (done) {
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
        <div style={{ fontSize: '4rem' }}>{score >= 7 ? '🏆' : score >= 5 ? '🎭' : '📖'}</div>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
            {score >= 7 ? 'Scam Detective!' : score >= 5 ? 'Pretty Good!' : 'Stay Alert!'}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B', marginTop: '6px' }}>
            {score}/{SCAM_CARDS.length}
          </div>
          <div style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '6px' }}>messages correctly identified</div>
        </div>
        <button
          onClick={restart}
          style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#F59E0B', color: '#000', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎭 Scam Spotter</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {SCAM_CARDS.map((_, i) => <div key={i} style={{ width: '18px', height: '4px', borderRadius: '2px', backgroundColor: i < index ? '#F59E0B' : i === index ? '#FBBF24' : 'rgba(100,116,139,0.3)' }} />)}
        </div>
      </div>

      <div style={{ padding: '4px 0' }}>
        <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '10px' }}>Is this message SAFE or a SCAM?</div>
        <div style={{
          padding: '18px',
          borderRadius: '14px',
          backgroundColor: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(100,116,139,0.25)',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: '#E2E8F0',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '90px',
        }}>
          {card.message}
        </div>
      </div>

      {!answered && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => judge('SAFE')}
            style={{ padding: '16px', borderRadius: '12px', border: '2px solid rgba(16,185,129,0.4)', backgroundColor: 'rgba(16,185,129,0.1)', color: '#6EE7B7', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            ✅ SAFE
          </button>
          <button
            onClick={() => judge('SCAM')}
            style={{ padding: '16px', borderRadius: '12px', border: '2px solid rgba(239,68,68,0.4)', backgroundColor: 'rgba(239,68,68,0.1)', color: '#FCA5A5', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            🚨 SCAM
          </button>
        </div>
      )}

      {answered && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${correct ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            {correct ? <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '1px' }} /> : <XCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />}
            <div>
              <div style={{ fontWeight: 700, color: correct ? '#6EE7B7' : '#FCA5A5', marginBottom: '4px' }}>
                {correct ? `Correct! This was a ${card.type}.` : `Wrong — this was actually a ${card.type}.`}
              </div>
              <div style={{ fontSize: '0.83rem', color: '#94A3B8', lineHeight: 1.5 }}>💡 {card.explanation}</div>
            </div>
          </div>
          <button
            onClick={next}
            style={{ alignSelf: 'flex-end', padding: '10px 20px', borderRadius: '9px', border: 'none', backgroundColor: '#F59E0B', color: '#000', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {index < SCAM_CARDS.length - 1 ? 'Next Message' : 'See Results'} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
