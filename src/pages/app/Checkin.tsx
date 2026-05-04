import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AiAvatar } from "@/components/app/AiAvatar";
import { Button } from "@/components/ui/button";
import { BarChart3, Mic, Plus, HelpCircle, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { todayISO } from "@/lib/format";
import { Brain, Dumbbell, FileText, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { icon: Brain, label: "Study 3 chapters of Machine Learning" },
  { icon: Dumbbell, label: "Workout + eat healthy" },
  { icon: FileText, label: "Finish project proposal" },
  { icon: BookOpen, label: "Read for 30 minutes" },
];

export default function Checkin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "What do you want to accomplish tomorrow?" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [generating, setGenerating] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput("");
    const newMsgs: Msg[] = [...messages, { role: "user", content }];
    setMessages(newMsgs);
    setStreaming(true);

    let acc = "";
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: newMsgs, mode: "checkin" }),
      });
      if (resp.status === 429) { toast.error("Too many requests, slow down a moment."); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted. Add credits in Workspace > Usage."); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let done = false;
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) { acc += c; setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m)); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      toast.error(e.message ?? "Chat failed");
    } finally {
      setStreaming(false);
    }
  }

  async function generatePlan() {
    if (messages.length < 2) { toast.error("Tell the AI what you want to accomplish first."); return; }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-plan", { body: { messages } });
      if (error) throw error;
      const tasks = (data?.tasks ?? []) as any[];
      if (!tasks.length) throw new Error("Empty plan");

      // store the conversation
      await supabase.from("checkins").insert({
        user_id: user!.id, kind: "night",
        messages, summary: data?.summary ?? null,
      });

      // clear today's pending tasks then insert new ones
      await supabase.from("tasks").delete().eq("user_id", user!.id).eq("scheduled_for", todayISO()).eq("status", "pending");
      const rows = tasks.map((t, i) => ({
        user_id: user!.id,
        title: t.title, description: t.description ?? null,
        icon: t.icon ?? "target",
        duration_minutes: t.duration_minutes ?? 30,
        priority: t.priority ?? "medium",
        energy: t.energy ?? "medium",
        scheduled_for: todayISO(), sort_order: i,
        starred: t.priority === "high",
      }));
      const { error: insErr } = await supabase.from("tasks").insert(rows);
      if (insErr) throw insErr;
      toast.success("Plan generated!");
      navigate("/plan");
    } catch (e: any) {
      toast.error(e.message ?? "Could not generate plan");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="flex flex-col h-[100dvh] pb-24">
      <header className="px-5 pt-4 pb-2 flex items-center justify-between safe-top">
        <button className="h-10 w-10 rounded-full glass grid place-items-center" aria-label="Sparkles"><Sparkles className="h-4 w-4 text-primary" /></button>
        <div className="text-center">
          <h1 className="text-xl font-semibold"><span>Night </span><span className="gradient-text">Check-in</span></h1>
          <p className="text-xs text-muted-foreground">Plan tonight, win tomorrow.</p>
        </div>
        <button className="h-10 w-10 rounded-full glass grid place-items-center" aria-label="Stats"><BarChart3 className="h-4 w-4 text-primary" /></button>
      </header>

      <div ref={scroller} className="flex-1 overflow-y-auto px-5 space-y-4 hide-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 animate-fade-in-up ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && <AiAvatar size={36} />}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-gradient-purple text-white shadow-glow" : "glass"}`}>
              {m.role === "assistant" && <p className="text-[11px] font-semibold text-primary mb-1">NightMind AI</p>}
              <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_ul]:my-1"><ReactMarkdown>{m.content || "…"}</ReactMarkdown></div>
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex gap-1 ml-12">
            {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-primary" style={{ animation: `typing-dot 1.2s ${i * 0.2}s infinite` }} />)}
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-center text-xs text-muted-foreground">— Examples you can try —</p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.label} onClick={() => send(s.label)} className="shrink-0 max-w-[180px] glass rounded-2xl p-3 text-left flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-medium leading-snug">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pt-3 space-y-3 bg-background/80 backdrop-blur">
        <div className="glass rounded-2xl p-2 flex items-center gap-2">
          <input
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your answer..."
            className="flex-1 bg-transparent px-3 py-2 outline-none text-sm placeholder:text-muted-foreground"
          />
          <button onClick={() => send()} disabled={streaming || !input.trim()} className="h-10 w-10 rounded-full bg-gradient-purple grid place-items-center shadow-glow disabled:opacity-40" aria-label="Send">
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex gap-2 text-xs">
          <Chip icon={Mic} label="Voice Note" />
          <Chip icon={Plus} label="Add More" />
          <Chip icon={HelpCircle} label="Not Sure" />
        </div>
        <Button onClick={generatePlan} disabled={generating || streaming} className="w-full h-12 rounded-full bg-gradient-aurora shadow-glow text-sm font-semibold">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" /> Generate AI Plan</>}
        </Button>
      </div>
    </main>
  );
}

function Chip({ icon: Icon, label }: any) {
  return (
    <button className="flex-1 flex items-center justify-center gap-1 rounded-full border border-border bg-surface/40 py-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
