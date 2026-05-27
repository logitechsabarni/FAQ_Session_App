import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Trash2, Minimize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatMessage } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import { TypingIndicator } from './TypingIndicator';
import { supabase } from '../lib/supabase';
import type { FAQ } from '../types/database';

interface YakshaMiniProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

interface Message {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
  relatedFaqs?: { id: string; question: string }[];
}

export function YakshaMini({ isOpen, onClose, onMinimize }: YakshaMiniProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: 'Hello! I am Yaksha Mini, your AI assistant for the FAQ_Session platform. I can help you find answers to your questions about internships, courses, documentation, and more. How can I assist you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchFaqs = async () => {
    try {
      const { data } = await supabase.from('faqs').select('*');
      if (data) setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const findMatchingFaqs = (query: string): { id: string; question: string }[] => {
    const queryLower = query.toLowerCase();
    const matches: { id: string; question: string }[] = [];

    for (const faq of faqs) {
      const questionMatch = faq.question.toLowerCase().includes(queryLower);
      const descMatch = faq.description?.toLowerCase().includes(queryLower);
      const tagMatch = faq.tags?.some(tag => tag.toLowerCase().includes(queryLower));

      if (questionMatch || descMatch || tagMatch) {
        matches.push({ id: faq.id, question: faq.question });
        if (matches.length >= 3) break;
      }
    }

    return matches;
  };

  const generateResponse = (query: string): string => {
    const queryLower = query.toLowerCase();

    // Keyword-based responses
    if (queryLower.includes('noc') || queryLower.includes('no objection')) {
      return 'To submit your NOC (No Objection Certificate), go to Dashboard > Documents > Upload. Required format: PDF, max 2MB. Your NOC must be on institution letterhead with signature from your HOD or Dean.';
    }

    if (queryLower.includes('mentor') || queryLower.includes('assigned')) {
      return 'Mentors are assigned by the end of Week 1 based on your track, timezone, and project domain. You will receive an email introduction with your mentor details and scheduled meeting times.';
    }

    if (queryLower.includes('github') || queryLower.includes('git')) {
      return 'For GitHub setup: 1) Create account with institutional email 2) Enable 2FA 3) Join the organization via invite 4) Set up SSH keys 5) Clone starter repo. Video tutorials are available in Week 1 module.';
    }

    if (queryLower.includes('zoom') || queryLower.includes('session') || queryLower.includes('miss')) {
      return 'All Zoom sessions are recorded. If you miss a session: 1) Watch the recording within 48 hours 2) Complete the session quiz 3) Post questions in the discussion forum. Live participation is encouraged for better engagement.';
    }

    if (queryLower.includes('team') || queryLower.includes('allocation') || queryLower.includes('group')) {
      return 'Teams are formed during Week 2 based on skill assessment, timezone compatibility, and project preferences. Each team has 3-5 members with complementary skills. You can submit preferences during Week 1.';
    }

    if (queryLower.includes('submit') || queryLower.includes('project') || queryLower.includes('upload')) {
      return 'Final project submission requires: GitHub repo with code, README with setup instructions, 5-minute demo video, technical documentation, and deployed link. Submit through Dashboard > Projects > Final Submission.';
    }

    if (queryLower.includes('certificate') || queryLower.includes('completion')) {
      return 'Certificates are issued within 7 business days after all requirements are met: project submission complete, final evaluation passed, exit interview done, and feedback forms submitted.';
    }

    if (queryLower.includes('progress') || queryLower.includes('track')) {
      return 'Progress is tracked through: course completion percentage, assignment scores, project milestones, attendance, and peer reviews. Your dashboard shows real-time progress and weekly reports.';
    }

    if (queryLower.includes('deadline') || queryLower.includes('due')) {
      return 'The final project deadline is the last Friday of the program (check your calendar). Late submissions lose 10% per day, maximum 3 days. Submit extension requests 48 hours before the deadline.';
    }

    if (queryLower.includes('stipend') || queryLower.includes('payment')) {
      return 'Stipends are based on performance tier: Tier 1 ($500/month), Tier 2 ($750/month), Tier 3 ($1000/month). Tier placement is determined during interview and reassessed at mid-point review.';
    }

    // Default response with FAQ suggestions
    return 'I understand you have a question about that. Let me check our FAQ database for relevant information. You can also browse all FAQs or search for specific topics.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const relatedFaqs = findMatchingFaqs(input);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: response,
        isBot: true,
        timestamp: new Date(),
        relatedFaqs: relatedFaqs.length > 0 ? relatedFaqs : undefined,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleFaqClick = (id: string) => {
    window.open(`/faqs/${id}`, '_blank');
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        message: 'Chat cleared. How can I help you today?',
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-4 md:inset-auto md:bottom-24 md:right-6 md:w-[420px] md:h-[600px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Yaksha Mini</h3>
                <p className="text-xs text-slate-400">AI FAQ Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {onMinimize && (
                <button
                  onClick={onMinimize}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 1 && (
              <div className="mt-4">
                <SuggestedQuestions onQuestionClick={handleQuestionClick} />
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
                relatedFaqs={msg.relatedFaqs}
                onFaqClick={handleFaqClick}
              />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about internships, NOC, projects..."
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Yaksha Mini searches our FAQ database to help you
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
