import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function ensurePermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    const { display } = await LocalNotifications.checkPermissions();
    if (display === "granted") return true;
    const req = await LocalNotifications.requestPermissions();
    return req.display === "granted";
  }
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const r = await Notification.requestPermission();
  return r === "granted";
}

export async function scheduleReminder(opts: { id: string; title: string; body: string; at: Date; }) {
  const ok = await ensurePermission();
  if (!ok) throw new Error("Notification permission denied");
  const numericId = Math.abs(hash(opts.id)) % 2_000_000_000;

  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.schedule({
      notifications: [{
        id: numericId,
        title: opts.title,
        body: opts.body,
        schedule: { at: opts.at, allowWhileIdle: true },
      }],
    });
    return;
  }
  // Web fallback: setTimeout while page is open
  const ms = opts.at.getTime() - Date.now();
  if (ms <= 0) {
    new Notification(opts.title, { body: opts.body });
    return;
  }
  const timers = (window as any).__nm_timers ?? ((window as any).__nm_timers = new Map<string, number>());
  if (timers.has(opts.id)) clearTimeout(timers.get(opts.id));
  const t = window.setTimeout(() => {
    try { new Notification(opts.title, { body: opts.body }); } catch {}
    timers.delete(opts.id);
  }, ms);
  timers.set(opts.id, t);
}

export async function cancelReminder(id: string) {
  const numericId = Math.abs(hash(id)) % 2_000_000_000;
  if (Capacitor.isNativePlatform()) {
    try { await LocalNotifications.cancel({ notifications: [{ id: numericId }] }); } catch {}
    return;
  }
  const timers = (window as any).__nm_timers as Map<string, number> | undefined;
  if (timers?.has(id)) { clearTimeout(timers.get(id)!); timers.delete(id); }
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0;
  return h;
}
