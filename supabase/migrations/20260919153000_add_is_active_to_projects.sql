-- Migrasi: Tambah kolom is_active pada tabel projects
-- Diterapkan melalui Supabase MCP pada 2026-09-19
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON public.projects (is_active);
