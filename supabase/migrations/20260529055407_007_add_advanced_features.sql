/*
  # Add Advanced Features Schema

  This migration adds support for:
  1. Voting system - votes table for FAQs and replies
  2. Dynamic ticketing - tickets table for support requests
  3. Screenshot support - add screenshots column to FAQs and replies
  4. Progress tracking - user_progress table for learning progress
  5. Emergency support - emergency_tickets table for urgent issues
  6. Behavior tracking - user_activity table for analytics
  7. Personalized FAQs - user_preferences table
*/

-- Add is_admin column to profiles first
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Add screenshots column to FAQs
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS screenshots text[];

-- Add screenshots column to replies
ALTER TABLE replies ADD COLUMN IF NOT EXISTS screenshots text[];

-- Votes table for FAQs and replies
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voteable_type text NOT NULL CHECK (voteable_type IN ('faq', 'reply')),
  voteable_id uuid NOT NULL,
  vote_value integer NOT NULL CHECK (vote_value IN (-1, 1)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, voteable_type, voteable_id)
);

-- Tickets table for dynamic ticketing
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'emergency')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid REFERENCES profiles(id),
  screenshots text[],
  tags text[],
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  faqs_viewed integer DEFAULT 0,
  faqs_created integer DEFAULT 0,
  replies_posted integer DEFAULT 0,
  helpful_votes_received integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_activity_date date,
  total_time_spent integer DEFAULT 0,
  badges text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User activity log for behavior tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- User preferences for personalization
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  preferred_categories text[],
  language text DEFAULT 'en',
  theme text DEFAULT 'dark',
  notification_settings jsonb DEFAULT '{"email": true, "browser": true}',
  bookmarks uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- FAQ translations table
CREATE TABLE IF NOT EXISTS faq_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faq_id uuid NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
  language text NOT NULL,
  question text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(faq_id, language)
);

-- Enable RLS on all new tables
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes
CREATE POLICY "Users can view all votes"
  ON votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own vote"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vote"
  ON votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vote"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for tickets
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Admins can view all tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_activity
CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for faq_translations
CREATE POLICY "Everyone can view translations"
  ON faq_translations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add translations"
  ON faq_translations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update translations"
  ON faq_translations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add vote counts to FAQs
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS upvotes integer DEFAULT 0;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS downvotes integer DEFAULT 0;

-- Add vote counts to replies
ALTER TABLE replies ADD COLUMN IF NOT EXISTS upvotes integer DEFAULT 0;
ALTER TABLE replies ADD COLUMN IF NOT EXISTS downvotes integer DEFAULT 0;

-- Add sentiment to FAQs
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS sentiment text;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS sentiment_score numeric;

-- Add sentiment to replies
ALTER TABLE replies ADD COLUMN IF NOT EXISTS sentiment text;
ALTER TABLE replies ADD COLUMN IF NOT EXISTS sentiment_score numeric;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_voteable ON votes(voteable_type, voteable_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_faq_translations_faq ON faq_translations(faq_id);
