import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Calendar, MessageCircle, FileQuestion, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FAQCard } from '../components/FAQCard';
import { ReplyCard } from '../components/ReplyCard';
import type { FAQWithAuthor, ReplyWithAuthor } from '../types/database';
import toast from 'react-hot-toast';

type TabType = 'questions' | 'replies';

export function Profile() {
  const { user, profile, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('questions');
  const [questions, setQuestions] = useState<FAQWithAuthor[]>([]);
  const [replies, setReplies] = useState<ReplyWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      setEditName(profile?.name || '');
    }
  }, [user, profile]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data: userQuestions } = await supabase
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
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      const { data: userReplies } = await supabase
        .from('replies')
        .select(
          `
          *,
          profiles:user_id (
            id,
            name,
            avatar
          ),
          faqs (
            id,
            question
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userQuestions) setQuestions(userQuestions);
      if (userReplies) setReplies(userReplies);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const { error } = await updateProfile({ name: editName });

      if (error) throw error;

      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20" />

          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-slate-900">
                {getUserInitials()}
              </div>

              <div className="flex-1">
                {editing ? (
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xl font-bold focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditName(profile?.name || '');
                      }}
                      className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{profile?.name || 'User'}</h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  {profile?.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pb-4 md:pb-0">
                <div className="text-center px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white">{questions.length}</div>
                  <div className="text-xs text-slate-400">Questions</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white">{replies.length}</div>
                  <div className="text-xs text-slate-400">Replies</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'questions'
                  ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              My Questions
            </button>
            <button
              onClick={() => setActiveTab('replies')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'replies'
                  ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              My Replies
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          </div>
        ) : activeTab === 'questions' ? (
          questions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((q, index) => (
                <FAQCard key={q.id} faq={q} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <FileQuestion className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No questions yet</h3>
              <p className="text-slate-400">You haven't asked any questions</p>
            </div>
          )
        ) : replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply, index) => (
              <div key={reply.id} className="relative">
                {reply.faqs && (
                  <Link
                    to={`/faqs/${reply.faqs.id}`}
                    className="block mb-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Re: {reply.faqs.question}
                  </Link>
                )}
                <ReplyCard reply={reply} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No replies yet</h3>
            <p className="text-slate-400">You haven't replied to any questions</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
