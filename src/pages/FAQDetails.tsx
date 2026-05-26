import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ReplyCard } from '../components/ReplyCard';
import { getCategoryColor, getCategoryLabel } from '../utils/constants';
import type { FAQWithAuthor, ReplyWithAuthor } from '../types/database';
import toast from 'react-hot-toast';

export function FAQDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [faq, setFaq] = useState<FAQWithAuthor | null>(null);
  const [replies, setReplies] = useState<ReplyWithAuthor[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFAQ();
      fetchReplies();
      incrementViewCount();
    }
  }, [id]);

  const fetchFAQ = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select(
          `
          *,
          profiles:created_by (
            id,
            name,
            avatar
          )
        `
        )
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setFaq(data);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('replies')
        .select(
          `
          *,
          profiles:user_id (
            id,
            name,
            avatar
          )
        `
        )
        .eq('faq_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const incrementViewCount = async () => {
    if (!id) return;
    try {
      await supabase.rpc('increment_view_count', { faq_id: id } as any);
    } catch (error) {
      // Silently fail - view count isn't critical
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !id) {
      toast.error('Please sign in to reply');
      return;
    }

    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('replies').insert({
        faq_id: id,
        user_id: user.id,
        message: replyText.trim(),
      } as any);

      if (error) throw error;

      setReplyText('');
      toast.success('Reply posted!');
      fetchReplies();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsAnswer = async (replyId: string) => {
    if (!id) return;
    try {
      const { error: replyError } = await supabase
        .from('replies')
        .update({ is_answer: true })
        .eq('id', replyId);

      if (replyError) throw replyError;

      const { error: faqError } = await supabase
        .from('faqs')
        .update({ is_resolved: true })
        .eq('id', id);

      if (faqError) throw faqError;

      toast.success('Marked as answer!');
      fetchFAQ();
      fetchReplies();
    } catch (error) {
      toast.error('Failed to mark as answer');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await supabase.from('replies').delete().eq('id', replyId);
      toast.success('Reply deleted');
      fetchReplies();
    } catch (error) {
      toast.error('Failed to delete reply');
    }
  };

  const getUserInitials = () => {
    if (faq?.profiles?.name) {
      return faq.profiles.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4" />
          <p className="text-slate-400">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Question not found</h2>
        <p className="text-slate-400 mb-6">This question doesn't exist or has been removed.</p>
        <Link
          to="/faqs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-white font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse FAQs
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(faq.created_at), { addSuffix: true });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/faqs"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FAQs
        </Link>

        <div className="relative p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(
                  faq.category
                )} text-white`}
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

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{faq.question}</h1>

            {faq.description && (
              <div className="bg-slate-900/50 rounded-xl p-5 mb-6">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {faq.description}
                </p>
              </div>
            )}

            {faq.tags && faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {faq.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm rounded-full bg-slate-700/50 text-cyan-400 border border-slate-600/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {faq.profiles?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{faq.view_count + 1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{replies.length}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {replies.length > 0 ? (
            <div className="space-y-4 mb-6">
              {replies.map((reply, index) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  index={index}
                  onMarkAsAnswer={
                    user?.id === faq.created_by && !reply.is_answer
                      ? () => handleMarkAsAnswer(reply.id)
                      : undefined
                  }
                  onDelete={
                    user?.id === reply.user_id
                      ? () => handleDeleteReply(reply.id)
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/50 mb-6">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No replies yet. Be the first to answer!</p>
            </div>
          )}

          {user ? (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmitReply}
              className="relative"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your answer..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting || !replyText.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>
          ) : (
            <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-400">
                Please{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  sign in
                </Link>{' '}
                to post a reply
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
