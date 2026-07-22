-- Feature modules: global on/off switches for site feature areas.
-- Read by all clients (anon included) via the existing site_settings_select policy;
-- writable only by super_admin via the existing site_settings_manage policy.
INSERT INTO public.site_settings (key, value)
VALUES (
  'feature_modules',
  '{"municipal": true, "community": true, "directory": true, "games": true}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
