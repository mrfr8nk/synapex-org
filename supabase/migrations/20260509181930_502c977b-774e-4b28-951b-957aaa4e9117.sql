
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='newsletter_subscribers' AND policyname='ns_public_update_unsub') THEN
    CREATE POLICY "ns_public_update_unsub" ON public.newsletter_subscribers FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='newsletter_subscribers' AND policyname='ns_admin_delete') THEN
    CREATE POLICY "ns_admin_delete" ON public.newsletter_subscribers FOR DELETE USING (true);
  END IF;
END $$;
