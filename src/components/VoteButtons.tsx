import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface VoteButtonsProps {
  voteableType: 'faq' | 'reply';
  voteableId: string;
  upvotes: number;
  downvotes: number;
  userVote?: { vote_value: number } | null;
  onVoteChange?: (upvotes: number, downvotes: number, userVote: number | null) => void;
  size?: 'sm' | 'md';
}

export function VoteButtons({
  voteableType,
  voteableId,
  upvotes,
  downvotes,
  userVote,
  onVoteChange,
  size = 'md',
}: VoteButtonsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [localUserVote, setLocalUserVote] = useState<number | null>(
    userVote?.vote_value || null
  );

  const handleVote = async (value: 1 | -1) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setLoading(true);

    try {
      // If clicking same vote, remove it
      if (localUserVote === value) {
        const { error } = await supabase
          .from('votes')
          .delete()
          .match({
            user_id: user.id,
            voteable_type: voteableType,
            voteable_id: voteableId,
          });

        if (error) throw error;

        setLocalUserVote(null);
        if (value === 1) setLocalUpvotes(prev => prev - 1);
        else setLocalDownvotes(prev => prev - 1);
        onVoteChange?.(
          value === 1 ? localUpvotes - 1 : localUpvotes,
          value === -1 ? localDownvotes - 1 : localDownvotes,
          null
        );
      } else {
        // If changing vote, delete old one first
        if (localUserVote !== null) {
          await supabase
            .from('votes')
            .delete()
            .match({
              user_id: user.id,
              voteable_type: voteableType,
              voteable_id: voteableId,
            });

          if (localUserVote === 1) setLocalUpvotes(prev => prev - 1);
          else setLocalDownvotes(prev => prev - 1);
        }

        // Insert new vote
        const { error } = await supabase.from('votes').insert({
          user_id: user.id,
          voteable_type: voteableType,
          voteable_id: voteableId,
          vote_value: value,
        });

        if (error) throw error;

        setLocalUserVote(value);
        if (value === 1) setLocalUpvotes(prev => prev + 1);
        else setLocalDownvotes(prev => prev + 1);

        onVoteChange?.(
          value === 1 ? localUpvotes + 1 : localUpvotes - (localUserVote === -1 ? 1 : 0),
          value === -1 ? localDownvotes + 1 : localDownvotes - (localUserVote === 1 ? 1 : 0),
          value
        );

        toast.success(value === 1 ? 'Upvoted!' : 'Downvoted');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === 'sm';
  const btnClass = isSmall ? 'p-1.5' : 'p-2';
  const iconClass = isSmall ? 'w-4 h-4' : 'w-5 h-5';
  const textClass = isSmall ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`flex items-center gap-1 ${btnClass} rounded-lg transition-all ${
          localUserVote === 1
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-slate-800/50 text-slate-400 hover:text-green-400 hover:bg-slate-800 border border-slate-700/50'
        } disabled:opacity-50`}
      >
        <ThumbsUp className={`${iconClass} ${localUserVote === 1 ? 'fill-current' : ''}`} />
        <span className={textClass}>{localUpvotes}</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`flex items-center gap-1 ${btnClass} rounded-lg transition-all ${
          localUserVote === -1
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-slate-800 border border-slate-700/50'
        } disabled:opacity-50`}
      >
        <ThumbsDown className={`${iconClass} ${localUserVote === -1 ? 'fill-current' : ''}`} />
        <span className={textClass}>{localDownvotes}</span>
      </motion.button>
    </div>
  );
}
