-- Restrict non-admin users to updating only display_name, avatar_url, and updated_at on their own profile.

CREATE OR REPLACE FUNCTION public.profiles_enforce_self_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.id = auth.uid()
     AND COALESCE(public.get_user_role(), '') <> 'super_admin' THEN
    IF NEW.role IS DISTINCT FROM OLD.role
       OR NEW.email IS DISTINCT FROM OLD.email
       OR NEW.region_ids IS DISTINCT FROM OLD.region_ids
       OR NEW.partner_id IS DISTINCT FROM OLD.partner_id
       OR NEW.is_active IS DISTINCT FROM OLD.is_active
       OR NEW.id IS DISTINCT FROM OLD.id
       OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Cannot modify restricted profile fields'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_self_update_guard ON public.profiles;
CREATE TRIGGER profiles_self_update_guard
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_enforce_self_update();
