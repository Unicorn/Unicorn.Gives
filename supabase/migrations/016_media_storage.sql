-- =============================================================================
-- General-purpose media bucket for admin-uploaded images and PDFs.
-- Editors (super_admin, municipal_editor, partner_editor) can upload.
-- All uploaded files are publicly readable (used in page content).
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  20971520,  -- 20 MB
  ARRAY[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
    'application/pdf'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read access
CREATE POLICY "Media public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Editors can upload
CREATE POLICY "Media editor upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor')
);

-- Editors can update/replace their uploads
CREATE POLICY "Media editor update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media'
  AND public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor')
);

-- Only super_admin can delete files
CREATE POLICY "Media admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media'
  AND public.get_user_role() = 'super_admin'
);

-- Also add upload policy to event-covers bucket for admin uploads (currently only service role can upload)
CREATE POLICY "Event covers editor upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-covers'
  AND public.get_user_role() IN ('super_admin', 'municipal_editor', 'partner_editor')
);
