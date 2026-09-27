import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, RotateCcw, Sparkles, CheckCheck, User } from 'lucide-react';

interface TestMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AITestPlayground: React.FC = () => {
  const { aiConfig, testAIPrompt } = useApp();
  const [testInput, setTestInput] = useState('Do you have a beige L sofa?');
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<TestMessage[]>([
    {
      id: 'test-1',
      sender: 'user',
      text: 'Do you have a beige L sofa?',
      timestamp: '10:41 AM',
    },
    {
      id: 'test-2',
      sender: 'ai',
      text: 'Yes, we currently have a beige Modern L Sofa available. Would you like to know the price and dimensions?',
      timestamp: '10:41 AM',
    },
  ]);

  const handleSendTestMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testInput.trim() || isThinking) return;

    const userText = testInput;
    setTestInput('');

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: TestMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: nowStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const reply = await testAIPrompt(userText);
      const aiMsg: TestMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // fallback
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'test-init',
        sender: 'ai',
        text: `Hello! I am ${aiConfig?.agentName || 'WhatsAI Assistant'}. Ask me about our catalog, delivery options, or showroom hours!`,
        timestamp: 'Just now',
      },
    ]);
  };

  const suggestedPrompts = [
    'Do you have a beige L sofa?',
    'What is the delivery time?',
    'Can you tell me about the Luxury Bedroom Set?',
    'I want to speak with someone.',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[560px]">
      {/* Playground Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Live AI Simulation Playground
          </h3>
        </div>
        <button
          onClick={handleResetChat}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-semibold transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50/40 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
          Try:
        </span>
        {suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => setTestInput(p)}
            className="text-[11px] font-medium text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]/30">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-xs relative text-xs sm:text-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 mb-1">
                    <Bot className="w-3 h-3" />
                    <span>{aiConfig?.agentName || 'WhatsAI Assistant'}</span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isUser ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-white rounded-xl border border-slate-200 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI generating response with verified catalog knowledge...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleSendTestMessage} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a test customer message..."
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden transition-all"
          />
          <button
            type="submit"
            disabled={!testInput.trim() || isThinking}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
