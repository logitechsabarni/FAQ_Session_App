import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { FAQWithAuthor } from '../types/database';
import { getCategoryColor, getCategoryLabel } from '../utils/constants';

interface FAQCardProps {
  faq: FAQWithAuthor;
  index?: number;
}

export function FAQCard({ faq, index = 0 }: FAQCardProps) {
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
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link to={`/faqs/${faq.id}`}>
        <div className="relative p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
              faq.category
            )} opacity-0 group-hover:opacity-5 transition-opacity`}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
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
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {faq.question}
                </h3>
              </div>
            </div>

            {faq.description && (
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{faq.description}</p>
            )}

            {faq.tags && faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {faq.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-slate-700/50 text-cyan-400 border border-slate-600/50"
                  >
                    #{tag}
                  </span>
                ))}
                {faq.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-400 border border-slate-600/50">
                    +{faq.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {faq.profiles?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
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
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </div>
      </Link>
    </motion.div>
  );
}
