import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Eye, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { FAQWithAuthor } from '../types/database';
import { getCategoryColor, getCategoryLabel } from '../utils/constants';

interface FAQAccordionProps {
  faq: FAQWithAuthor;
  index?: number;
}

export function FAQAccordion({ faq, index = 0 }: FAQAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getUserInitials = () => {
    if (faq.profiles?.name) {
      return faq.profiles.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  const timeAgo = formatDistanceToNow(new Date(faq.created_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left flex items-start justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(
                  faq.category
                )} bg-opacity-20 text-white`}
              >
                {getCategoryLabel(faq.category)}
              </span>
              {faq.is_resolved && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Resolved
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>

            <div className="flex items-center gap-4 mt-3 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {getUserInitials()}
                </div>
                <span className="text-sm">{faq.profiles?.name || 'Anonymous'}</span>
              </div>
              <span className="text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{faq.view_count}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{faq.replies?.length || 0}</span>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-slate-700/50">
                <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {faq.description || 'No additional details provided.'}
                  </p>
                </div>

                {faq.tags && faq.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {faq.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-slate-700/50 text-cyan-400 border border-slate-600/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={`/faqs/${faq.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  View Discussion
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50" />
      </div>
    </motion.div>
  );
}
