import React, { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const CYBER_GUIDE_SYSTEM = `You are Cyber Guide, a friendly AI assistant for the CyberSphere Junior Lab. Explain cybersecurity concepts to students (ages 10–18) in a simple, clear, and encouraging way. Use analogies relevant to young people. Always be positive and helpful.`;

export const CyberGuideChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsLoading(true);

    // Build a simple context from past messages for prompt
    const context = messages
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'Student' : 'Guide'}: ${m.text}`)
      .join('\n');

    const prompt = `${CYBER_GUIDE_SYSTEM}\n\n${context}\nStudent: ${userText}\nGuide:`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text || 'Got it!' }]);
    } catch {
      // Friendly fallback responses when no API
      const fallbacks = [
        `Great question about "${userText}"! Cybersecurity is all about keeping your digital life safe — like putting a lock on your online door. Want me to explain more?`,
        `Think of hackers like trespassers trying to get into your house. Cybersecurity tools are your digital locks, alarms, and guard dogs! 🛡️`,
        `"${userText}" — that's a smart thing to think about! The key rule in cybersecurity: if something feels wrong online, trust your gut and don't click!`,
        `Your question shows you're already thinking like a cybersecurity expert! The best defence is staying curious and asking questions just like this. 🚀`,
      ];
      const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {isOpen && (
        <div
          style={{
            width: '320px',
            height: '400px',
            backgroundColor: '#0B0C10',
            border: '1.5px solid rgba(6,182,212,0.4)',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.1))',
              borderBottom: '1px solid rgba(6,182,212,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(6,182,212,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              🛡️
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#06B6D4', fontSize: '0.9rem' }}>Cyber Guide</div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Your cybersecurity assistant</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.82rem', marginTop: '24px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👋</div>
                <div>Ask me anything about cybersecurity!</div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    backgroundColor: msg.role === 'user' ? 'rgba(6,182,212,0.25)' : 'rgba(30,41,59,0.9)',
                    color: '#E2E8F0',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    border: msg.role === 'model' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '4px', padding: '8px 12px' }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#06B6D4',
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px', borderTop: '1px solid rgba(6,182,212,0.15)' }}>
            <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Ask a question..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(30,41,59,0.8)',
                  border: '1px solid rgba(6,182,212,0.2)',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  color: '#E2E8F0',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#06B6D4',
                  color: '#000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                ↑
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(6,182,212,0.4)',
          fontSize: '22px',
          transition: 'transform 0.2s ease',
        }}
        title="Open Cyber Guide"
      >
        {isOpen ? '✕' : '🛡️'}
      </button>
    </div>
  );
};