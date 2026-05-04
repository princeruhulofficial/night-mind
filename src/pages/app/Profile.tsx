import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Sparkles, BarChart3, Calendar, Moon, BellRing } from "lucide-react";
import { formatTime12 } from "@/lib/format";

export default function Profile() {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  return (
    <main className="pb-10">
      <ScreenHeader title="Profile" onBack={() => navigate("/home")} />
      <div className="px-5 space-y-4">
        <div className="glass rounded-2xl p-5 text-center space-y-2">
          <div className="h-20 w-20 rounded-full bg-gradient-purple mx-auto grid place-items-center text-2xl font-bold shadow-glow">{(profile?.name ?? "U")[0]?.toUpperCase()}</div>
          <p className="font-semibold">{profile?.name ?? "You"}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile?.focus_areas?.join(" · ") || "Set your focus areas"}</p>
        </div>

        <div className="glass rounded-2xl p-4 space-y-3">
          <Row icon={Moon} label="Bedtime" value={profile ? formatTime12(profile.sleep_time) : "—"} />
          <Row icon={BellRing} label="Wake-up" value={profile ? formatTime12(profile.wake_time) : "—"} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NavCard icon={BarChart3} label="Credibility" onClick={() => navigate("/credibility")} />
          <NavCard icon={Sparkles} label="Patterns" onClick={() => navigate("/patterns")} />
          <NavCard icon={Calendar} label="Weekly Debrief" onClick={() => navigate("/debrief")} />
          <NavCard icon={BellRing} label="Reminder Demo" onClick={() => navigate("/reminder")} />
        </div>

        <Button variant="outline" onClick={signOut} className="w-full h-12 rounded-full"><LogOut className="h-4 w-4 mr-2" /> Sign out</Button>
      </div>
    </main>
  );
}
function Row({ icon: Icon, label, value }: any) {
  return <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-primary" />{label}</div><span className="text-sm font-semibold">{value}</span></div>;
}
function NavCard({ icon: Icon, label, onClick }: any) {
  return <button onClick={onClick} className="glass rounded-2xl p-4 text-left"><Icon className="h-5 w-5 text-primary" /><p className="text-sm font-semibold mt-2">{label}</p></button>;
}
