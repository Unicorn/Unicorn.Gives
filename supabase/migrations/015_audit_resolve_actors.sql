-- Allow admin roles who can read audit_log to resolve actor email/display_name for
-- rows missing denormalized actor_* (legacy inserts). RLS blocks direct profile reads
-- for non–super-admins; this function gates on the same roles as audit_log SELECT.
CREATE OR REPLACE FUNCTION public.resolve_audit_actors(p_user_ids UUID[])
RETURNS TABLE (user_id UUID, email TEXT, display_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.email, p.display_name
  FROM public.profiles p
  WHERE p.id = ANY(p_user_ids)
    AND COALESCE(public.get_user_role(), '') IN ('super_admin', 'municipal_editor', 'partner_editor')
    AND EXISTS (
      SELECT 1 FROM public.audit_log a WHERE a.user_id = p.id
    );
$$;

REVOKE ALL ON FUNCTION public.resolve_audit_actors(UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_audit_actors(UUID[]) TO authenticated;

COMMENT ON FUNCTION public.resolve_audit_actors(UUID[]) IS
  'Returns email/display_name for profile IDs that appear in audit_log; editors only.';
