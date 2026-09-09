import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  MessageSquareCode, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  Maximize2, 
  Minimize2,
  Trash2
} from 'lucide-react';

export const AIChatDrawer: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, chatMessages, sendUserChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Why is Kadalpuram high risk?',
    'Why is Site B preferred over Site A?',
    'Which settlements need immediate relocation?',
    'What happens if we adapt instead?',
    'What is the cost of inaction?',
    'Explain Malaiyur landslide risk'
  ];

  useEffect(() => {
    if (isAIChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAIChatOpen]);

  if (!isAIChatOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputText.trim() === '') return;
    sendUserChatMessage(inputText);
    setInputText('');
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-slideUp ${
        isExpanded ? 'w-[90vw] md:w-[650px] h-[80vh]' : 'w-[90vw] sm:w-[400px] h-[520px]'
      }`}
    >
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25">
            <Bot className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">RAKSHA Assistant</span>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-700/60 uppercase">
                AI ENGINE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Disaster Decision Intelligence & Explainability</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Restore size' : 'Expand window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsAIChatOpen(false)}
            className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[10px] text-slate-500 font-semibold uppercase whitespace-nowrap pl-1">
          SUGGESTIONS:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendUserChatMessage(prompt)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/50 text-[11px] whitespace-nowrap transition-colors flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-950/50 text-xs">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-cyan-600 text-slate-950'
                    : 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-3 rounded-xl border leading-relaxed ${
                  isUser
                    ? 'bg-cyan-950/80 text-cyan-100 border-cyan-700/50 rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`mt-1 text-[9px] font-mono ${
                    isUser ? 'text-cyan-300/70 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask RAKSHA Assistant about settlements, risk, or sites..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={inputText.trim() === ''}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
