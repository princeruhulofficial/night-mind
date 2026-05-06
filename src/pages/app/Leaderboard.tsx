import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { UserAvatar } from "@/components/app/Avatar";
import { Trophy, Crown, Loader2, Flame } from "lucide-react";

type Row = { user_id: string; name: string; avatar_url: string | null; completed_week: number; completed_total: number; rank: number };

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase.rpc("get_leaderboard");
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  useEffect(() => {
    let cancelled = false;
    const ch = supabase.channel(`leaderboard-tasks-${Math.random().toString(36).slice(2)}`);
    ch.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      () => { if (!cancelled) qc.invalidateQueries({ queryKey: ["leaderboard"] }); },
    ).subscribe();
    return () => {
      cancelled = true;
      ch.unsubscribe().finally(() => { supabase.removeChannel(ch); });
    };
  }, [qc]);

  const me = rows.find((r) => r.user_id === user?.id);
  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <main className="pb-20">
      <ScreenHeader title={<span>Leader<span className="gradient-text">board</span></span>} subtitle="Top performers this week" onBack={() => navigate(-1)} />

      {isLoading ? (
        <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : rows.length === 0 ? (
        <div className="px-5"><div className="glass rounded-2xl p-6 text-center text-muted-foreground">No data yet. Be the first to complete tasks!</div></div>
      ) : (
        <div className="px-5 space-y-5">
          {/* Podium */}
          <div className="glass rounded-3xl p-5 grid grid-cols-3 gap-3 items-end">
            {[top3[1], top3[0], top3[2]].map((r, i) => {
              if (!r) return <div key={i} />;
              const isFirst = r.rank === 1;
              const heights = [80, 110, 70];
              return (
                <div key={r.user_id} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <UserAvatar name={r.name} url={r.avatar_url} size={isFirst ? 64 : 52} />
                    {isFirst && <Crown className="h-5 w-5 text-accent absolute -top-3 left-1/2 -translate-x-1/2 fill-accent" />}
                  </div>
                  <p className="text-xs font-semibold truncate max-w-[80px] text-center">{r.name}</p>
                  <div
                    className={`w-full rounded-t-xl flex flex-col items-center justify-center text-xs font-bold ${isFirst ? "bg-gradient-purple text-white shadow-glow" : "bg-surface-elevated text-primary"}`}
                    style={{ height: heights[i] }}
                  >
                    <span className="text-lg">#{r.rank}</span>
                    <span className="text-[10px] opacity-80">{r.completed_week} done</span>
                  </div>
                </div>
              );
            })}
          </div>

          {me && me.rank > 3 && (
            <div className="glass rounded-2xl p-3 flex items-center gap-3 border border-primary/40 shadow-glow-soft">
              <div className="h-10 w-10 rounded-full bg-gradient-purple grid place-items-center font-bold">{me.rank}</div>
              <UserAvatar name={me.name} url={me.avatar_url} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">You</p>
                <p className="text-xs text-muted-foreground">{me.completed_week} this week · {me.completed_total} total</p>
              </div>
              <Flame className="h-4 w-4 text-accent" />
            </div>
          )}

          {rest.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground px-1">All rankings</h3>
              {rest.map((r) => {
                const mine = r.user_id === user?.id;
                return (
                  <div key={r.user_id} className={`rounded-2xl p-3 flex items-center gap-3 ${mine ? "bg-gradient-purple/15 border border-primary" : "glass"}`}>
                    <span className="w-7 text-center text-sm font-bold text-muted-foreground">{r.rank}</span>
                    <UserAvatar name={r.name} url={r.avatar_url} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{mine ? "You" : r.name}</p>
                      <p className="text-[11px] text-muted-foreground">{r.completed_week} this week</p>
                    </div>
                    <span className="text-xs text-primary font-semibold">{r.completed_total}</span>
                    <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                );
              })}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
