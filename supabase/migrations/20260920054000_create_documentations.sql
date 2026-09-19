-- Migration: create_documentations table
-- Created at: 2026-09-20 05:40:00

CREATE TABLE IF NOT EXISTS public.documentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documentations_order_index ON public.documentations (order_index ASC);
CREATE INDEX IF NOT EXISTS idx_documentations_is_active ON public.documentations (is_active);

ALTER TABLE public.documentations ENABLE ROW LEVEL SECURITY;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.documentations FROM anon;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documentations' AND policyname = 'Public read documentations'
  ) THEN
    CREATE POLICY "Public read documentations" ON public.documentations FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documentations' AND policyname = 'Admin insert documentations'
  ) THEN
    CREATE POLICY "Admin insert documentations" ON public.documentations FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documentations' AND policyname = 'Admin update documentations'
  ) THEN
    CREATE POLICY "Admin update documentations" ON public.documentations FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documentations' AND policyname = 'Admin delete documentations'
  ) THEN
    CREATE POLICY "Admin delete documentations" ON public.documentations FOR DELETE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;
