import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { ensurePermission, scheduleReminder, cancelReminder } from "@/lib/notifications";

/**
 * On mount (and on task changes), reads all upcoming tasks with reminder_at
 * and schedules a notification for each. Web uses Notification API + setTimeout;
 * native uses Capacitor LocalNotifications.
 */
export function useReminderBootstrap() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function syncAll() {
      await ensurePermission().catch(() => false);
      const { data, error } = await supabase
        .from("tasks")
        .select("id,title,description,reminder_at,status")
        .eq("user_id", user!.id)
        .not("reminder_at", "is", null);
      if (error || cancelled || !data) return;
      const now = Date.now();
      for (const t of data) {
        const at = new Date(t.reminder_at as string);
        if (t.status === "done" || at.getTime() <= now) {
          await cancelReminder(t.id).catch(() => {});
          continue;
        }
        await scheduleReminder({
          id: t.id,
          title: `⏰ ${t.title}`,
          body: t.description || "Time to focus on this task.",
          at,
        }).catch(() => {});
      }
    }

    syncAll();

    const ch = supabase.channel(`reminders-${user.id}-${Math.random().toString(36).slice(2)}`);
    ch.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
      () => { if (!cancelled) syncAll(); },
    ).subscribe();

    return () => {
      cancelled = true;
      ch.unsubscribe().finally(() => { supabase.removeChannel(ch); });
    };
  }, [user]);
}
