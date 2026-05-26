import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FAQAccordion } from '../components/FAQAccordion';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import type { FAQWithAuthor } from '../types/database';

export function FAQPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [faqs, setFaqs] = useState<FAQWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    fetchFaqs();
  }, [search, category, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'all') params.set('category', category);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [search, category, sortBy, setSearchParams]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      let query = supabase
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
        );

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`question.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'trending') {
        query = query.order('view_count', { ascending: false });
      } else if (sortBy === 'replies') {
      }

      const { data, error } = await query;

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Browse FAQs</h1>
            <p className="text-slate-400">Find answers to your questions</p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search questions..."
            className="flex-1"
          />

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="newest">Newest First</option>
              <option value="trending">Most Viewed</option>
              <option value="replies">Most Discussed</option>
            </select>
          </div>
        </div>

        <CategoryFilter selected={category} onChange={handleCategoryChange} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-400">
          {loading ? 'Loading...' : `${faqs.length} question${faqs.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading FAQs...</p>
          </div>
        </div>
      ) : faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQAccordion key={faq.id} faq={faq} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No questions found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}
