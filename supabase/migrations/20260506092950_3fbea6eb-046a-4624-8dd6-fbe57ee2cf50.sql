ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS reminder_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_tasks_reminder_at ON public.tasks(user_id, reminder_at) WHERE reminder_at IS NOT NULL;