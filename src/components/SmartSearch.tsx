import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { FAQ, SearchResult } from '../types/database';
import { Link } from 'react-router-dom';

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  onDuplicateDetected?: (duplicates: { id: string; question: string; similarity: number }[]) => void;
  placeholder?: string;
}

export function SmartSearch({ onSearch, onDuplicateDetected, placeholder = 'Search FAQs...' }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [duplicates, setDuplicates] = useState<{ id: string; question: string; similarity: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        performSearch(query);
      } else {
        setResults([]);
        setDuplicates([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // Search FAQs with text matching
      const { data: faqs, error } = await supabase
        .from('faqs')
        .select('*')
        .or(`question.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
        .limit(10);

      if (error) throw error;

      // Calculate relevance score
      const searchResults: SearchResult[] = (faqs || []).map(faq => {
        let score = 0;
        const queryLower = searchQuery.toLowerCase();

        // Exact title match
        if (faq.question.toLowerCase().includes(queryLower)) {
          score += 50;
        }
        // Description match
        if (faq.description?.toLowerCase().includes(queryLower)) {
          score += 30;
        }
        // Tag match
        if (faq.tags?.some(tag => tag.toLowerCase().includes(queryLower))) {
          score += 20;
        }
        // Partial word matches
        const words = searchQuery.split(' ');
        words.forEach(word => {
          if (faq.question.toLowerCase().includes(word)) score += 10;
        });

        return { faq, score };
      });

      // Sort by score
      searchResults.sort((a, b) => b.score - a.score);
      setResults(searchResults);
      setShowResults(true);
      onSearch?.(searchQuery);

      // Check for duplicates (only if query is long enough)
      if (searchQuery.length >= 10) {
        const { data: dupData } = await supabase.rpc('detect_duplicate_faq', {
          new_question: searchQuery,
          new_description: searchQuery,
        });
        if (dupData && dupData.length > 0) {
          setDuplicates(dupData);
          onDuplicateDetected?.(dupData);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setDuplicates([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      {/* Duplicate Warning */}
      <AnimatePresence>
        {duplicates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium text-sm">Similar questions found</p>
                <p className="text-amber-300/80 text-xs mt-1">
                  Your search may have already been answered. Check these FAQs:
                </p>
                <div className="mt-2 space-y-1">
                  {duplicates.slice(0, 3).map((dup) => (
                    <Link
                      key={dup.id}
                      to={`/faqs/${dup.id}`}
                      className="block p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                    >
                      <p className="text-amber-200 text-sm">{dup.question}</p>
                      <p className="text-amber-400/60 text-xs">
                        {Math.round(dup.similarity * 100)}% similar
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 z-50"
          >
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">AI-powered search results</span>
              </div>
              {results.map((result, index) => (
                <Link
                  key={result.faq.id}
                  to={`/faqs/${result.faq.id}`}
                  onClick={() => setShowResults(false)}
                  className="block p-3 my-1 rounded-xl hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {result.faq.question}
                      </p>
                      {result.faq.description && (
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                          {result.faq.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-700/50 text-slate-400">
                          {result.faq.category}
                        </span>
                        <span className="text-xs text-cyan-400 font-medium">
                          {result.score}% match
                        </span>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {showResults && query.length >= 3 && !loading && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 z-50 text-center"
          >
            <p className="text-slate-400">No FAQs found matching "{query}"</p>
            <p className="text-slate-500 text-sm mt-2">Try different keywords or check the category filter</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
