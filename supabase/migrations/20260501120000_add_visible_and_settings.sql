-- Add visible column to all content tables
-- Defaults to true so existing rows stay visible

ALTER TABLE IF EXISTS services ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS tech_stack ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS testimonials ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS team_members ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS pricing_plans ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS blog_posts ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

-- Create site_content table if it doesn't exist (for social links, footer, contact info, hero text)
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed default social/footer values (safe upsert — won't overwrite existing)
INSERT INTO site_content (key, value) VALUES
  ('social_github',    '{"v": "https://github.com/synapex-dev"}'::jsonb),
  ('social_twitter',   '{"v": "https://twitter.com/synapex_dev"}'::jsonb),
  ('social_linkedin',  '{"v": "https://linkedin.com/company/synapex"}'::jsonb),
  ('social_instagram', '{"v": "https://instagram.com/synapex_dev"}'::jsonb),
  ('social_facebook',  '{"v": ""}'::jsonb),
  ('social_youtube',   '{"v": ""}'::jsonb),
  ('footer_tagline',   '{"v": "Engineering premium software, AI systems and digital experiences for ambitious teams worldwide."}'::jsonb),
  ('contact_email',    '{"v": "contact@synapex.co.zw"}'::jsonb),
  ('contact_whatsapp', '{"v": "+263 719 647 303"}'::jsonb),
  ('contact_location', '{"v": "Harare, Zimbabwe — serving worldwide"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create images storage bucket policy helper (run this separately in Supabase dashboard):
-- 1. Go to Storage → Create bucket named "images" → set Public
-- 2. Add policy: allow authenticated users to upload
