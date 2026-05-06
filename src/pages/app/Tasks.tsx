import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Star, Check, Loader2, Bell, BellOff, Mic, MicOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { todayISO, formatDuration } from "@/lib/format";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TaskIconTile } from "@/components/app/TaskIconTile";
import { scheduleReminder, cancelReminder } from "@/lib/notifications";
import { useVoiceInput } from "@/hooks/useVoiceInput";

const FILTERS = ["All", "High", "Medium", "Low"] as const;
type Filter = typeof FILTERS[number];

export default function Tasks() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("All");
  const [openTask, setOpenTask] = useState<any | null>(null);

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
        await cancelReminder(t.id);
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
      await cancelReminder(t.id);
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
        <p className="text-xs text-muted-foreground">{tasks.length} tasks · tap any task for details</p>
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
              {high.map((t, i) => <TaskRow key={t.id} t={t} active={i === 0 && t.status === "pending"} onOpen={() => setOpenTask(t)} onToggle={() => toggleDone.mutate(t)} onSkip={() => skip.mutate(t)} />)}
            </section>
          )}
          {others.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">+ Other Tasks</h3>
              {others.map((t) => <TaskRow key={t.id} t={t} active={false} onOpen={() => setOpenTask(t)} onToggle={() => toggleDone.mutate(t)} onSkip={() => skip.mutate(t)} />)}
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

      <TaskDetailDialog
        task={openTask}
        onClose={() => setOpenTask(null)}
        onToggle={(t) => toggleDone.mutate(t)}
        onSkip={(t) => skip.mutate(t)}
      />
    </main>
  );
}

function TaskRow({ t, active, onOpen, onToggle, onSkip }: any) {
  const done = t.status === "done";
  return (
    <div className={`rounded-2xl p-4 border ${active ? "bg-gradient-purple/15 border-primary shadow-glow" : "glass"}`}>
      <div className="flex items-center gap-3">
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label="Toggle done" className={`h-6 w-6 rounded-full border-2 grid place-items-center transition ${done ? "bg-gradient-purple border-transparent" : "border-muted-foreground"}`}>
          {done && <Check className="h-3.5 w-3.5 text-white" />}
        </button>
        <button onClick={onOpen} className="flex-1 flex items-center gap-3 text-left min-w-0">
          <TaskIconTile icon={t.icon} size={42} />
          <div className="flex-1 min-w-0">
            <p className={`font-semibold truncate ${done ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {formatDuration(t.duration_minutes)} · <span className="capitalize">{t.energy}</span> Energy
              {t.reminder_at && <><span>·</span><Bell className="h-3 w-3 text-primary" /></>}
            </p>
          </div>
          <Star className={`h-4 w-4 ${t.starred ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
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

function TaskDetailDialog({ task, onClose, onToggle, onSkip }: any) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState(""); // HH:mm
  const [saving, setSaving] = useState(false);
  const voice = useVoiceInput({
    onResult: (text) => setDescription((d) => (d ? d + " " : "") + text),
  });

  useEffect(() => {
    if (!task) return;
    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
    if (task.reminder_at) {
      const d = new Date(task.reminder_at);
      setReminderTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    } else setReminderTime("");
  }, [task]);

  if (!task) return null;
  const done = task.status === "done";

  async function save() {
    setSaving(true);
    try {
      let reminderIso: string | null = null;
      if (reminderTime) {
        const [h, m] = reminderTime.split(":").map(Number);
        const at = new Date();
        at.setHours(h, m, 0, 0);
        if (at.getTime() < Date.now()) at.setDate(at.getDate() + 1);
        reminderIso = at.toISOString();
        await scheduleReminder({
          id: task.id,
          title: `⏰ ${title}`,
          body: description || "Time to focus on this task.",
          at,
        });
      } else {
        await cancelReminder(task.id);
      }
      const { error } = await supabase.from("tasks").update({
        title, description: description || null, reminder_at: reminderIso,
      }).eq("id", task.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(reminderIso ? "Reminder set" : "Saved");
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-surface border-border max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TaskIconTile icon={task.icon} size={36} />
            <span className="truncate">Task details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs text-muted-foreground">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Notes</label>
              {voice.supported && (
                <button
                  onClick={() => (voice.listening ? voice.stop() : voice.start())}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${voice.listening ? "bg-primary/20 text-primary animate-pulse" : "bg-surface-elevated text-muted-foreground"}`}
                >
                  {voice.listening ? <><MicOff className="h-3 w-3" /> Stop</> : <><Mic className="h-3 w-3" /> Voice</>}
                </button>
              )}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={voice.supported ? "Type or use voice…" : "Type details…"}
              className="mt-1 w-full rounded-xl bg-surface-elevated border border-border p-3 text-sm outline-none focus:border-primary"
            />
            {voice.listening && voice.transcript && (
              <p className="text-xs text-primary mt-1 italic">🎙️ {voice.transcript}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Reminder time</label>
            <div className="flex gap-2 mt-1">
              <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="flex-1" />
              {reminderTime && (
                <Button variant="outline" size="icon" onClick={() => setReminderTime("")} aria-label="Clear">
                  <BellOff className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {reminderTime ? `You'll be reminded at ${reminderTime} today.` : "No reminder set."}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            {formatDuration(task.duration_minutes)} · <span className="capitalize">{task.energy}</span> energy · <span className="capitalize">{task.priority}</span> priority
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => onToggle(task)} variant="outline" className="flex-1 rounded-full">
              {done ? "Mark undone" : "Mark done"}
            </Button>
            {!done && (
              <Button onClick={() => { onSkip(task); onClose(); }} variant="outline" className="rounded-full">Skip</Button>
            )}
          </div>
          <Button onClick={save} disabled={saving} className="w-full h-11 rounded-full bg-gradient-purple shadow-glow">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CenterSpin() { return <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>; }
