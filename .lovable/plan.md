## Plan

Four work streams in one pass.

### 1. Onboarding — user picks both sleep & wake time

Currently the onboarding swipes through 3 cards but immediately jumps to a separate `SleepTime` dial after card 1, skipping the wake-time card and silently using `07:00`. Fix the flow so the user explicitly sets both:

- Keep `Onboarding.tsx` as a 3-card swipe: (1) sleep time, (2) focus areas, (3) wake-up time — no auto-jump to `SleepTime`.
- Replace the inline `<input type="time">` on cards 1 & 3 with the same circular dial used in `SleepTime.tsx` (extract `TimeDial` into `src/components/app/TimeDial.tsx`, themed with moon icon for sleep and sun icon for wake).
- On Finish, save `sleep_time`, `wake_time`, `focus_areas`, `onboarded=true`. Drop the `/onboarding/sleep` route (or keep as standalone editor reachable from Profile).
- Add an "Edit sleep schedule" sheet on Profile that reuses `TimeDial` for both bedtime and wake-up so it's editable post-onboarding.

### 2. Realistic 3D-style icons (Home + Tasks + Plan)

Match the reference: glossy purple "blob" tiles with rendered icons (target, dumbbell, book, pen, lotus). Approach:

- Generate 6 PNG assets via the image-gen pipeline into `src/assets/icons/`: `target.png`, `dumbbell.png`, `book.png`, `pen.png`, `meditate.png`, `brain.png` — dark purple gradient tiles with glowing 3D icon (transparent background).
- Replace the `lucide` icon usage inside task tiles on `Home.tsx`, `Tasks.tsx`, and `Plan.tsx` with a new `<TaskIconTile icon={t.icon} />` component that maps `t.icon` → the rendered PNG, falling back to lucide. Lucide stays for nav/UI chrome.

### 3. Leaderboard (encourage users via top-completers)

New feature — a public-read leaderboard showing who has completed the most tasks.

- New table `public.leaderboard_stats` (or a SQL view) aggregating per-user task completions for the last 7 days plus all-time. Implementation: a `SECURITY DEFINER` function `get_leaderboard()` that returns `{ user_id, name, avatar_url, completed_week, completed_total, rank }` joining `profiles` + `tasks` so RLS doesn't leak other users' tasks but the aggregate is visible.
- Add `avatar_url text` column to `profiles`.
- New screen `src/pages/app/Leaderboard.tsx`: top-3 podium with avatars, then ranked list, "You are #N" pill. Highlight current user.
- Add Leaderboard to bottom nav OR as a card on Home + entry on Profile (recommend: replace nothing — add as a 5th icon would crowd the orb design, so put it on Home as a "Top performers" card + full screen via Profile shortcut).

### 4. Profile picture upload

- Create storage bucket `avatars` (public read, authenticated insert/update on own folder `{user_id}/...`).
- Add `avatar_url` column to `profiles` (same migration as leaderboard).
- Profile screen: tap avatar → file picker → upload to `avatars/{user_id}/avatar.{ext}` → update `profiles.avatar_url`. Show with `<img>` fallback to initial.
- Use the avatar in BottomNav profile button + Leaderboard rows + Home header.

### 5. Realtime that's currently inert

Enable Postgres realtime for the user-facing tables and subscribe in the relevant queries:

- Migration: `ALTER PUBLICATION supabase_realtime ADD TABLE tasks, credibility_events, checkins, patterns, weekly_debriefs, profiles;` and `ALTER TABLE ... REPLICA IDENTITY FULL;`.
- In Home/Tasks/Credibility/Leaderboard, add a `useEffect` that subscribes to `postgres_changes` for the relevant table and calls `queryClient.invalidateQueries(...)` so checking off a task on one device updates everywhere instantly, and the leaderboard shifts live.

### 6. Capacitor native wrapper

- Install `@capacitor/core`, `@capacitor/cli` (dev), `@capacitor/ios`, `@capacitor/android`.
- Create `capacitor.config.ts` with appId `app.lovable.be257b217a324018a70d6a46f0a6670e`, appName `NightMind`, `webDir: "dist"`, and `server.url` pointing at the sandbox preview for hot-reload.
- After merging, the user must export to GitHub, `npm i`, `npx cap add ios|android`, `npm run build`, `npx cap sync`, then `npx cap run ios|android`.

### Technical notes

- Migration adds: `profiles.avatar_url`, storage bucket + policies, `get_leaderboard()` function, realtime publication.
- Image generation runs once at implementation time via the `imagegen` skill and assets are committed to `src/assets/icons/`.
- No new secrets; uses existing Lovable Cloud auth + storage.
- Routes added: `/leaderboard`. Profile gets shortcuts: Edit schedule, Leaderboard.

### Out of scope (ask if you want)

- Push notifications via Capacitor (requires native plugin + APNs/FCM keys).
- Friends/follow system for the leaderboard (currently global, all users).

Ready to build on approval.