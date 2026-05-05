import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { AiAvatar } from "@/components/app/AiAvatar";
import { Button } from "@/components/ui/button";
import { Clock, GripVertical, ListOrdered, RefreshCw, Pencil, Check, Loader2 } from "lucide-react";
import { todayISO, formatDuration } from "@/lib/format";
import { TaskIconTile } from "@/components/app/TaskIconTile";
import brain from "@/assets/ai-brain.png";
import { toast } from "sonner";

export default function Plan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

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

  const regenerate = useMutation({
    mutationFn: async () => {
      const { data: c } = await supabase.from("checkins").select("messages").eq("user_id", user!.id).eq("kind", "night").order("created_at", { ascending: false }).limit(1).maybeSingle();
      const messages = (c?.messages as any) ?? [{ role: "user", content: "Help me plan a productive day." }];
      const { data, error } = await supabase.functions.invoke("generate-plan", { body: { messages } });
      if (error) throw error;
      const newTasks = (data?.tasks ?? []) as any[];
      await supabase.from("tasks").delete().eq("user_id", user!.id).eq("scheduled_for", todayISO()).eq("status", "pending");
      const rows = newTasks.map((t, i) => ({
        user_id: user!.id, title: t.title, description: t.description ?? null,
        icon: t.icon ?? "target", duration_minutes: t.duration_minutes ?? 30,
        priority: t.priority ?? "medium", energy: t.energy ?? "medium",
        scheduled_for: todayISO(), sort_order: i, starred: t.priority === "high",
      }));
      const { error: e2 } = await supabase.from("tasks").insert(rows);
      if (e2) throw e2;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks"] }); toast.success("Plan regenerated"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <main className="pb-32">
      <ScreenHeader title={<span><span>AI Generated </span><span className="gradient-text">Plan</span></span>} subtitle="Here's your plan for tomorrow" right={<button className="h-9 w-9 rounded-full glass grid place-items-center" aria-label="Refresh"><RefreshCw className="h-4 w-4 text-primary" /></button>} />

      <div className="px-5 space-y-5">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <AiAvatar size={44} />
          <p className="text-sm flex-1 leading-snug">Based on your goals and patterns, I've created this plan for you.</p>
          <img src={brain} alt="AI brain" width={64} height={64} className="h-16 w-16 object-contain shrink-0" />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold"><span className="h-4 w-4 rounded-sm bg-gradient-purple inline-block" /> Priority Tasks</h3>
          <button className="text-xs flex items-center gap-1 text-muted-foreground bg-surface/60 px-3 py-1.5 rounded-full"><ListOrdered className="h-3.5 w-3.5" /> Reorder</button>
        </div>

        {isLoading ? (
          <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : tasks.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-muted-foreground">No tasks yet. Run a Night Check-in.</div>
        ) : (
          <div className="space-y-3">
            {tasks.map((t, i) => {
              const dots = t.priority === "high" ? 3 : t.priority === "medium" ? 2 : 1;
              return (
                <div key={t.id} className="glass rounded-2xl p-3 flex items-stretch gap-3 border-l-2 border-primary/60">
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="h-7 w-7 rounded-full bg-primary/30 grid place-items-center text-xs font-bold text-primary">{i + 1}</div>
                  </div>
                  <TaskIconTile icon={t.icon} size={52} className="self-center" />
                  <div className="flex-1 min-w-0 self-center">
                    <p className="font-semibold truncate">{t.title}</p>
                    {t.description && <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>}
                  </div>
                  <div className="flex flex-col items-end justify-center gap-1 shrink-0">
                    <span className="text-xs flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {formatDuration(t.duration_minutes)}</span>
                    <span className="text-[11px] capitalize flex items-center gap-1">
                      <span className={t.priority === "high" ? "text-accent" : t.priority === "medium" ? "text-primary" : "text-blue-400"}>{t.priority}</span>
                      <span className="flex gap-0.5">{Array.from({ length: 3 }).map((_, j) => <span key={j} className={`h-1.5 w-1.5 rounded-full ${j < dots ? "bg-primary" : "bg-muted"}`} />)}</span>
                    </span>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground self-center" />
                </div>
              );
            })}
          </div>
        )}

        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 grid place-items-center text-primary">✦</div>
          <p className="text-xs text-muted-foreground flex-1">This plan is optimized for your energy, focus and past behavior.</p>
          <button onClick={() => navigate("/patterns")} className="text-xs text-primary font-medium">How it works? ›</button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => regenerate.mutate()} disabled={regenerate.isPending} className="flex-1 h-12 rounded-2xl">
            {regenerate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RefreshCw className="h-4 w-4 mr-1" /> Regenerate</>}
          </Button>
          <Button onClick={() => navigate("/tasks")} className="flex-[2] h-12 rounded-2xl bg-gradient-purple shadow-glow">
            Approve Plan <Check className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/tasks")} className="flex-1 h-12 rounded-2xl">
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </div>
    </main>
  );
}
