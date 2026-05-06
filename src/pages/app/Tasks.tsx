import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Star, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { todayISO, formatDuration } from "@/lib/format";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TaskIconTile } from "@/components/app/TaskIconTile";

const FILTERS = ["All", "High", "Medium", "Low"] as const;
type Filter = typeof FILTERS[number];

export default function Tasks() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const ch = supabase.channel(`tasks-${user.id}-${Math.random().toString(36).slice(2)}`);
    ch.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
      () => { if (!cancelled) qc.invalidateQueries({ queryKey: ["tasks"] }); },
    ).subscribe();
    return () => {
      cancelled = true;
      ch.unsubscribe().finally(() => { supabase.removeChannel(ch); });
    };
  }, [user, qc]);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", "today", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*")
        .eq("user_id", user!.id).eq("scheduled_for", todayISO()).order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => filter === "All" ? tasks : tasks.filter((t) => t.priority === filter.toLowerCase()), [tasks, filter]);
  const high = filtered.filter((t) => t.priority === "high");
  const others = filtered.filter((t) => t.priority !== "high");
  const completed = tasks.filter((t) => t.status === "done").length;

  const toggleDone = useMutation({
    mutationFn: async (t: any) => {
      const newStatus = t.status === "done" ? "pending" : "done";
      const { error } = await supabase.from("tasks").update({
        status: newStatus,
        completed_at: newStatus === "done" ? new Date().toISOString() : null,
      }).eq("id", t.id);
      if (error) throw error;
      if (newStatus === "done") {
        await supabase.from("credibility_events").insert({
          user_id: user!.id, category: "completed_tasks", delta: 3, note: t.title,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["credibility"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const skip = useMutation({
    mutationFn: async (t: any) => {
      const { error } = await supabase.from("tasks").update({ status: "skipped" }).eq("id", t.id);
      if (error) throw error;
      return t;
    },
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      navigate("/why", { state: { taskId: t.id, taskTitle: t.title } });
    },
  });

  return (
    <main className="px-5 pt-6 pb-4 safe-top space-y-4 animate-fade-in-up">
      <header className="text-center">
        <h1 className="text-xl font-semibold">Today's Plan</h1>
        <p className="text-xs text-muted-foreground">{tasks.length} tasks</p>
      </header>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition border ${filter === f ? "bg-gradient-purple text-white border-transparent shadow-glow" : "bg-surface/60 border-border text-muted-foreground"}`}>
            {f}
          </button>
        ))}
      </div>

      {isLoading ? <CenterSpin /> : (
        <>
          {high.length > 0 && (
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="h-4 w-4" /> High Priority</h3>
              {high.map((t, i) => <TaskRow key={t.id} t={t} active={i === 0 && t.status === "pending"} onToggle={() => toggleDone.mutate(t)} onSkip={() => skip.mutate(t)} />)}
            </section>
          )}
          {others.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">+ Other Tasks</h3>
              {others.map((t) => <TaskRow key={t.id} t={t} active={false} onToggle={() => toggleDone.mutate(t)} onSkip={() => skip.mutate(t)} />)}
            </section>
          )}
          {tasks.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center space-y-3">
              <p className="text-muted-foreground">Nothing planned. Run a Night Check-in to generate your day.</p>
              <Button onClick={() => navigate("/checkin")} className="bg-gradient-purple shadow-glow rounded-full">Start Check-in</Button>
            </div>
          )}
        </>
      )}

      <div className="glass rounded-2xl p-4 mt-2">
        <div className="flex justify-between text-xs mb-2"><span>{completed} of {tasks.length} completed</span><span>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</span></div>
        <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
          <div className="h-full bg-gradient-purple transition-all" style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }} />
        </div>
      </div>
    </main>
  );
}

function TaskRow({ t, active, onToggle, onSkip }: any) {
  const done = t.status === "done";
  return (
    <div className={`rounded-2xl p-4 border ${active ? "bg-gradient-purple/15 border-primary shadow-glow" : "glass"}`}>
      <div className="flex items-center gap-3">
        <button onClick={onToggle} aria-label="Toggle done" className={`h-6 w-6 rounded-full border-2 grid place-items-center transition ${done ? "bg-gradient-purple border-transparent" : "border-muted-foreground"}`}>
          {done && <Check className="h-3.5 w-3.5 text-white" />}
        </button>
        <TaskIconTile icon={t.icon} size={42} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${done ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
          <p className="text-xs text-muted-foreground">{formatDuration(t.duration_minutes)} · <span className="capitalize">{t.energy}</span> Energy</p>
        </div>
        <Star className={`h-4 w-4 ${t.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </div>
      {active && (
        <div className="flex gap-2 mt-3">
          <Button onClick={onToggle} className="flex-1 h-10 rounded-xl bg-gradient-purple shadow-glow">Mark as done</Button>
          <Button onClick={onSkip} variant="outline" className="h-10 rounded-xl">Skip</Button>
        </div>
      )}
    </div>
  );
}

function CenterSpin() { return <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>; }
