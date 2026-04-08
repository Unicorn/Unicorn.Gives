-- Add featured flag to events (news already has one)
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE featured = true;
