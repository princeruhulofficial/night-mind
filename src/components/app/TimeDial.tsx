import { useRef, useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { formatTime12 } from "@/lib/format";

export function TimeDial({
  value,
  onChange,
  variant = "sleep",
}: {
  value: string; // "HH:MM"
  onChange: (v: string) => void;
  variant?: "sleep" | "wake";
}) {
  const dragging = useRef(false);
  const [hStr, mStr] = value.split(":");
  const hour = parseInt(hStr || "22", 10);
  const minute = parseInt(mStr || "0", 10);

  const totalMin = hour * 60 + minute;
  const angleRad = (totalMin / (24 * 60)) * Math.PI * 2 - Math.PI / 2;
  const knobX = 150 + 110 * Math.cos(angleRad);
  const knobY = 150 + 110 * Math.sin(angleRad);
  const largeArc = totalMin > 12 * 60 ? 1 : 0;

  function setFromAngle(deg: number) {
    const norm = ((deg % 360) + 360) % 360;
    const totalM = Math.round((norm / 360) * 24 * 60 / 15) * 15;
    const h = Math.floor(totalM / 60) % 24;
    const m = totalM % 60;
    onChange(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  function onPointer(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging.current && e.type !== "pointerdown") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    setFromAngle(angle);
  }

  const label = variant === "sleep" ? "Bedtime" : "Wake-up";
  const Icon = variant === "sleep" ? Moon : Sun;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[280px] touch-none select-none"
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); onPointer(e); }}
        onPointerMove={onPointer}
        onPointerUp={(e) => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
      >
        <defs>
          <linearGradient id={`ring-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(274 70% 58%)" />
            <stop offset="100%" stopColor="hsl(220 80% 65%)" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="hsl(240 28% 10%)" stroke="hsl(240 25% 18%)" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
          const r1 = 132, r2 = i % 2 === 0 ? 124 : 128;
          return <line key={i} x1={150 + r1 * Math.cos(a)} y1={150 + r1 * Math.sin(a)} x2={150 + r2 * Math.cos(a)} y2={150 + r2 * Math.sin(a)} stroke="hsl(240 15% 40%)" strokeWidth="1.5" />;
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const h = i * 2;
          const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
          const r = 112;
          return <text key={h} x={150 + r * Math.cos(a)} y={150 + r * Math.sin(a)} fontSize="11" fill="hsl(240 10% 65%)" textAnchor="middle" dominantBaseline="central">{String(h).padStart(2, "0")}</text>;
        })}
        <path d={`M 150 40 A 110 110 0 ${largeArc} 1 ${knobX} ${knobY}`} fill="none" stroke={`url(#ring-${variant})`} strokeWidth="3" strokeLinecap="round" />
        <circle cx={knobX} cy={knobY} r="9" fill="white" filter="drop-shadow(0 0 8px hsl(248 65% 67%))" />
        <text x="150" y="148" textAnchor="middle" fontSize="36" fontWeight="700" fill="white">{formatTime12(value).split(" ")[0]}</text>
        <text x="150" y="170" textAnchor="middle" fontSize="14" fill="hsl(248 65% 75%)">{formatTime12(value).split(" ")[1]}</text>
      </svg>
      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface/70 px-4 py-1.5 text-xs text-primary border border-border">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
    </div>
  );
}
