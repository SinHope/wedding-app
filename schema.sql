-- ============================================================
-- Manganui Wedding App — Full Database Schema
-- Run this in Supabase SQL Editor to set up a fresh project
-- ============================================================
-- NOTE: Before running this, create a public storage bucket
--       named "manganui_photos" via the Supabase Dashboard:
--       Storage → New bucket → Name: manganui_photos → Public: ON
-- ============================================================


-- ============================================================
-- 1. SCHEMA
-- ============================================================

CREATE SCHEMA IF NOT EXISTS manganui;


-- ============================================================
-- 2. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS manganui.events (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name              text        NOT NULL,
    slug              text        NOT NULL UNIQUE,
    event_date        date,
    cover_image       text,
    watermark_enabled boolean     NOT NULL DEFAULT true,
    status            text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked')),
    groom_name        text,
    bride_name        text,
    location          text,
    phone_number      text,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manganui.posts (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id     uuid        NOT NULL REFERENCES manganui.events(id) ON DELETE CASCADE,
    name         text,
    message      text,
    photos       text[],
    is_pinned    boolean     NOT NULL DEFAULT false,
    is_highlight boolean     NOT NULL DEFAULT false,
    reactions    jsonb       NOT NULL DEFAULT '{}',
    video_url    text,
    created_at   timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 3. GRANTS (schema + table access for Supabase roles)
-- ============================================================

GRANT USAGE ON SCHEMA manganui TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA manganui TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA manganui TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA manganui
    GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA manganui
    GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE manganui.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE manganui.posts  ENABLE ROW LEVEL SECURITY;

-- Events: anyone can read, only admins (authenticated) can write
CREATE POLICY "Public can read events"
    ON manganui.events FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert events"
    ON manganui.events FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update events"
    ON manganui.events FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete events"
    ON manganui.events FOR DELETE TO authenticated USING (true);

-- Posts: anyone can read and create, only admins can update/delete
CREATE POLICY "Public can read posts"
    ON manganui.posts FOR SELECT USING (true);

CREATE POLICY "Anyone can create posts"
    ON manganui.posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can update posts"
    ON manganui.posts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete posts"
    ON manganui.posts FOR DELETE TO authenticated USING (true);


-- ============================================================
-- 5. STORAGE POLICIES (for manganui_photos bucket)
-- ============================================================

-- Anyone (guests) can read photos
CREATE POLICY "Allow public reads"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'manganui_photos');

-- Anyone (guests) can upload photos when posting
CREATE POLICY "Allow public uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'manganui_photos');

-- Authenticated (admins) can update/upsert (e.g. cover image re-upload)
CREATE POLICY "Authenticated can update storage"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'manganui_photos');


-- Nasmer Fontanilla --