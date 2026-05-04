import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Camera, Flashlight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AiAvatar } from "@/components/app/AiAvatar";

export default function Reminder() {
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const now = new Date();
  const time = `${(now.getHours() % 12 || 12)}:${String(now.getMinutes()).padStart(2, "0")}`;
  const date = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <main className="min-h-screen flex flex-col px-6 py-10 safe-top">
      <div className="grid place-items-center mt-4"><Lock className="h-5 w-5 text-muted-foreground" /></div>
      <div className="text-center mt-6">
        <h1 className="text-7xl font-light tracking-tight">{time}</h1>
        <p className="text-muted-foreground mt-1">{date}</p>
      </div>

      <div className="glass rounded-3xl p-4 mt-10 space-y-3 animate-fade-in-up">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AiAvatar size={20} glow={false} /> NightMind <span className="ml-auto">now</span>
        </div>
        <p className="text-sm leading-relaxed">Hi {profile?.name ?? "there"} 👋, You usually complete deep work around this time. Want to start <span className="text-primary font-semibold">"Finish project proposal"</span> now?</p>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/tasks")} className="flex-1 h-11 rounded-full bg-gradient-purple shadow-glow">Start Now</Button>
          <Button onClick={() => navigate(-1)} variant="outline" className="flex-1 h-11 rounded-full">Remind Later</Button>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between px-8 pb-4">
        <button className="h-12 w-12 rounded-full bg-surface/60 grid place-items-center" aria-label="Flashlight"><Flashlight className="h-5 w-5" /></button>
        <p className="text-xs text-muted-foreground">Swipe up to open</p>
        <button className="h-12 w-12 rounded-full bg-surface/60 grid place-items-center" aria-label="Camera"><Camera className="h-5 w-5" /></button>
      </div>
    </main>
  );
}
