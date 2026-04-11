-- =============================================================================
-- Contacts — add department FK, official types, photos, bios, terms
-- =============================================================================

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS contact_type TEXT DEFAULT 'staff'
    CHECK (contact_type IN ('staff', 'elected_official', 'appointed_official', 'board_member'));

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS term_start DATE;

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS term_end DATE;

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS is_department_head BOOLEAN DEFAULT false;

-- Index on department FK
CREATE INDEX IF NOT EXISTS idx_contacts_department
  ON public.contacts(department_id) WHERE department_id IS NOT NULL;
