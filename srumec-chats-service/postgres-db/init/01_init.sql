-- ============================================
--  srumec-chats-service – PostgreSQL INIT
-- ============================================

-- ─────────────────────────────────────────────
-- DROP EXISTING TYPES (if exist)
-- ─────────────────────────────────────────────
DROP TYPE IF EXISTS chat_room_type CASCADE;
DROP TYPE IF EXISTS group_role CASCADE;

-- ─────────────────────────────────────────────
-- CREATE ENUM TYPES
-- ─────────────────────────────────────────────
CREATE TYPE chat_room_type AS ENUM ('direct', 'group');
CREATE TYPE group_role AS ENUM ('guest', 'admin');

-- ─────────────────────────────────────────────
-- DROP TABLES (if exist)
-- ─────────────────────────────────────────────
DROP TABLE IF EXISTS chat_room_group_member CASCADE;
DROP TABLE IF EXISTS chat_message CASCADE;
DROP TABLE IF EXISTS chat_room_direct CASCADE;
DROP TABLE IF EXISTS chat_room_group CASCADE;

-- ============================================
-- TABLE: chat_room_direct
-- ============================================
CREATE TABLE chat_room_direct (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_1_ref UUID NOT NULL,
    user_2_ref UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_users_distinct CHECK (user_1_ref <> user_2_ref)
);

-- Indexy
CREATE INDEX idx_chat_room_direct_user_1 ON chat_room_direct(user_1_ref);
CREATE INDEX idx_chat_room_direct_user_2 ON chat_room_direct(user_2_ref);

-- ============================================
-- TABLE: chat_room_group
-- ============================================
CREATE TABLE chat_room_group (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_room_group_name ON chat_room_group(name);

-- ============================================
-- TABLE: chat_room_group_member
-- ============================================
CREATE TABLE chat_room_group_member (
    group_ref UUID NOT NULL,
    user_ref UUID NOT NULL,
    role group_role NOT NULL,
    member_since TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (group_ref, user_ref),

    CONSTRAINT fk_group_member_group
        FOREIGN KEY (group_ref) REFERENCES chat_room_group(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_chat_room_group_member_user ON chat_room_group_member(user_ref);

-- ============================================
-- TABLE: chat_message
-- ============================================
CREATE TABLE chat_message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_ref UUID NOT NULL,
    user_ref UUID NOT NULL,
    message TEXT NOT NULL,
    sent_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type chat_room_type NOT NULL
);

-- Indexy
CREATE INDEX idx_chat_message_room ON chat_message(room_ref);
CREATE INDEX idx_chat_message_user ON chat_message(user_ref);
CREATE INDEX idx_chat_message_type ON chat_message(type);

CREATE OR REPLACE FUNCTION to_iso(ts timestamptz)
RETURNS text AS $$
  SELECT to_char (ts AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.FF6"Z"');
$$ LANGUAGE sql IMMUTABLE;

-- ============================================
--  END OF FILE
-- ============================================
