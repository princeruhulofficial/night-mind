# NightMind

**Your AI Companion for Better Days**

NightMind is a mobile-first AI-powered habit & sleep companion that helps you design intentional days starting from a better night. Record how you feel at night, let AI generate a realistic daily plan, track tasks with energy & priority awareness, build credibility through consistency, and stay motivated with a live leaderboard.

> Built with privacy and focus in mind. Your data stays under your control.

---

## Features

### Core Experience
- **Night Check-in** — Reflect on your day/energy via chat or structured input. AI generates a personalized plan for tomorrow.
- **Smart Daily Plan** — Tasks automatically prioritized by energy level, duration, and importance.
- **Time Dial Onboarding** — Beautiful circular dials to set bedtime & wake-up time.
- **Life Clock** — Real-time visualization of how much of your life has already passed (based on birth date).
- **Credibility Score** — Gamified consistency system that rewards completed tasks and honesty.
- **Leaderboard** — Weekly + all-time rankings to stay motivated (with realtime updates).
- **Patterns & Weekly Debrief** — AI-detected patterns and weekly reflection summaries.
- **Voice Input** — Speak task notes and reflections (Web Speech API).
- **Local Notifications** — Task reminders via Capacitor Local Notifications.
- **Bilingual** — Full English + বাংলা support.

### Privacy & Security
- Supabase Auth + Row Level Security (RLS) on every table
- Avatar uploads to private-per-user storage paths
- No unnecessary cloud storage of personal content

---

## Tech Stack

| Layer              | Technology                                      |
|--------------------|-------------------------------------------------|
| Frontend           | React 18, TypeScript, Vite                      |
| UI                 | Tailwind CSS, shadcn/ui, Lucide, Embla Carousel |
| State / Data       | TanStack Query, Supabase JS                     |
| Backend            | Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) |
| Mobile             | Capacitor 8 (iOS + Android)                     |
| AI                 | Supabase Edge Functions (`chat`, `generate-plan`) |
| Notifications      | `@capacitor/local-notifications`                |
| Testing            | Vitest + Testing Library                        |

---

## Project Structure

```
night-mind/
├── src/
│   ├── components/
│   │   ├── app/          # App-specific components (TimeDial, LifeClock, TaskIconTile, BottomNav...)
│   │   └── ui/           # shadcn/ui primitives
│   ├── pages/
│   │   ├── app/          # Main authenticated screens (Home, Tasks, Checkin, Profile, Leaderboard...)
│   │   ├── onboarding/   # Onboarding flow
│   │   ├── Auth.tsx
│   │   └── Index.tsx
│   ├── hooks/            # useAuth, useProfile, useVoiceInput, useLifeClock...
│   ├── integrations/supabase/
│   ├── lib/              # format, i18n, notifications, utils
│   └── assets/           # Icons, logos, images
├── supabase/
│   ├── functions/        # Edge Functions (chat, generate-plan)
│   └── migrations/       # SQL migrations
├── public/
├── capacitor.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or bun
- A Supabase project (or use the existing one)
- For mobile: Xcode (iOS) / Android Studio

### 1. Clone & Install

```bash
git clone https://github.com/princeruhulofficial/night-mind.git
cd night-mind
npm install
```

### 2. Environment Variables

Create a `.env` file in the root (or copy from `.env.example` if present):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

> The current repository already contains a working Supabase project configuration for development.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build

```bash
npm run build
npm run preview
```

---

## Mobile (Capacitor)

The app is already configured for Capacitor.

```bash
# After building the web app
npm run build

# Add platforms (first time only)
npx cap add ios
npx cap add android

# Sync web assets → native projects
npx cap sync

# Open in IDE
npx cap open ios
npx cap open android

# Or run directly
npx cap run ios
npx cap run android
```

**App ID:** `app.lovable.be257b217a324018a70d6a46f0a6670e`  
**App Name:** NightMind

---

## Database Overview

Main tables (all protected by RLS):

- `profiles` — name, sleep/wake times, focus areas, avatar_url, birth_date, language, onboarded
- `tasks` — daily plan items (title, icon, duration, priority, energy, status, reminder_at)
- `checkins` — night / why conversation history
- `credibility_events` — score deltas
- `patterns` — AI-detected patterns
- `weekly_debriefs` — weekly summaries
- `why_answers` — reasons for skipped tasks

Key RPC:
- `get_leaderboard()` — returns ranked users with weekly + total completions

Realtime is enabled on the important tables so the UI updates live across devices.

---

## Scripts

| Command              | Description                    |
|----------------------|--------------------------------|
| `npm run dev`        | Start development server       |
| `npm run build`      | Production build               |
| `npm run preview`    | Preview production build       |
| `npm run lint`       | ESLint                         |
| `npm run test`       | Run tests once                 |
| `npm run test:watch` | Vitest in watch mode           |

---

## Internationalization

The app supports **English** and **বাংলা**.

Language preference is stored in `profiles.language` and can be toggled from the Profile screen. Translation keys live in `src/lib/i18n.ts`.

---

## Roadmap / Ideas

- Push notifications (APNs / FCM)
- Friends / follow system for private leaderboards
- Deeper Dream Journal integration (voice → AI video visualization)
- Offline-first support
- Apple Health / Google Fit sleep data import
- Public marketing site improvements (nightmind.ai)

---

## Author

**Prince Ruhul**  
Founder of [Prevalid](https://github.com/princeruhulofficial) — Making AI Accountable  
Building from Bangladesh

GitHub: [@princeruhulofficial](https://github.com/princeruhulofficial)

---

## License

Private / All rights reserved (for now).  
Contact the author if you want to contribute or use any part of this project.

---

Made with focus and late nights.
