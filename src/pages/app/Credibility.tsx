import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { Check, Circle, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CATS = [
  { key: "completed_tasks", label: "Completed Tasks", icon: Check },
  { key: "honesty", label: "Honesty & Why Answers", icon: Check },
  { key: "makeup", label: "Makeup Plans Followed", icon: Check },
  { key: "consistency", label: "Consistency", icon: Circle },
];

export default function Credibility() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["credibility-detail", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("credibility_events").select("category, delta").eq("user_id", user!.id);
      if (error) throw error;
      const byCat: Record<string, number> = {};
      (data ?? []).forEach((e) => { byCat[e.category] = (byCat[e.category] ?? 0) + (e.delta ?? 0); });
      const total = Math.max(0, Math.min(100, 50 + (data ?? []).reduce((s, r) => s + (r.delta ?? 0), 0)));
      return { byCat, total };
    },
  });

  const score = data?.total ?? 0;
  const angle = (score / 100) * 180; // semicircle
  const r = 100;
  const cx = 130, cy = 130;
  const rad = ((angle - 180) * Math.PI) / 180;
  const ex = cx + r * Math.cos(rad);
  const ey = cy + r * Math.sin(rad);

  return (
    <main className="pb-10">
      <ScreenHeader title="Credibility Score" right={<button className="h-9 w-9 rounded-full glass grid place-items-center">⋯</button>} />
      <div className="px-5 space-y-5">
        {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mt-10" /> : (
          <>
            <div className="grid place-items-center">
              <svg viewBox="0 0 260 160" className="w-full max-w-xs">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(274 70% 58%)" />
                    <stop offset="100%" stopColor="hsl(220 80% 65%)" />
                  </linearGradient>
                </defs>
                <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="hsl(240 25% 18%)" strokeWidth="14" strokeLinecap="round" />
                <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}`} fill="none" stroke="url(#g1)" strokeWidth="14" strokeLinecap="round" />
                <text x={cx} y={cy - 10} textAnchor="middle" fontSize="48" fontWeight="700" fill="white">{score}</text>
                <text x={cx} y={cy + 20} textAnchor="middle" fontSize="14" fill="hsl(248 65% 75%)">{score >= 80 ? "Great" : score >= 60 ? "Good" : "Build it up"}</text>
                <text x="20" y="155" fontSize="11" fill="hsl(240 10% 60%)">0</text>
                <text x="240" y="155" fontSize="11" fill="hsl(240 10% 60%)">100</text>
              </svg>
              <p className="text-xs text-muted-foreground -mt-2">You're doing better than 85% of NightMind users 🔥</p>
            </div>

            <div className="glass rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-sm">Score Breakdown</h3>
              {CATS.map((c) => {
                const Icon = c.icon;
                const v = data?.byCat[c.key] ?? 0;
                const positive = v >= 0;
                return (
                  <div key={c.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-primary" /> {c.label}</div>
                    <span className={`text-sm font-semibold ${positive ? "text-emerald-400" : "text-destructive"}`}>{positive ? "+" : ""}{v}</span>
                  </div>
                );
              })}
            </div>

            <div className="glass rounded-2xl p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/20 grid place-items-center text-primary"><Trophy className="h-4 w-4" /></div>
              <p className="text-xs leading-relaxed"><span className="font-semibold">Keep it up!</span><br /><span className="text-muted-foreground">Honesty builds more progress than perfection.</span></p>
            </div>

            <button className="w-full text-center text-sm text-primary font-medium glass rounded-full py-3">How Credibility Score Works? ›</button>

            <Button onClick={() => navigate("/patterns")} className="w-full h-12 rounded-full bg-gradient-purple shadow-glow">View My Patterns</Button>
          </>
        )}
      </div>
    </main>
  );
}
