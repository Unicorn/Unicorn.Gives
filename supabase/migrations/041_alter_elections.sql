-- =============================================================================
-- Elections — add filing deadline, precinct/polling info, ballot & voter URLs
-- =============================================================================

ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS filing_deadline DATE;

ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS precinct_info JSONB;

ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS polling_locations JSONB;

ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS sample_ballot_url TEXT;

ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS voter_info_url TEXT;
