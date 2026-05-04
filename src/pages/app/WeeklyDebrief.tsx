import { ScreenHeader } from "@/components/app/ScreenHeader";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Trophy, AlertTriangle, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({ d, v: [60, 72, 80, 65, 78, 90, 85][i] }));

export default function WeeklyDebrief() {
  return (
    <main className="pb-10">
      <ScreenHeader title="Weekly Debrief" subtitle="12 May – 18 May" right={<button className="h-9 w-9 rounded-full glass grid place-items-center">⋯</button>} />
      <div className="px-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Completed" value="22" delta="+4 vs last week" positive />
          <Stat label="Skipped" value="6" delta="-2 vs last week" positive />
        </div>

        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm">Completion Rate</p>
            <p className="text-sm font-semibold gradient-text">78% <span className="text-emerald-400 text-xs">+8%</span></p>
          </div>
          <div className="h-32"><ResponsiveContainer><LineChart data={days}><XAxis dataKey="d" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis hide /><Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} /></LineChart></ResponsiveContainer></div>
        </div>

        <InsightCard icon={Trophy} title="Top Win" body="You were consistent with your morning routine!" tint="emerald" />
        <InsightCard icon={AlertTriangle} title="Biggest Blocker" body="Distractions in the afternoon on weekdays." tint="amber" />
        <InsightCard icon={Sparkles} title="AI Suggestion" body="Try blocking 2–4 PM for deep work. Your success rate will improve." tint="primary" />

        <Button onClick={() => toast.success("Export coming soon")} className="w-full h-12 rounded-full bg-gradient-purple shadow-glow"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
      </div>
    </main>
  );
}

function Stat({ label, value, delta, positive }: any) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className={`text-xs mt-0.5 ${positive ? "text-emerald-400" : "text-destructive"}`}>{delta}</p>
    </div>
  );
}
function InsightCard({ icon: Icon, title, body, tint }: any) {
  const tints: any = { emerald: "bg-emerald-500/20 text-emerald-400", amber: "bg-amber-500/20 text-amber-400", primary: "bg-primary/20 text-primary" };
  return (
    <div className="glass rounded-2xl p-4 flex items-start gap-3">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${tints[tint]}`}><Icon className="h-5 w-5" /></div>
      <div className="flex-1"><p className="font-semibold text-sm">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{body}</p></div>
    </div>
  );
}
