-- =============================================================================
-- Normalize Horn Hours Tab Slug
-- =============================================================================
-- Purpose:
--   Move The Horn’s club hours tab slug from `hours-horn` -> `hours` so that
--   all Club partners can share a stable tab schema.
-- =============================================================================

BEGIN;

-- Update the JSONB tabs override on the partner row.
UPDATE public.partners
SET tabs = (
  SELECT jsonb_agg(
    CASE
      WHEN (t->>'slug') = 'hours-horn' THEN jsonb_set(t, '{slug}', '"hours"', false)
      ELSE t
    END
  )
  FROM jsonb_array_elements(public.partners.tabs) AS t
)
WHERE slug = 'the-horn'
  AND tabs IS NOT NULL;

-- Update tab_slug on partner pages so the UI can fetch `/partners/:slug/:tab`.
UPDATE public.partner_pages pp
SET tab_slug = 'hours'
WHERE pp.partner_id = (SELECT id FROM public.partners WHERE slug = 'the-horn')
  AND pp.tab_slug = 'hours-horn';

COMMIT;

