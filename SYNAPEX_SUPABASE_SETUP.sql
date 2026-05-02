-- =============================================================
--  SYNAPEX DEVELOPERS — SUPABASE SETUP (run once in SQL Editor)
--  Safe to re-run: everything uses IF NOT EXISTS / DO blocks
-- =============================================================

-- ──────────────────────────────────────────────────────────────
--  1. CORE CONTENT TABLES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_content (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text        NOT NULL UNIQUE,
  value       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.services (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  description text        NOT NULL,
  icon        text        NOT NULL DEFAULT 'Code2',
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  category    text        NOT NULL,
  description text        NOT NULL,
  image_url   text,
  tech        text[]      NOT NULL DEFAULT '{}',
  live_url    text,
  github_url  text,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tech_stack (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  category    text,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  logo_url    text,
  website_url text,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  role        text        NOT NULL,
  quote       text        NOT NULL,
  rating      int         NOT NULL DEFAULT 5,
  avatar_url  text,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  role         text        NOT NULL,
  bio          text,
  image_url    text,
  twitter_url  text,
  linkedin_url text,
  github_url   text,
  sort_order   int         NOT NULL DEFAULT 0,
  visible      boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  price       text        NOT NULL,
  description text        NOT NULL,
  features    text[]      NOT NULL DEFAULT '{}',
  is_popular  boolean     NOT NULL DEFAULT false,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  summary     text,
  content     text,
  author      text        NOT NULL DEFAULT 'Synapex Team',
  category    text,
  image_url   text,
  published   boolean     NOT NULL DEFAULT false,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
--  2. BACKFILL MISSING COLUMNS (safe — IF NOT EXISTS)
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.services     ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.projects     ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.tech_stack   ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.clients      ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.pricing_plans ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.blog_posts   ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

-- ──────────────────────────────────────────────────────────────
--  3. CONTACT MESSAGES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  phone      text,
  subject    text,
  message    text        NOT NULL,
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone   text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS subject text;

-- ──────────────────────────────────────────────────────────────
--  4. DEVELOPER PROFILES (auth-linked)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.developer_profiles (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name          text        NOT NULL DEFAULT '',
  bio           text        DEFAULT '',
  skills        text[]      DEFAULT '{}',
  github_url    text        DEFAULT '',
  portfolio_url text        DEFAULT '',
  avatar_url    text        DEFAULT '',
  location      text        DEFAULT '',
  status        text        DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  role          text        DEFAULT 'developer' CHECK (role IN ('developer', 'senior', 'lead', 'admin')),
  joined_at     timestamptz DEFAULT now(),
  last_seen     timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS developer_profiles_user_id_idx  ON public.developer_profiles (user_id);
CREATE INDEX IF NOT EXISTS developer_profiles_status_idx   ON public.developer_profiles (status);
CREATE INDEX IF NOT EXISTS developer_profiles_joined_at_idx ON public.developer_profiles (joined_at DESC);

-- ──────────────────────────────────────────────────────────────
--  5. EVENTS / NEWS FEED
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  summary     text,
  body        text,
  type        text        NOT NULL DEFAULT 'update',
                          -- allowed: event | news | update | announcement | achievement
  image_url   text,
  link_url    text,
  event_date  timestamptz,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
--  6. SPONSORS & APPLICATIONS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sponsors (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  logo_url    text,
  website_url text,
  tier        text        DEFAULT 'community',
                          -- allowed: community | growth | enterprise
  description text,
  sort_order  int         NOT NULL DEFAULT 0,
  visible     boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sponsor_applications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  email       text        NOT NULL,
  company     text,
  amount      text,
  message     text,
  read        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
--  7. NEWSLETTER SUBSCRIBERS
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text        UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────
--  8. HIDDEN FALLBACKS (admin can hide built-in fallback items)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.hidden_fallbacks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text        NOT NULL,
  fallback_id text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(section, fallback_id)
);

-- ──────────────────────────────────────────────────────────────
--  9. MAGIC LINK TOKENS (SMTP auth flow)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.magic_link_tokens (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        NOT NULL,
  token_hash  text        NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mlt_token   ON public.magic_link_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_mlt_expires ON public.magic_link_tokens (expires_at);

-- ──────────────────────────────────────────────────────────────
--  10. ROW LEVEL SECURITY — ENABLE ON ALL TABLES
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.site_content            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stack              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_fallbacks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magic_link_tokens       ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
--  11. RLS POLICIES (safe — each wrapped in DO block)
-- ──────────────────────────────────────────────────────────────

DO $$ BEGIN

  -- site_content
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_content' AND policyname='sc_public_read') THEN
    CREATE POLICY sc_public_read ON public.site_content FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_content' AND policyname='sc_admin_write') THEN
    CREATE POLICY sc_admin_write ON public.site_content FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- services
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='services' AND policyname='srv_public_read') THEN
    CREATE POLICY srv_public_read ON public.services FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='services' AND policyname='srv_admin_write') THEN
    CREATE POLICY srv_admin_write ON public.services FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- projects
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='proj_public_read') THEN
    CREATE POLICY proj_public_read ON public.projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='proj_admin_write') THEN
    CREATE POLICY proj_admin_write ON public.projects FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- tech_stack
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='tech_stack' AND policyname='ts_public_read') THEN
    CREATE POLICY ts_public_read ON public.tech_stack FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='tech_stack' AND policyname='ts_admin_write') THEN
    CREATE POLICY ts_admin_write ON public.tech_stack FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- clients
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='clients' AND policyname='cl_public_read') THEN
    CREATE POLICY cl_public_read ON public.clients FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='clients' AND policyname='cl_admin_write') THEN
    CREATE POLICY cl_admin_write ON public.clients FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- testimonials
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='testimonials' AND policyname='test_public_read') THEN
    CREATE POLICY test_public_read ON public.testimonials FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='testimonials' AND policyname='test_admin_write') THEN
    CREATE POLICY test_admin_write ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- team_members
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='team_members' AND policyname='tm_public_read') THEN
    CREATE POLICY tm_public_read ON public.team_members FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='team_members' AND policyname='tm_admin_write') THEN
    CREATE POLICY tm_admin_write ON public.team_members FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- pricing_plans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='pricing_plans' AND policyname='pp_public_read') THEN
    CREATE POLICY pp_public_read ON public.pricing_plans FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='pricing_plans' AND policyname='pp_admin_write') THEN
    CREATE POLICY pp_admin_write ON public.pricing_plans FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- blog_posts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='bp_public_read') THEN
    CREATE POLICY bp_public_read ON public.blog_posts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='bp_admin_write') THEN
    CREATE POLICY bp_admin_write ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- contact_messages
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contact_messages' AND policyname='cm_public_insert') THEN
    CREATE POLICY cm_public_insert ON public.contact_messages FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contact_messages' AND policyname='cm_admin_read') THEN
    CREATE POLICY cm_admin_read ON public.contact_messages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contact_messages' AND policyname='cm_admin_update') THEN
    CREATE POLICY cm_admin_update ON public.contact_messages FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contact_messages' AND policyname='cm_admin_delete') THEN
    CREATE POLICY cm_admin_delete ON public.contact_messages FOR DELETE USING (true);
  END IF;

  -- developer_profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='developer_profiles' AND policyname='dp_own_read') THEN
    CREATE POLICY dp_own_read ON public.developer_profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='developer_profiles' AND policyname='dp_own_insert') THEN
    CREATE POLICY dp_own_insert ON public.developer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='developer_profiles' AND policyname='dp_own_update') THEN
    CREATE POLICY dp_own_update ON public.developer_profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='developer_profiles' AND policyname='dp_public_active') THEN
    CREATE POLICY dp_public_active ON public.developer_profiles FOR SELECT USING (status = 'active');
  END IF;

  -- events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='events' AND policyname='ev_public_read') THEN
    CREATE POLICY ev_public_read ON public.events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='events' AND policyname='ev_admin_write') THEN
    CREATE POLICY ev_admin_write ON public.events FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- sponsors
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsors' AND policyname='sp_public_read') THEN
    CREATE POLICY sp_public_read ON public.sponsors FOR SELECT USING (visible = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsors' AND policyname='sp_admin_write') THEN
    CREATE POLICY sp_admin_write ON public.sponsors FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- sponsor_applications
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsor_applications' AND policyname='sa_public_insert') THEN
    CREATE POLICY sa_public_insert ON public.sponsor_applications FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsor_applications' AND policyname='sa_admin_read') THEN
    CREATE POLICY sa_admin_read ON public.sponsor_applications FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsor_applications' AND policyname='sa_admin_update') THEN
    CREATE POLICY sa_admin_update ON public.sponsor_applications FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsor_applications' AND policyname='sa_admin_delete') THEN
    CREATE POLICY sa_admin_delete ON public.sponsor_applications FOR DELETE USING (true);
  END IF;

  -- newsletter_subscribers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='newsletter_subscribers' AND policyname='ns_public_insert') THEN
    CREATE POLICY ns_public_insert ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='newsletter_subscribers' AND policyname='ns_admin_read') THEN
    CREATE POLICY ns_admin_read ON public.newsletter_subscribers FOR SELECT USING (true);
  END IF;

  -- hidden_fallbacks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='hidden_fallbacks' AND policyname='hf_public_read') THEN
    CREATE POLICY hf_public_read ON public.hidden_fallbacks FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='hidden_fallbacks' AND policyname='hf_admin_write') THEN
    CREATE POLICY hf_admin_write ON public.hidden_fallbacks FOR ALL USING (true) WITH CHECK (true);
  END IF;

END $$;

-- ──────────────────────────────────────────────────────────────
--  12. STORAGE — images bucket policies
--      Run ONLY if you have created a public bucket named "images"
--      in Storage → Buckets first. Comment out if already set.
-- ──────────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='img_public_read' AND tablename='objects') THEN
    CREATE POLICY img_public_read   ON storage.objects FOR SELECT USING (bucket_id = 'images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='img_public_insert' AND tablename='objects') THEN
    CREATE POLICY img_public_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='img_public_update' AND tablename='objects') THEN
    CREATE POLICY img_public_update ON storage.objects FOR UPDATE USING (bucket_id = 'images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='img_public_delete' AND tablename='objects') THEN
    CREATE POLICY img_public_delete ON storage.objects FOR DELETE USING (bucket_id = 'images');
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────────
--  13. DEFAULT SITE CONTENT VALUES
-- ──────────────────────────────────────────────────────────────

INSERT INTO public.site_content (key, value) VALUES
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

-- ──────────────────────────────────────────────────────────────
--  DONE ✓  All tables, columns, policies and defaults applied.
-- ──────────────────────────────────────────────────────────────
