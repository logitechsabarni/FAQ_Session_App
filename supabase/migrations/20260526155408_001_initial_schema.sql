/*
  # Initial Schema for FAQ_Session Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text, user's display name)
      - `avatar` (text, avatar URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text, the FAQ question)
      - `description` (text, detailed description)
      - `category` (text, category of FAQ)
      - `tags` (text array, tags for the FAQ)
      - `created_by` (uuid, references profiles)
      - `view_count` (integer, number of views)
      - `is_resolved` (boolean, whether FAQ is resolved)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `replies`
      - `id` (uuid, primary key)
      - `faq_id` (uuid, references faqs)
      - `user_id` (uuid, references profiles)
      - `message` (text, reply content)
      - `is_answer` (boolean, if this is marked as an answer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read all, update own
    - FAQs: all can read, authenticated can create/update own
    - Replies: all can read, authenticated can create/update own

  3. Indexes
    - Index on faqs.category for filtering
    - Index on faqs.created_at for sorting
    - Index on replies.faq_id for joining
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  avatar text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  view_count integer DEFAULT 0,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  message text NOT NULL,
  is_answer boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- FAQs policies
CREATE POLICY "Anyone can view FAQs"
  ON faqs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create FAQs"
  ON faqs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own FAQs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own FAQs"
  ON faqs FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Replies policies
CREATE POLICY "Anyone can view replies"
  ON replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies"
  ON replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON replies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_created_by ON faqs(created_by);
CREATE INDEX IF NOT EXISTS idx_replies_faq_id ON replies(faq_id);
CREATE INDEX IF NOT EXISTS idx_replies_user_id ON replies(user_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_replies_updated_at
  BEFORE UPDATE ON replies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
