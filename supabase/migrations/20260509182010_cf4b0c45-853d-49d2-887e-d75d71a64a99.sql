
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Full-time',
  location TEXT NOT NULL DEFAULT 'Remote',
  department TEXT NOT NULL DEFAULT 'Engineering',
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  salary_range TEXT,
  apply_url TEXT,
  open BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='jobs' AND policyname='jobs_public_read') THEN
    CREATE POLICY "jobs_public_read" ON public.jobs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='jobs' AND policyname='jobs_public_write') THEN
    CREATE POLICY "jobs_public_write" ON public.jobs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');
