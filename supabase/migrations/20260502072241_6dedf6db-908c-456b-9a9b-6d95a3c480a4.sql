
-- Sponsors
CREATE TABLE IF NOT EXISTS public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  tier text DEFAULT 'supporter',
  message text,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read sponsors" ON public.sponsors FOR SELECT USING (true);

-- Sponsor applications (open amount)
CREATE TABLE IF NOT EXISTS public.sponsor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  amount text,
  message text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert sponsor app" ON public.sponsor_applications FOR INSERT WITH CHECK (true);

-- Events / News / Updates
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  body text,
  type text NOT NULL DEFAULT 'update', -- event | news | update
  image_url text,
  link_url text,
  event_date timestamptz,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read events" ON public.events FOR SELECT USING (true);

-- Hidden fallback items (so admin can hide built-in fallback content)
CREATE TABLE IF NOT EXISTS public.hidden_fallbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL, -- 'projects' | 'team' | 'services' | 'testimonials' | 'pricing' | 'tech_stack' | 'clients' | 'blog'
  fallback_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(section, fallback_id)
);
ALTER TABLE public.hidden_fallbacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read hidden_fallbacks" ON public.hidden_fallbacks FOR SELECT USING (true);

-- Admin write policies (service_role bypasses RLS, but anon admin needs to write directly from client given hardcoded auth)
-- Per user request: hardcoded admin auth in client. Allow public writes on CMS tables.
-- WARNING: This is intentional per user request. Anyone can edit.

CREATE POLICY "public write sponsors" ON public.sponsors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write hidden_fallbacks" ON public.hidden_fallbacks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write pricing_plans" ON public.pricing_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write tech_stack" ON public.tech_stack FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public write blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin read contact_messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "admin update contact_messages" ON public.contact_messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "admin delete contact_messages" ON public.contact_messages FOR DELETE USING (true);
CREATE POLICY "admin read sponsor_applications" ON public.sponsor_applications FOR SELECT USING (true);

-- Enable RLS on blog_posts (currently has none enabled)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read blog_posts" ON public.blog_posts FOR SELECT USING (true);

-- Storage policies for images bucket (public read + public write per hardcoded admin)
CREATE POLICY "public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "public write images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "public update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "public delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');
