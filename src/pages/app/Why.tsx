import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { AiAvatar } from "@/components/app/AiAvatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Mic, Send, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const REASONS = [
  "I didn't have enough time",
  "I got distracted",
  "It wasn't a priority for me",
  "I didn't feel like doing it",
  "Other reason",
];

export default function Why() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { taskId, taskTitle } = location.state ?? {};
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!reason && !detail.trim()) { toast.error("Pick a reason or write one"); return; }
    setBusy(true);
    try {
      await supabase.from("why_answers").insert({
        user_id: user!.id, task_id: taskId ?? null,
        reason: reason ?? "Other reason", detail: detail.trim() || null,
      });
      // Reward honesty
      await supabase.from("credibility_events").insert({ user_id: user!.id, category: "honesty", delta: 2, note: reason });
      toast.success("Thanks for the honesty");
      navigate("/adjustment");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="pb-10 min-h-screen flex flex-col">
      <ScreenHeader title="AI Check-in" subtitle="9:41 PM" right={<button className="h-9 w-9 rounded-full glass grid place-items-center">⋯</button>} />
      <div className="px-5 flex-1 space-y-5">
        <div className="grid place-items-center"><AiAvatar size={80} /></div>
        <div className="glass rounded-2xl p-4">
          <p className="text-sm leading-relaxed">I noticed you didn't complete <span className="text-primary font-semibold">"{taskTitle ?? "your task"}"</span>. What got in the way?</p>
        </div>

        <div className="space-y-2">
          {REASONS.map((r) => (
            <button key={r} onClick={() => setReason(r)} className={`w-full text-left rounded-2xl p-3.5 border transition ${reason === r ? "bg-gradient-purple/20 border-primary shadow-glow" : "glass"}`}>
              <span className="text-sm">{r}</span>
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-2 flex items-center gap-2">
          <button className="h-9 w-9 rounded-full bg-surface grid place-items-center text-primary" aria-label="Mic"><Mic className="h-4 w-4" /></button>
          <input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Type your answer..." className="flex-1 bg-transparent outline-none text-sm py-2 placeholder:text-muted-foreground" />
          <button onClick={submit} disabled={busy} className="h-9 w-9 rounded-full bg-gradient-purple grid place-items-center shadow-glow" aria-label="Send">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        <div className="glass rounded-2xl p-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-primary mt-0.5" /> Your answer helps me adjust tomorrow's plan for you.
        </div>

        <Button onClick={submit} disabled={busy} className="w-full h-12 rounded-full bg-gradient-purple shadow-glow">Send</Button>
      </div>
    </main>
  );
}
