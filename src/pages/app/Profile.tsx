import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { LogOut, Sparkles, BarChart3, Calendar, Moon, BellRing, Camera, Trophy, Loader2, Pencil } from "lucide-react";
import { formatTime12 } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/app/Avatar";
import { TimeDial } from "@/components/app/TimeDial";
import { toast } from "sonner";

export default function Profile() {
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [sleep, setSleep] = useState(profile?.sleep_time ?? "22:30");
  const [wake, setWake] = useState(profile?.wake_time ?? "07:00");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      await update.mutateAsync({ avatar_url: pub.publicUrl });
      toast.success("Profile picture updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveSchedule() {
    try {
      await update.mutateAsync({ sleep_time: sleep, wake_time: wake });
      toast.success("Schedule updated");
      setScheduleOpen(false);
    } catch (e: any) { toast.error(e.message); }
  }

  function openSchedule() {
    setSleep(profile?.sleep_time ?? "22:30");
    setWake(profile?.wake_time ?? "07:00");
    setScheduleOpen(true);
  }

  return (
    <main className="pb-10">
      <ScreenHeader title="Profile" onBack={() => navigate("/home")} />
      <div className="px-5 space-y-4">
        <div className="glass rounded-2xl p-5 text-center space-y-2">
          <div className="relative w-fit mx-auto">
            <UserAvatar name={profile?.name} url={profile?.avatar_url} size={88} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-purple grid place-items-center shadow-glow border-2 border-background"
              aria-label="Change picture"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          </div>
          <p className="font-semibold pt-1">{profile?.name ?? "You"}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile?.focus_areas?.join(" · ") || "Set your focus areas"}</p>
        </div>

        <button onClick={openSchedule} className="glass rounded-2xl p-4 w-full text-left">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Sleep schedule</p>
            <Pencil className="h-4 w-4 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2"><Moon className="h-4 w-4 text-primary" />{profile ? formatTime12(profile.sleep_time) : "—"}</div>
            <div className="flex items-center gap-2"><BellRing className="h-4 w-4 text-primary" />{profile ? formatTime12(profile.wake_time) : "—"}</div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <NavCard icon={Trophy} label="Leaderboard" onClick={() => navigate("/leaderboard")} />
          <NavCard icon={BarChart3} label="Credibility" onClick={() => navigate("/credibility")} />
          <NavCard icon={Sparkles} label="Patterns" onClick={() => navigate("/patterns")} />
          <NavCard icon={Calendar} label="Weekly Debrief" onClick={() => navigate("/debrief")} />
          <NavCard icon={BellRing} label="Reminders" onClick={() => navigate("/reminder")} />
        </div>

        <Button variant="outline" onClick={signOut} className="w-full h-12 rounded-full"><LogOut className="h-4 w-4 mr-2" /> Sign out</Button>
      </div>

      <Sheet open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <SheetContent side="bottom" className="bg-surface border-border rounded-t-3xl max-h-[90vh] overflow-y-auto">
          <SheetHeader><SheetTitle>Edit sleep schedule</SheetTitle></SheetHeader>
          <div className="grid grid-cols-1 gap-6 py-4">
            <TimeDial value={sleep} onChange={setSleep} variant="sleep" />
            <TimeDial value={wake} onChange={setWake} variant="wake" />
          </div>
          <Button onClick={saveSchedule} disabled={update.isPending} className="w-full h-12 rounded-full bg-gradient-purple shadow-glow">
            {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </SheetContent>
      </Sheet>
    </main>
  );
}
function NavCard({ icon: Icon, label, onClick }: any) {
  return <button onClick={onClick} className="glass rounded-2xl p-4 text-left"><Icon className="h-5 w-5 text-primary" /><p className="text-sm font-semibold mt-2">{label}</p></button>;
}
