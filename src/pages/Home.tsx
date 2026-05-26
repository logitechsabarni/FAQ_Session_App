import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { HeroSection } from '../components/HeroSection';
import { FAQCard } from '../components/FAQCard';
import type { FAQWithAuthor } from '../types/database';

export function Home() {
  const [trendingFaqs, setTrendingFaqs] = useState<FAQWithAuthor[]>([]);
  const [latestFaqs, setLatestFaqs] = useState<FAQWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data: trending } = await supabase
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
        .order('view_count', { ascending: false })
        .limit(3);

      const { data: latest } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(6);

      if (trending) setTrendingFaqs(trending);
      if (latest) setLatestFaqs(latest);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {trendingFaqs.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Trending Questions</h2>
              </div>
              <Link
                to="/faqs?sort=trending"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingFaqs.map((faq, index) => (
                <FAQCard key={faq.id} faq={faq} index={index} />
              ))}
            </div>
          </section>
        )}

        {latestFaqs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Latest Questions</h2>
              </div>
              <Link
                to="/faqs"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestFaqs.map((faq, index) => (
                <FAQCard key={faq.id} faq={faq} index={index} />
              ))}
            </div>
          </section>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4" />
              <p className="text-slate-400">Loading FAQs...</p>
            </div>
          </div>
        )}

        {!loading && latestFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No FAQs yet</h3>
            <p className="text-slate-400 mb-6">Be the first to ask a question!</p>
            <Link
              to="/add-faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium"
            >
              Ask a Question
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
