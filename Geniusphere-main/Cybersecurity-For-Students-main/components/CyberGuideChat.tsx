
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export const CyberGuideChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = () => {
    if (!process.env.API_KEY) {
      console.error("API_KEY is not set.");
      setMessages([{ role: 'model', text: "I can't connect right now. Please check the setup." }]);
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Cyber Guide, a friendly and knowledgeable AI assistant for the CyberSphere Junior Lab. Your role is to explain cybersecurity concepts to students (ages 10-18) in a simple, clear, and encouraging way. Do not provide dangerous or unethical information. Keep your answers concise and easy to understand. Use analogies and examples relevant to a young audience. Always be positive and helpful.",
      },
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!chatRef.current) {
      initializeChat();
    }

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
        const responseStream = await chatRef.current!.sendMessageStream({ message: inputValue });
        
        let currentModelMessage = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of responseStream) {
            currentModelMessage += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: currentModelMessage };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I ran into a problem. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-80 h-96 bg-[#0B0C10] border-2 border-cyan-500/50 rounded-lg shadow-2xl flex flex-col mb-2">
          <div className="p-3 bg-slate-800/80 rounded-t-lg">
            <h3 className="font-bold text-cyan-400">Cyber Guide</h3>
            <p className="text-xs text-slate-400">Your AI assistant for cybersecurity questions.</p>
          </div>
          <div className="flex-grow p-3 overflow-y-auto text-sm text-slate-300 space-y-4">
            {messages.length === 0 && <p className="text-slate-400">Ask me anything about cybersecurity!</p>}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-cyan-800' : 'bg-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-lg bg-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t border-cyan-500/30">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <input 
                type="text" 
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(prev => !prev)}
        className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-cyan-500 transition-colors"
        aria-label="Toggle Cyber Guide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
};