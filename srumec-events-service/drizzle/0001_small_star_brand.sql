-- Custom SQL migration file, put your code below! --
CREATE INDEX IF NOT EXISTS idx_events_organizer_ref ON events(organizer_ref);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE INDEX IF NOT EXISTS idx_event_comments_event_ref ON event_comments(event_ref);
CREATE INDEX IF NOT EXISTS idx_event_comments_user_ref  ON event_comments(user_ref);