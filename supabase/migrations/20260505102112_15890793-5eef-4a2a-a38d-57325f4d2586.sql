
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_open boolean NOT NULL DEFAULT false;
ALTER TABLE public.sponsors ADD COLUMN IF NOT EXISTS description text;

CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid,
  developer_name text,
  developer_email text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pc_public_read ON public.project_collaborators;
CREATE POLICY pc_public_read ON public.project_collaborators FOR SELECT USING (true);
DROP POLICY IF EXISTS pc_public_insert ON public.project_collaborators;
CREATE POLICY pc_public_insert ON public.project_collaborators FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS pc_admin_update ON public.project_collaborators;
CREATE POLICY pc_admin_update ON public.project_collaborators FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS pc_admin_delete ON public.project_collaborators;
CREATE POLICY pc_admin_delete ON public.project_collaborators FOR DELETE USING (true);
