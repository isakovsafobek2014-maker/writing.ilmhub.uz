-- Run this in Supabase SQL Editor for the project used by the frontend.
-- Public buckets are required for playback using getPublicUrl().
-- Students do not use Supabase Auth, so media upload access is granted to anon;
-- keep the size and MIME restrictions below.

ALTER TABLE public.messages
    ALTER COLUMN sender_id TYPE TEXT USING sender_id::TEXT;

ALTER TABLE public.messages
    ADD COLUMN IF NOT EXISTS group_name TEXT,
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS audio_url TEXT,
    ADD COLUMN IF NOT EXISTS video_url TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('voice-messages', 'voice-messages', TRUE, 26214400, ARRAY['audio/webm', 'audio/ogg', 'audio/mp4']),
    ('video-messages', 'video-messages', TRUE, 52428800, ARRAY['video/webm', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Chat media upload'
    ) THEN
        CREATE POLICY "Chat media upload"
        ON storage.objects
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (bucket_id IN ('voice-messages', 'video-messages'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Chat media read'
    ) THEN
        CREATE POLICY "Chat media read"
        ON storage.objects
        FOR SELECT
        TO anon, authenticated
        USING (bucket_id IN ('voice-messages', 'video-messages'));
    END IF;
END;
$$;

NOTIFY pgrst, 'reload schema';
