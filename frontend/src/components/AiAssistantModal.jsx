import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, MessageSquare, HelpCircle, FileText, Check } from 'lucide-react';
import { api } from '../services/api';

export default function AiAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am the KRPS AI School Assistant. How can I help you today? You can ask about school attendance rules, fee deadlines, CBSE syllabus, examination schedules, bus routes, or draft notices.",
      suggestions: ['What are the fee payment due dates?', 'What is the minimum attendance required?', 'Exam grading scale rules', 'Bus route for Whitefield']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: q }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await api.aiChat(q);
      setMessages([...newMsgs, {
        sender: 'ai',
        text: res.reply,
        suggestions: res.suggestions || []
      }]);
    } catch (err) {
      setMessages([...newMsgs, {
        sender: 'ai',
        text: "I'm having a brief issue connecting to the AI policy service. Please try again or check the respective portal tab."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-end p-4 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-md h-[550px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-wide">Campus AI Assistant</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-blue-200">Grounded in KRPS School Policies & Data</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs custom-scrollbar">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm whitespace-pre-line'
              }`}>
                {m.text}
              </div>

              {/* Suggestions chips */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                  {m.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(sug)}
                      className="bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-blue-200 px-2 py-1 rounded-full text-[10px] font-medium transition-colors text-left"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
              <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
              <span>Analysing school policies...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about school guidelines..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[9px] text-slate-400 text-center mt-1.5">
            AI Assistant provides institutional guidance based on approved school policy.
          </p>
        </div>
      </div>
    </div>
  );
}
