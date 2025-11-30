CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- EVENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_ref UUID NOT NULL,
  title VARCHAR(32) NOT NULL,
  description VARCHAR(512) DEFAULT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  happen_time TIMESTAMPTZ NOT NULL
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS event_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_ref UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_ref UUID NOT NULL,
  reply_to_ref UUID NULL REFERENCES event_comments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  create_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- spatial index for fast nearby search
CREATE INDEX IF NOT EXISTS idx_events_location
  ON events
  USING GIST (location);

CREATE OR REPLACE FUNCTION to_iso(ts timestamptz)
RETURNS text AS $$
  SELECT to_char (ts AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.FF6"Z"');
$$ LANGUAGE sql IMMUTABLE;

CREATE TABLE IF NOT EXISTS seeding_log (
  service TEXT PRIMARY KEY,
  seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
