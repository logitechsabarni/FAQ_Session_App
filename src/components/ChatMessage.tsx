import { motion } from 'framer-motion';
import { Bot, User, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
  relatedFaqs?: { id: string; question: string }[];
  onFaqClick?: (id: string) => void;
}

export function ChatMessage({ message, isBot, timestamp, relatedFaqs, onFaqClick }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`p-4 rounded-2xl ${
            isBot
              ? 'bg-slate-800/80 border border-slate-700/50 text-slate-200'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>

        {isBot && relatedFaqs && relatedFaqs.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Related FAQs
            </p>
            {relatedFaqs.map((faq) => (
              <motion.button
                key={faq.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFaqClick?.(faq.id)}
                className="block w-full text-left p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 text-cyan-400 text-sm transition-colors"
              >
                {faq.question}
              </motion.button>
            ))}
          </div>
        )}

        <p className={`text-xs text-slate-500 mt-1 ${isBot ? '' : 'text-right'}`}>
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </motion.div>
  );
}
