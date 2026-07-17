# Architecture Overview

NightMind is a mobile-first React application backed by Supabase. The design prioritizes fast feedback loops, privacy (RLS everywhere), and a clean separation between UI, data fetching, and AI generation.

## High-Level Flow

```
User (Mobile / Web)
       │
       ▼
┌──────────────────┐
│  React + Vite    │  ← Tailwind + shadcn/ui + TanStack Query
│  (Capacitor)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Supabase      │
│  • Auth          │
│  • Postgres + RLS│
│  • Storage       │
│  • Realtime      │
│  • Edge Functions│  ← AI (chat, generate-plan)
└──────────────────┘
```

## Frontend Architecture

### Routing
- Public: `/`, `/auth`
- Onboarding (authenticated but not onboarded): `/onboarding`, `/onboarding/sleep`
- Main app (with bottom navigation): `/home`, `/checkin`, `/tasks`, `/profile`
- Full-screen routes: `/plan`, `/why`, `/credibility`, `/patterns`, `/leaderboard`, `/debrief`, etc.

Protected routes use the `Protected` component + `AuthProvider`.

### State Management
- **Server state**: TanStack Query (all data from Supabase)
- **Auth state**: Custom `useAuth` hook wrapping Supabase Auth
- **Profile**: `useProfile` / `useUpdateProfile`
- Local UI state stays inside components or simple hooks

### Key Components

| Component          | Purpose                                      |
|--------------------|----------------------------------------------|
| `TimeDial`         | Circular sleep / wake time picker            |
| `LifeClock`        | Real-time life progress visualization        |
| `TaskIconTile`     | 3D-style icon tiles for tasks                |
| `BottomNav`        | Main navigation shell                        |
| `MobileShell`      | Layout wrapper with safe areas               |
| `UserAvatar`       | Profile picture with fallback                |

### Internationalization
Simple dictionary-based i18n in `src/lib/i18n.ts`.  
Language is stored on the user profile and can be toggled live.

## Backend (Supabase)

### Authentication
- Email / password (and potentially magic links)
- Automatic profile creation via database trigger on `auth.users` insert

### Data Access
Every table has Row Level Security enabled. Users can only read/write their own rows (except leaderboard aggregates which use a `SECURITY DEFINER` function).

### Realtime
Postgres changes on `tasks`, `credibility_events`, and related tables are subscribed to from the client so the UI stays in sync across devices.

### Edge Functions
- `chat` — Handles conversational night check-in / reflection
- `generate-plan` — Takes check-in summary + user preferences and produces the daily task list

These functions are the only places where external AI providers are called.

## Mobile Layer (Capacitor)

- Web assets are built into `dist/` and synced into native projects.
- Local notifications are handled via `@capacitor/local-notifications`.
- The app uses a dark theme with a custom background color defined in `capacitor.config.ts`.

## Design Principles

1. **Privacy first** — RLS + minimal data collection.
2. **Energy-aware planning** — Tasks carry energy + duration metadata.
3. **Honesty over perfection** — Skipping a task triggers a “Why?” reflection instead of silent failure.
4. **Progressive disclosure** — Simple home screen, deeper insights available on demand.
5. **Mobile-first** — Designed primarily for phone use, with Capacitor as the distribution path.

---

For database details see [database.md](./database.md).
