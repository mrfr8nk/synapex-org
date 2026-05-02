
CREATE TABLE IF NOT EXISTS public.magic_link_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.magic_link_tokens ENABLE ROW LEVEL SECURITY;
-- Only server (service role) accesses this; no public policies.
CREATE INDEX IF NOT EXISTS idx_mlt_token ON public.magic_link_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_mlt_expires ON public.magic_link_tokens (expires_at);
