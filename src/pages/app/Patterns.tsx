import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Moon, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const week = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({ d, v: [82, 30, 25, 28, 20, 35, 22][i] }));
const productive = [6, 8, 10, 12, 14, 16, 18, 20, 22].map((h, i) => ({ h: `${h}`, v: [10, 35, 80, 95, 70, 40, 30, 25, 15][i] }));

export default function Patterns() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: patterns = [], isLoading } = useQuery({
    queryKey: ["patterns", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("patterns").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <main className="pb-10">
      <ScreenHeader title="Your Patterns" subtitle="AI found these about you" right={<button className="h-9 w-9 rounded-full glass grid place-items-center">⋯</button>} />
      <div className="px-5 space-y-4">
        <Card>
          <Header title="You skip most on Mondays" subtitle="82% tasks skipped on Mondays" />
          <div className="h-32">
            <ResponsiveContainer><BarChart data={week}><XAxis dataKey="d" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} /><Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <Header title="You're most productive 10 AM – 1 PM" subtitle="Tasks completed in this window" />
          <div className="h-32">
            <ResponsiveContainer><LineChart data={productive}><XAxis dataKey="h" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis hide /><Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} /></LineChart></ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center"><Moon className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="font-semibold text-sm">You sleep late on Sundays</p>
              <p className="text-xs text-muted-foreground">Most common: 12:30 AM</p>
            </div>
          </div>
        </Card>

        {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" /> : patterns.map((p) => (
          <Card key={p.id}><Header title={p.title} subtitle={p.detail ?? ""} /></Card>
        ))}

        <div className="glass rounded-2xl p-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-primary mt-0.5" /> AI uses these patterns to build a better plan for you.
        </div>

        <Button onClick={() => navigate("/adjustment")} className="w-full h-12 rounded-full bg-gradient-purple shadow-glow">See Plan Adjustment</Button>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) { return <div className="glass rounded-2xl p-4 space-y-3">{children}</div>; }
function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-emerald-500/20 grid place-items-center text-emerald-400">✓</div>
      <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{title}</p><p className="text-xs text-muted-foreground truncate">{subtitle}</p></div>
    </div>
  );
}
