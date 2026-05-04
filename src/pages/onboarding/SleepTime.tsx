import { useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Moon, Sun } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { formatTime12 } from "@/lib/format";

export default function SleepTime() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const seed = location.state ?? {};
  const [hour, setHour] = useState(22);
  const [minute, setMinute] = useState(30);
  const dragging = useRef(false);
  const update = useUpdateProfile();

  const time = useMemo(() => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`, [hour, minute]);

  function setFromAngle(deg: number) {
    // 0deg at top = 0h, 360deg = 24h
    const norm = ((deg % 360) + 360) % 360;
    const totalMin = Math.round((norm / 360) * 24 * 60 / 15) * 15; // snap 15min
    setHour(Math.floor(totalMin / 60) % 24);
    setMinute(totalMin % 60);
  }

  function onPointer(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging.current && e.type !== "pointerdown") return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // top = 0
    setFromAngle(angle);
  }

  // Compute knob position
  const totalMin = hour * 60 + minute;
  const angleRad = (totalMin / (24 * 60)) * Math.PI * 2 - Math.PI / 2;
  const knobX = 150 + 110 * Math.cos(angleRad);
  const knobY = 150 + 110 * Math.sin(angleRad);
  // Arc from top to current
  const largeArc = totalMin > 12 * 60 ? 1 : 0;

  async function next() {
    try {
      await update.mutateAsync({
        sleep_time: time,
        wake_time: seed.wake ?? "07:00",
        focus_areas: seed.focus ?? [],
        onboarded: true,
      });
      toast.success("Sleep schedule saved");
      navigate("/checkin");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ScreenHeader title={<span><span>Set Your </span><span className="gradient-text">Sleep Time</span></span>} subtitle="Your AI will remind you before sleep" />

      <div className="flex-1 grid place-items-center px-6">
        <svg
          viewBox="0 0 300 300"
          className="w-full max-w-xs touch-none select-none"
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); onPointer(e); }}
          onPointerMove={onPointer}
          onPointerUp={(e) => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
        >
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(274 70% 58%)" />
              <stop offset="100%" stopColor="hsl(220 80% 65%)" />
            </linearGradient>
          </defs>
          {/* outer dial */}
          <circle cx="150" cy="150" r="140" fill="hsl(240 28% 10%)" stroke="hsl(240 25% 18%)" />
          {/* hour ticks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
            const r1 = 132, r2 = i % 2 === 0 ? 124 : 128;
            return <line key={i} x1={150 + r1 * Math.cos(a)} y1={150 + r1 * Math.sin(a)} x2={150 + r2 * Math.cos(a)} y2={150 + r2 * Math.sin(a)} stroke="hsl(240 15% 40%)" strokeWidth="1.5" />;
          })}
          {/* hour labels (every 2) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const h = i * 2;
            const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
            const r = 112;
            return <text key={h} x={150 + r * Math.cos(a)} y={150 + r * Math.sin(a)} fontSize="11" fill="hsl(240 10% 65%)" textAnchor="middle" dominantBaseline="central">{String(h).padStart(2, "0")}</text>;
          })}
          {/* progress arc */}
          <path d={`M 150 40 A 110 110 0 ${largeArc} 1 ${knobX} ${knobY}`} fill="none" stroke="url(#ring)" strokeWidth="3" strokeLinecap="round" />
          {/* knob */}
          <circle cx={knobX} cy={knobY} r="9" fill="white" filter="drop-shadow(0 0 8px hsl(248 65% 67%))" />
          {/* center text */}
          <text x="150" y="148" textAnchor="middle" fontSize="36" fontWeight="700" fill="white">{formatTime12(time).split(" ")[0]}</text>
          <text x="150" y="170" textAnchor="middle" fontSize="14" fill="hsl(248 65% 75%)">{formatTime12(time).split(" ")[1]}</text>
        </svg>

        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface/70 px-4 py-1.5 text-xs text-primary border border-border">
          <Moon className="h-3.5 w-3.5" /> Bedtime
        </div>

        <div className="mt-6 flex items-center justify-between w-full max-w-xs text-muted-foreground text-xs">
          <span className="flex items-center gap-1"><Moon className="h-3 w-3" /> 00:00</span>
          <span className="flex items-center gap-1"><Sun className="h-3 w-3" /> 12:00</span>
        </div>
      </div>

      <div className="px-6 pb-6 safe-bottom space-y-4">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center text-primary"><Brain className="h-5 w-5" /></div>
          <p className="text-xs text-muted-foreground leading-relaxed">7–8 hours of sleep improves focus, mood and productivity.</p>
        </div>
        <Button onClick={next} disabled={update.isPending} className="w-full h-14 rounded-full bg-gradient-purple shadow-glow text-base">
          Continue <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </main>
  );
}
