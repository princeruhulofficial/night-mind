import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Moon, Sun, MoreVertical, Loader2, Trophy, Crown } from "lucide-react";
import { todayISO, formatDuration, greeting } from "@/lib/format";
import { TaskIconTile } from "@/components/app/TaskIconTile";
import { UserAvatar } from "@/components/app/Avatar";

export default function Home() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`home-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` }, () => {
        qc.invalidateQueries({ queryKey: ["tasks"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "credibility_events", filter: `user_id=eq.${user.id}` }, () => {
        qc.invalidateQueries({ queryKey: ["credibility"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", "today", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks").select("*")
        .eq("user_id", user!.id).eq("scheduled_for", todayISO())
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: cred } = useQuery({
    queryKey: ["credibility", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("credibility_events").select("delta").eq("user_id", user!.id);
      if (error) throw error;
      const total = (data ?? []).reduce((s, r) => s + (r.delta ?? 0), 0);
      return Math.max(0, Math.min(100, 50 + total));
    },
  });

  const { data: leaders = [] } = useQuery({
    queryKey: ["leaderboard", "top3"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_leaderboard");
      if (error) throw error;
      return ((data ?? []) as any[]).slice(0, 3);
    },
  });

  const completed = tasks.filter((t) => t.status === "done").length;
  const top3 = tasks.slice(0, 3);
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const name = profile?.name ?? "";

  return (
    <main className="px-5 pt-6 pb-4 safe-top space-y-5 animate-fade-in-up">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-tight">{greeting()},</h1>
          <h2 className="text-2xl font-bold gradient-text">{name} ☀️</h2>
          <p className="text-xs text-muted-foreground mt-1">Plan ready. Start with clarity.</p>
        </div>
        <button onClick={() => navigate("/profile")} aria-label="Profile">
          <UserAvatar name={profile?.name} url={profile?.avatar_url} size={48} />
        </button>
      </header>

      <div className="glass rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center"><Moon className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Sleep Insight</p>
            <p className="font-semibold text-sm">You slept 6h 20m</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Good</span>
      </div>

      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h3 className="font-semibold">Today's Plan</h3>
            <p className="text-xs text-muted-foreground">Top 3 Priority Tasks</p>
          </div>
          <span className="text-sm text-primary font-semibold">{progress}%</span>
        </div>

        {isLoading ? (
          <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : top3.length === 0 ? (
          <EmptyTasks onGenerate={() => navigate("/checkin")} />
        ) : (
          <div className="space-y-3">
            {top3.map((t, i) => {
              const active = i === 0 && t.status !== "done";
              return (
                <div key={t.id} className={`rounded-2xl p-4 flex items-center gap-3 border ${active ? "bg-gradient-purple/20 border-primary shadow-glow" : "glass"}`}>
                  <TaskIconTile icon={t.icon} size={52} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDuration(t.duration_minutes)} · <span className="capitalize">{t.energy}</span> Energy</p>
                  </div>
                  <button className="text-muted-foreground p-1" aria-label="More"><MoreVertical className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {leaders.length > 0 && (
        <button onClick={() => navigate("/leaderboard")} className="glass rounded-2xl p-4 w-full text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-accent" /><p className="font-semibold text-sm">Top performers</p></div>
            <span className="text-xs text-primary">View all ›</span>
          </div>
          <div className="flex items-center gap-3">
            {leaders.map((l: any, i: number) => (
              <div key={l.user_id} className="flex items-center gap-2 flex-1 min-w-0">
                <div className="relative">
                  <UserAvatar name={l.name} url={l.avatar_url} size={36} />
                  {i === 0 && <Crown className="h-3.5 w-3.5 text-accent absolute -top-2 left-1/2 -translate-x-1/2 fill-accent" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">#{l.rank} {l.user_id === user?.id ? "You" : l.name}</p>
                  <p className="text-[10px] text-muted-foreground">{l.completed_week} done</p>
                </div>
              </div>
            ))}
          </div>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Progress</p>
          <p className="text-sm font-semibold mt-0.5">{completed} of {tasks.length} completed</p>
          <div className="mt-2 text-2xl font-bold text-primary">{progress}%</div>
        </div>
        <button onClick={() => navigate("/credibility")} className="glass rounded-2xl p-4 text-left">
          <p className="text-xs text-muted-foreground">Credibility Score</p>
          <p className="text-2xl font-bold gradient-text mt-1">{cred ?? "--"} <span className="text-xs text-emerald-400">+6</span></p>
          <p className="text-[10px] text-muted-foreground mt-1">Great consistency yesterday!</p>
        </button>
      </div>

      <Button onClick={() => navigate("/tasks")} className="w-full h-14 rounded-full bg-gradient-purple shadow-glow text-base">
        View Full Plan
      </Button>
    </main>
  );
}

function EmptyTasks({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="glass rounded-2xl p-6 text-center space-y-3">
      <p className="text-sm text-muted-foreground">No plan yet for today.</p>
      <Button onClick={onGenerate} className="bg-gradient-purple shadow-glow rounded-full px-6">Start Night Check-in</Button>
    </div>
  );
}
