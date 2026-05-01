-- Developer profiles table for the Synapex developer network
-- Open to developers aged 13+ worldwide

CREATE TABLE IF NOT EXISTS developer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  github_url TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  location TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  role TEXT DEFAULT 'developer' CHECK (role IN ('developer', 'senior', 'lead', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;

-- Developers can read their own profile
CREATE POLICY "Developers can view own profile"
  ON developer_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Developers can insert their own profile
CREATE POLICY "Developers can create own profile"
  ON developer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Developers can update their own profile
CREATE POLICY "Developers can update own profile"
  ON developer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow public read for non-sensitive fields (name, skills, location, avatar)
-- Admins see everything via service_role key
CREATE POLICY "Public can view active developer profiles"
  ON developer_profiles FOR SELECT
  USING (status = 'active');

-- Index for performance
CREATE INDEX IF NOT EXISTS developer_profiles_user_id_idx ON developer_profiles (user_id);
CREATE INDEX IF NOT EXISTS developer_profiles_status_idx ON developer_profiles (status);
CREATE INDEX IF NOT EXISTS developer_profiles_joined_at_idx ON developer_profiles (joined_at DESC);
