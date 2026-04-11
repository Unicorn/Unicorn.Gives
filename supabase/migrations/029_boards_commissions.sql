-- =============================================================================
-- Boards & Commissions — governing and advisory bodies
-- =============================================================================

-- 1. Boards / Commissions table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.boards_commissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id             UUID NOT NULL REFERENCES public.regions(id),
  slug                  TEXT NOT NULL,
  name                  TEXT NOT NULL,
  description           TEXT,
  body                  TEXT,
  board_type            TEXT NOT NULL DEFAULT 'board'
                          CHECK (board_type IN (
                            'board', 'commission', 'committee', 'authority', 'council'
                          )),
  department_id         UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  meeting_schedule      TEXT,
  meeting_location      TEXT,
  membership_count      INT,
  term_length_years     INT,
  vacancy_count         INT DEFAULT 0,
  accepting_applications BOOLEAN DEFAULT false,
  application_url       TEXT,
  website               TEXT,
  display_order         INT DEFAULT 0,
  status                TEXT NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'published', 'archived')),
  author_id             UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  published_at          TIMESTAMPTZ,
  UNIQUE(region_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_boards_region
  ON public.boards_commissions(region_id);
CREATE INDEX IF NOT EXISTS idx_boards_department
  ON public.boards_commissions(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_boards_status
  ON public.boards_commissions(status);

CREATE TRIGGER trg_boards_commissions_updated_at
  BEFORE UPDATE ON public.boards_commissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Board members join table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.board_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id          UUID NOT NULL REFERENCES public.boards_commissions(id) ON DELETE CASCADE,
  contact_id        UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  role_on_board     TEXT,
  seat_name         TEXT,
  is_chair          BOOLEAN DEFAULT false,
  appointed_date    DATE,
  term_expires      DATE,
  is_active         BOOLEAN DEFAULT true,
  display_order     INT DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(board_id, name)
);

CREATE INDEX IF NOT EXISTS idx_board_members_board
  ON public.board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_contact
  ON public.board_members(contact_id) WHERE contact_id IS NOT NULL;

-- 3. RLS
-- =============================================================================

ALTER TABLE public.boards_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- Boards
CREATE POLICY boards_select ON public.boards_commissions FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY boards_insert ON public.boards_commissions FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY boards_update ON public.boards_commissions FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND region_id = ANY(public.get_user_region_ids()))
  );

CREATE POLICY boards_delete ON public.boards_commissions FOR DELETE
  USING (public.get_user_role() = 'super_admin');

-- Board members follow parent board access
CREATE POLICY board_members_select ON public.board_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards_commissions b
      WHERE b.id = board_id
        AND (b.status = 'published'
             OR public.get_user_role() = 'super_admin'
             OR (public.get_user_role() = 'municipal_editor'
                 AND b.region_id = ANY(public.get_user_region_ids())))
    )
  );

CREATE POLICY board_members_insert ON public.board_members FOR INSERT
  WITH CHECK (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND EXISTS (
          SELECT 1 FROM public.boards_commissions b
          WHERE b.id = board_id
            AND b.region_id = ANY(public.get_user_region_ids())
        ))
  );

CREATE POLICY board_members_update ON public.board_members FOR UPDATE
  USING (
    public.get_user_role() = 'super_admin'
    OR (public.get_user_role() = 'municipal_editor'
        AND EXISTS (
          SELECT 1 FROM public.boards_commissions b
          WHERE b.id = board_id
            AND b.region_id = ANY(public.get_user_region_ids())
        ))
  );

CREATE POLICY board_members_delete ON public.board_members FOR DELETE
  USING (public.get_user_role() = 'super_admin');
