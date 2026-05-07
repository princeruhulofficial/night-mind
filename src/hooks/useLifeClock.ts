import { useEffect, useState } from "react";

export type LifeParts = {
  years: number; months: number; days: number;
  hours: number; minutes: number; seconds: number;
  totalSeconds: number;
};

function diff(from: Date, to: Date): LifeParts {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  let h = to.getHours() - from.getHours();
  let mi = to.getMinutes() - from.getMinutes();
  let s = to.getSeconds() - from.getSeconds();
  if (s < 0) { s += 60; mi -= 1; }
  if (mi < 0) { mi += 60; h -= 1; }
  if (h < 0) { h += 24; d -= 1; }
  if (d < 0) {
    const prev = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    d += prev; m -= 1;
  }
  if (m < 0) { m += 12; y -= 1; }
  const totalSeconds = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
  return { years: y, months: m, days: d, hours: h, minutes: mi, seconds: s, totalSeconds };
}

export function useLifeClock(birthISO: string | null | undefined): LifeParts | null {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!birthISO) return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [birthISO]);
  if (!birthISO) return null;
  const from = new Date(birthISO + "T00:00:00");
  if (Number.isNaN(from.getTime())) return null;
  return diff(from, new Date());
}
