
-- 1. Avatar column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Public read on profiles (so leaderboard can show names/avatars)
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);

-- 3. Avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars public read" ON storage.objects;
CREATE POLICY "avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars own upload" ON storage.objects;
CREATE POLICY "avatars own upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "avatars own update" ON storage.objects;
CREATE POLICY "avatars own update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "avatars own delete" ON storage.objects;
CREATE POLICY "avatars own delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Leaderboard function (security definer to aggregate across users)
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  name text,
  avatar_url text,
  completed_week integer,
  completed_total integer,
  rank integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH stats AS (
    SELECT
      p.id AS user_id,
      COALESCE(p.name, 'Anonymous') AS name,
      p.avatar_url,
      COALESCE(SUM(CASE WHEN t.status = 'done' AND t.completed_at >= now() - interval '7 days' THEN 1 ELSE 0 END), 0)::int AS completed_week,
      COALESCE(SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END), 0)::int AS completed_total
    FROM public.profiles p
    LEFT JOIN public.tasks t ON t.user_id = p.id
    GROUP BY p.id, p.name, p.avatar_url
  )
  SELECT
    user_id, name, avatar_url, completed_week, completed_total,
    (RANK() OVER (ORDER BY completed_week DESC, completed_total DESC))::int AS rank
  FROM stats
  ORDER BY rank ASC, completed_total DESC
  LIMIT 100;
$$;

-- 5. Realtime
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.credibility_events REPLICA IDENTITY FULL;
ALTER TABLE public.checkins REPLICA IDENTITY FULL;
ALTER TABLE public.patterns REPLICA IDENTITY FULL;
ALTER TABLE public.weekly_debriefs REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.credibility_events;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.checkins;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.patterns;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.weekly_debriefs;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
