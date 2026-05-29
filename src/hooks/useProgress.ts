import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { UserProgress, UserActivity, UserPreferences } from '../types/database';

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchPreferences();
      initSession();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create initial progress record
        const { data: newData, error: insertError } = await supabase
          .from('user_progress')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setProgress(newData);
      } else {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_preferences')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newData);
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const initSession = () => {
    const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('sessionStart', Date.now().toString());
    return sessionId;
  };

  const trackActivity = useCallback(
    async (
      activityType: string,
      resourceType?: string,
      resourceId?: string,
      metadata?: Record<string, any>
    ) => {
      if (!user) return;

      try {
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: activityType,
          resource_type: resourceType,
          resource_id: resourceId,
          metadata,
          session_id: localStorage.getItem('sessionId'),
        });

        // Update progress counters
        const updates: Partial<UserProgress> = {};

        if (activityType === 'view_faq') {
          updates.faqs_viewed = (progress?.faqs_viewed || 0) + 1;
        } else if (activityType === 'create_faq') {
          updates.faqs_created = (progress?.faqs_created || 0) + 1;
        } else if (activityType === 'create_reply') {
          updates.replies_posted = (progress?.replies_posted || 0) + 1;
        }

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        if (progress?.last_activity_date !== today) {
          const lastDate = progress?.last_activity_date
            ? new Date(progress.last_activity_date)
            : null;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastDate && lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            updates.streak_days = (progress?.streak_days || 0) + 1;
          } else {
            updates.streak_days = 1;
          }
          updates.last_activity_date = today;
        }

        if (Object.keys(updates).length > 0) {
          await supabase
            .from('user_progress')
            .update(updates)
            .eq('user_id', user.id);

          setProgress(prev => prev ? { ...prev, ...updates } : null);
        }
      } catch (error) {
        console.error('Error tracking activity:', error);
      }
    },
    [user, progress]
  );

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      if (!user || !preferences) return;

      try {
        const { error } = await supabase
          .from('user_preferences')
          .update(updates)
          .eq('user_id', user.id);

        if (error) throw error;
        setPreferences(prev => prev ? { ...prev, ...updates } : null);
      } catch (error) {
        console.error('Error updating preferences:', error);
      }
    },
    [user, preferences]
  );

  const addBookmark = useCallback(
    async (faqId: string) => {
      if (!user || !preferences) return;

      const bookmarks = [...(preferences.bookmarks || []), faqId];
      await updatePreferences({ bookmarks });
    },
    [user, preferences, updatePreferences]
  );

  const removeBookmark = useCallback(
    async (faqId: string) => {
      if (!user || !preferences) return;

      const bookmarks = (preferences.bookmarks || []).filter(id => id !== faqId);
      await updatePreferences({ bookmarks });
    },
    [user, preferences, updatePreferences]
  );

  const updateLanguage = useCallback(
    async (language: string) => {
      await updatePreferences({ language });
    },
    [updatePreferences]
  );

  return {
    progress,
    preferences,
    loading,
    trackActivity,
    updatePreferences,
    addBookmark,
    removeBookmark,
    updateLanguage,
  };
}
