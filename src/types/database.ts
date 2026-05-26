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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string;
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
          created_by: string | null;
          view_count: number;
          is_resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          description?: string;
          category?: string;
          tags?: string[];
          created_by: string | null;
          view_count?: number;
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          description?: string;
          category?: string;
          tags?: string[];
          created_by?: string | null;
          view_count?: number;
          is_resolved?: boolean;
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
          is_answer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          faq_id: string;
          user_id: string | null;
          message: string;
          is_answer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          faq_id?: string;
          user_id?: string | null;
          message?: string;
          is_answer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type Reply = Database['public']['Tables']['replies']['Row'];

export type FAQWithAuthor = FAQ & {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar'> | null;
  replies?: Reply[];
};

export type ReplyWithAuthor = Reply & {
  profiles: Pick<Profile, 'id' | 'name' | 'avatar'> | null;
  faqs?: { id: string; question: string } | null;
};

export type Category = {
  value: string;
  label: string;
  icon: string;
};
