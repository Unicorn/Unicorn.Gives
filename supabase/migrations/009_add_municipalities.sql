-- =============================================================================
-- Add municipality regions: City of Clare, City of Harrison, Village of Farwell
-- =============================================================================

INSERT INTO public.regions (slug, name, type, parent_id, description, display_order) VALUES
  ('city-of-clare', 'City of Clare', 'city',
    (SELECT id FROM public.regions WHERE slug = 'clare-county'),
    'City of Clare, Clare County, Michigan — Gateway to the North', 2),
  ('city-of-harrison', 'City of Harrison', 'city',
    (SELECT id FROM public.regions WHERE slug = 'clare-county'),
    'City of Harrison, Clare County seat — Twenty Lakes in Twenty Minutes', 3),
  ('village-of-farwell', 'Village of Farwell', 'village',
    (SELECT id FROM public.regions WHERE slug = 'clare-county'),
    'Village of Farwell, Clare County, Michigan — Rich logging heritage', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;
