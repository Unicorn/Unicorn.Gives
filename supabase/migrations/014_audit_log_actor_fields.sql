-- Denormalized actor snapshot at audit insert time (RLS prevents non–super-admins from
-- reading other users' profiles; dashboard activity still needs a readable "who".)
ALTER TABLE public.audit_log
  ADD COLUMN IF NOT EXISTS actor_display_name TEXT,
  ADD COLUMN IF NOT EXISTS actor_email TEXT;

COMMENT ON COLUMN public.audit_log.actor_display_name IS 'Snapshot of editor display_name at write time';
COMMENT ON COLUMN public.audit_log.actor_email IS 'Snapshot of editor email at write time';
