import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FAQ } from '../types/database';
import toast from 'react-hot-toast';

const OFFLINE_CACHE_KEY = 'offline_faq_cache';
const CACHE_TIMESTAMP_KEY = 'offline_faq_timestamp';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface OfflineFAQ extends FAQ {
  cachedAt: number;
}

export function useOfflineFAQs() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheSize, setCacheSize] = useState(0);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCacheStats();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCacheStats = () => {
    try {
      const cache = localStorage.getItem(OFFLINE_CACHE_KEY);
      if (cache) {
        const faqs: OfflineFAQ[] = JSON.parse(cache);
        setCacheSize(faqs.length);
      }

      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (timestamp) {
        setLastSynced(new Date(parseInt(timestamp)));
      }
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  };

  const syncFAQs = async (): Promise<{ success: boolean; count: number }> => {
    if (!isOnline) {
      toast.error('You are offline. Cannot sync FAQs.');
      return { success: false, count: 0 };
    }

    try {
      toast.loading('Syncing FAQs for offline access...', { id: 'sync' });

      const { data: faqs, error } = await supabase
        .from('faqs')
        .select('*, profiles(id, name, avatar)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const offlineFAQs: OfflineFAQ[] = (faqs || []).map(faq => ({
        ...faq,
        cachedAt: Date.now(),
      }));

      localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(offlineFAQs));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

      setCacheSize(offlineFAQs.length);
      setLastSynced(new Date());

      toast.success(`Synced ${offlineFAQs.length} FAQs for offline access`, { id: 'sync' });
      return { success: true, count: offlineFAQs.length };
    } catch (error) {
      console.error('Error syncing FAQs:', error);
      toast.error('Failed to sync FAQs', { id: 'sync' });
      return { success: false, count: 0 };
    }
  };

  const getCachedFAQs = (): OfflineFAQ[] => {
    try {
      const cache = localStorage.getItem(OFFLINE_CACHE_KEY);
      if (!cache) return [];

      const faqs: OfflineFAQ[] = JSON.parse(cache);
      return faqs.filter(f => Date.now() - f.cachedAt < CACHE_EXPIRY);
    } catch (error) {
      console.error('Error reading cache:', error);
      return [];
    }
  };

  const clearCache = () => {
    localStorage.removeItem(OFFLINE_CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    setCacheSize(0);
    setLastSynced(null);
    toast.success('Offline cache cleared');
  };

  return {
    isOnline,
    cacheSize,
    lastSynced,
    syncFAQs,
    getCachedFAQs,
    clearCache,
  };
}
