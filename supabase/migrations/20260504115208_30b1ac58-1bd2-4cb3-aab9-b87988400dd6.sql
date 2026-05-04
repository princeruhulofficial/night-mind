
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  sleep_time text default '22:30',
  wake_time text default '07:00',
  focus_areas text[] default '{}',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tasks
create type public.task_priority as enum ('high','medium','low');
create type public.task_energy as enum ('high','medium','low');
create type public.task_status as enum ('pending','done','skipped');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  icon text default 'target',
  duration_minutes int not null default 30,
  priority public.task_priority not null default 'medium',
  energy public.task_energy not null default 'medium',
  status public.task_status not null default 'pending',
  scheduled_for date not null default current_date,
  sort_order int not null default 0,
  starred boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.tasks enable row level security;
create policy "own tasks all" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index tasks_user_date_idx on public.tasks(user_id, scheduled_for);

-- Check-ins (chat conversations)
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'night', -- night | why
  messages jsonb not null default '[]'::jsonb,
  summary text,
  created_at timestamptz not null default now()
);
alter table public.checkins enable row level security;
create policy "own checkins all" on public.checkins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Why answers
create table public.why_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  reason text not null,
  detail text,
  created_at timestamptz not null default now()
);
alter table public.why_answers enable row level security;
create policy "own why all" on public.why_answers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Patterns
create table public.patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  detail text,
  data jsonb,
  kind text not null default 'general',
  created_at timestamptz not null default now()
);
alter table public.patterns enable row level security;
create policy "own patterns all" on public.patterns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Credibility events
create table public.credibility_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null, -- completed_tasks | honesty | makeup | consistency
  delta int not null,
  note text,
  created_at timestamptz not null default now()
);
alter table public.credibility_events enable row level security;
create policy "own cred all" on public.credibility_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Weekly debriefs
create table public.weekly_debriefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  completed int not null default 0,
  skipped int not null default 0,
  completion_rate numeric not null default 0,
  top_win text,
  biggest_blocker text,
  ai_suggestion text,
  daily_rates jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.weekly_debriefs enable row level security;
create policy "own debrief all" on public.weekly_debriefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
