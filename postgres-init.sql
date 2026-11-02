-- Application event table. Flask's SQLAlchemy creates the users/uid_entries tables.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS track_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  action TEXT NOT NULL, ip TEXT NOT NULL DEFAULT 'unknown',
  ua TEXT NOT NULL DEFAULT 'unknown',
  session_id TEXT NOT NULL DEFAULT 'unknown',
  entries JSONB NOT NULL DEFAULT '[]'::jsonb
);
CREATE INDEX IF NOT EXISTS track_events_timestamp_idx ON track_events(timestamp);
