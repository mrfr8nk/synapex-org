-- Project collaboration system
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_open boolean NOT NULL DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS open_roles text[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL,
  developer_name text,
  developer_email text,
  status       text        NOT NULL DEFAULT 'pending',
  message      text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_collaborators' AND policyname='collab_own_read') THEN
    CREATE POLICY collab_own_read ON public.project_collaborators FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_collaborators' AND policyname='collab_own_insert') THEN
    CREATE POLICY collab_own_insert ON public.project_collaborators FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_collaborators' AND policyname='collab_admin_all') THEN
    CREATE POLICY collab_admin_all ON public.project_collaborators FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
