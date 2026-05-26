import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ReplyWithAuthor } from '../types/database';
import { useAuth } from '../context/AuthContext';

interface ReplyCardProps {
  reply: ReplyWithAuthor;
  index?: number;
  onMarkAsAnswer?: () => void;
  onDelete?: () => void;
}

export function ReplyCard({ reply, index = 0, onMarkAsAnswer, onDelete }: ReplyCardProps) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const getUserInitials = () => {
    if (reply.profiles?.name) {
      return reply.profiles.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  const timeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
  const isOwner = user?.id === reply.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group ${
        reply.is_answer ? 'border-l-4 border-l-green-500' : ''
      }`}
    >
      <div
        className={`relative p-5 bg-slate-800/50 border border-slate-700/50 rounded-r-2xl ${
          reply.is_answer ? 'bg-green-500/5' : ''
        }`}
      >
        {reply.is_answer && (
          <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Accepted Answer
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {getUserInitials()}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div>
                <p className="font-semibold text-white">{reply.profiles?.name || 'Anonymous'}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!reply.is_answer && onMarkAsAnswer && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMarkAsAnswer}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                  >
                    Mark as Answer
                  </motion.button>
                )}

                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-full mt-2 py-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10"
                      >
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            onDelete?.();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{reply.message}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
