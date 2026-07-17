import { translate, type Lang } from "./i18n";

export function formatDuration(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatTime12(hhmm: string) {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = (mStr ?? "00").padStart(2, "0");
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function greeting(lang: Lang = "en") {
  const h = new Date().getHours();
  if (h < 12) return translate(lang, "goodMorning");
  if (h < 18) return translate(lang, "goodAfternoon");
  return translate(lang, "goodEvening");
}
