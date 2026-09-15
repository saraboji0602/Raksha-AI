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
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  UserCheck
} from 'lucide-react';

export const AIChatDrawer: React.FC = () => {
  const { 
    isAIChatOpen, 
    setIsAIChatOpen, 
    chatMessages, 
    sendUserChatMessage,
    activeViewMode,
    setCurrentPage,
    t 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const officerPrompts = [
    'Which habitation needs action first?',
    'Why is Kadalpuram high risk?',
    'Why is Site B recommended?',
    'What did field officers verify?',
    'What is the 10-year cost of inaction?',
    'What long-term prevention is needed?'
  ];

  const citizenPrompts = [
    'What is my current risk?',
    'Why is my area red?',
    'Where is the nearest safe shelter?',
    'Which evacuation route should I take?',
    'Why did my route change to Route B?',
    'What immediate actions should I take?'
  ];

  const quickPrompts = activeViewMode === 'CITIZEN' ? citizenPrompts : officerPrompts;

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
      className={`fixed bottom-4 right-4 z-50 bg-slate-900 border border-cyan-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-slideUp ${
        isExpanded ? 'w-[92vw] md:w-[700px] h-[85vh]' : 'w-[92vw] sm:w-[440px] h-[580px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">RAKSHA Context AI Assistant</span>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-700/60 uppercase">
                {activeViewMode} MODE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Explainable Disaster Decision Intelligence</p>
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
      <div className="p-2 bg-slate-950/90 border-b border-slate-800 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase whitespace-nowrap pl-1">
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

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed animate-in fade-in duration-150 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                  isUser
                    ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-sm shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-xl'
                }`}
              >
                {/* Text with markdown lines */}
                <div className="whitespace-pre-line text-xs">
                  {msg.text}
                </div>

                {/* 4-Dimensional AI Transparency Block */}
                {!isUser && msg.metadata && (
                  <div className="pt-2.5 border-t border-slate-800/80 space-y-2 text-[11px]">
                    
                    {/* Why Evidence */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                      <strong className="text-cyan-400 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> WHY? (Physical Evidence):
                      </strong>
                      <span>{msg.metadata.whyExplanation}</span>
                    </div>

                    {/* Metadata Chips Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-[10px] font-mono">
                        <span>Confidence:</span>
                        <strong>{msg.metadata.confidenceScore}% (Calibrated)</strong>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[10px] truncate">
                        <span className="text-slate-400">Source: </span>
                        <span>{msg.metadata.dataSourceProvenance}</span>
                      </div>
                    </div>

                    {/* Human Authority Status */}
                    <div className="p-1.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-indigo-400" /> Authority Review:
                      </span>
                      <strong className="truncate max-w-[180px]">{msg.metadata.humanReviewStatus}</strong>
                    </div>

                    {msg.metadata.suggestedAction && (
                      <div className="text-[10px] text-amber-300 flex items-center gap-1 mt-1 font-semibold">
                        <ArrowRight className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span>Action: {msg.metadata.suggestedAction}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[9px] font-mono ${isUser ? 'text-cyan-950/70' : 'text-slate-500'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={activeViewMode === 'CITIZEN' ? "Ask about your risk, shelters, or routes..." : "Ask RAKSHA AI about habitations, site suitability, data conflicts..."}
          className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all active:scale-95 flex-shrink-0 font-bold"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
