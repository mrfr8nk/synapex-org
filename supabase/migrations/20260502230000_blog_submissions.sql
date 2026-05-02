-- Blog post user submissions + project updates
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS submitted_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS pending_approval boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.project_updates (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  developer_name text,
  content        text        NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_updates_project ON public.project_updates (project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_user    ON public.project_updates (user_id);

ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_updates' AND policyname='pu_own_insert') THEN
    CREATE POLICY pu_own_insert ON public.project_updates FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_updates' AND policyname='pu_own_read') THEN
    CREATE POLICY pu_own_read ON public.project_updates FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_updates' AND policyname='pu_admin_all') THEN
    CREATE POLICY pu_admin_all ON public.project_updates FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Allow authenticated users to insert their own blog submissions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='blog_user_submit') THEN
    CREATE POLICY blog_user_submit ON public.blog_posts
      FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND submitted_by_user_id = auth.uid()
        AND published = false
        AND pending_approval = true
      );
  END IF;
END $$;
