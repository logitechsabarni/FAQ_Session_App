export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar: string;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          avatar?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          description: string;
          category: string;
          tags: string[];
          screenshots: string[] | null;
          created_by: string | null;
          view_count: number;
          upvotes: number;
          downvotes: number;
          is_resolved: boolean;
          sentiment: string | null;
          sentiment_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          description?: string;
          category?: string;
          tags?: string[];
          screenshots?: string[];
          created_by: string | null;
          view_count?: number;
          upvotes?: number;
          downvotes?: number;
          is_resolved?: boolean;
          sentiment?: string | null;
          sentiment_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          description?: string;
          category?: string;
          tags?: string[];
          screenshots?: string[];
          created_by?: string | null;
          view_count?: number;
          upvotes?: number;
          downvotes?: number;
          is_resolved?: boolean;
          sentiment?: string | null;
          sentiment_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      replies: {
        Row: {
          id: string;
          faq_id: string;
          user_id: string | null;
          message: string;
          screenshots: string[] | null;
          is_answer: boolean;
          upvotes: number;
          downvotes: number;
          sentiment: string | null;
          sentiment_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          faq_id: string;
          user_id: string | null;
          message: string;
          screenshots?: string[];
          is_answer?: boolean;
          upvotes?: number;
          downvotes?: number;
          sentiment?: string | null;
          sentiment_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          faq_id?: string;
          user_id?: string | null;
          message?: string;
          screenshots?: string[];
          is_answer?: boolean;
          upvotes?: number;
          downvotes?: number;
          sentiment?: string | null;
          sentiment_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          voteable_type: 'faq' | 'reply';
          voteable_id: string;
          vote_value: -1 | 1;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          voteable_type: 'faq' | 'reply';
          voteable_id: string;
          vote_value: -1 | 1;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          voteable_type?: 'faq' | 'reply';
          voteable_id?: string;
          vote_value?: -1 | 1;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          priority: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          assigned_to: string | null;
          screenshots: string[] | null;
          tags: string[] | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category?: string;
          priority?: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          assigned_to?: string | null;
          screenshots?: string[];
          tags?: string[];
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          priority?: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          assigned_to?: string | null;
          screenshots?: string[];
          tags?: string[];
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          faqs_viewed: number;
          faqs_created: number;
          replies_posted: number;
          helpful_votes_received: number;
          streak_days: number;
          last_activity_date: string | null;
          total_time_spent: number;
          badges: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          faqs_viewed?: number;
          faqs_created?: number;
          replies_posted?: number;
          helpful_votes_received?: number;
          streak_days?: number;
          last_activity_date?: string | null;
          total_time_spent?: number;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          faqs_viewed?: number;
          faqs_created?: number;
          replies_posted?: number;
          helpful_votes_received?: number;
          streak_days?: number;
          last_activity_date?: string | null;
          total_time_spent?: number;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string | null;
          activity_type: string;
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          activity_type: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          activity_type?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          session_id?: string | null;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferred_categories: string[] | null;
          language: string;
          theme: string;
          notification_settings: Json;
          bookmarks: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferred_categories?: string[];
          language?: string;
          theme?: string;
          notification_settings?: Json;
          bookmarks?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferred_categories?: string[];
          language?: string;
          theme?: string;
          notification_settings?: Json;
          bookmarks?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      faq_translations: {
        Row: {
          id: string;
          faq_id: string;
          language: string;
          question: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          faq_id: string;
          language: string;
          question: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          faq_id?: string;
          language?: string;
          question?: string;
          description?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view_count: {
        Args: { faq_id: string };
        Returns: void;
      };
      analyze_sentiment: {
        Args: { text_content: string };
        Returns: { sentiment: string; score: number }[];
      };
      detect_duplicate_faq: {
        Args: { new_question: string; new_description?: string };
        Returns: { id: string; question: string; similarity: number }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type Reply = Database['public']['Tables']['replies']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type UserProgress = Database['public']['Tables']['user_progress']['Row'];
export type UserActivity = Database['public']['Tables']['user_activity']['Row'];
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type FAQTranslation = Database['public']['Tables']['faq_translations']['Row'];

export type FAQWithAuthor = FAQ & {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar'> | null;
  replies?: Reply[];
  user_vote?: Vote | null;
};

export type ReplyWithAuthor = Reply & {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar'> | null;
  faqs?: { id: string; question: string } | null;
  user_vote?: Vote | null;
};

export type Category = {
  value: string;
  label: string;
  icon: string;
};

export type SearchResult = {
  faq: FAQ;
  score: number;
  highlights?: string[];
};
