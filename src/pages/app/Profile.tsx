import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useTranslation } from "@/hooks/useTranslation";
import { ScreenHeader } from "@/components/app/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Sparkles, BarChart3, Calendar, Moon, BellRing, Camera,
  Trophy, Loader2, Pencil, Cake, Languages,
} from "lucide-react";
import { formatTime12 } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/app/Avatar";
import { TimeDial } from "@/components/app/TimeDial";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import type { Lang } from "@/lib/i18n";

export default function Profile() {
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [sleep, setSleep] = useState(profile?.sleep_time ?? "22:30");
  const [wake, setWake] = useState(profile?.wake_time ?? "07:00");
  const [dobOpen, setDobOpen] = useState(false);
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      await update.mutateAsync({ avatar_url: pub.publicUrl });
      toast.success(t("profilePictureUpdated"));
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
      toast.success(t("scheduleUpdated"));
      setScheduleOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function openSchedule() {
    setSleep(profile?.sleep_time ?? "22:30");
    setWake(profile?.wake_time ?? "07:00");
    setScheduleOpen(true);
  }

  function openDob() {
    if (profile?.birth_date) {
      const [yy, mm, dd] = profile.birth_date.split("-");
      setY(yy);
      setM(mm);
      setD(dd);
    } else {
      setY("");
      setM("");
      setD("");
    }
    setDobOpen(true);
  }

  async function saveDob() {
    const dn = +d,
      mn = +m,
      yn = +y;
    if (
      !dn ||
      !mn ||
      !yn ||
      mn < 1 ||
      mn > 12 ||
      dn < 1 ||
      dn > 31 ||
      yn < 1900 ||
      yn > new Date().getFullYear()
    ) {
      toast.error(t("invalidDate"));
      return;
    }
    const iso = `${yn}-${String(mn).padStart(2, "0")}-${String(dn).padStart(2, "0")}`;
    try {
      await update.mutateAsync({ birth_date: iso } as any);
      toast.success(t("save"));
      setDobOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function toggleLang() {
    const next: Lang = lang === "en" ? "bn" : "en";
    try {
      await update.mutateAsync({ language: next } as any);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <main className="pb-10">
      <ScreenHeader title={t("profile")} onBack={() => navigate("/home")} />
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
          <p className="font-semibold pt-1">{profile?.name ?? t("you")}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {profile?.focus_areas?.join(" · ") || t("setFocusAreas")}
          </p>
        </div>

        <button onClick={openSchedule} className="glass rounded-2xl p-4 w-full text-left">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">{t("sleepSchedule")}</p>
            <Pencil className="h-4 w-4 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              {profile ? formatTime12(profile.sleep_time) : "—"}
            </div>
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              {profile ? formatTime12(profile.wake_time) : "—"}
            </div>
          </div>
        </button>

        <button onClick={openDob} className="glass rounded-2xl p-4 w-full text-left">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Cake className="h-4 w-4 text-primary" /> {t("birthDate")}
            </p>
            <Pencil className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {profile?.birth_date ?? t("notSetTapToAdd")}
          </p>
        </button>

        <button onClick={toggleLang} className="glass rounded-2xl p-4 w-full text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" /> {t("language")}
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-surface-elevated">
              {lang === "en" ? t("english") : t("bangla")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("tapToSwitch")}</p>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <NavCard icon={Trophy} label={t("leaderboard")} onClick={() => navigate("/leaderboard")} />
          <NavCard icon={BarChart3} label={t("credibility")} onClick={() => navigate("/credibility")} />
          <NavCard icon={Sparkles} label={t("patterns")} onClick={() => navigate("/patterns")} />
          <NavCard icon={Calendar} label={t("weeklyDebrief")} onClick={() => navigate("/debrief")} />
          <NavCard icon={BellRing} label={t("reminders")} onClick={() => navigate("/reminder")} />
        </div>

        <Button variant="outline" onClick={signOut} className="w-full h-12 rounded-full">
          <LogOut className="h-4 w-4 mr-2" /> {t("signOut")}
        </Button>
      </div>

      <Sheet open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <SheetContent side="bottom" className="bg-surface border-border rounded-t-3xl max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("editSleepSchedule")}</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-1 gap-6 py-4">
            <TimeDial value={sleep} onChange={setSleep} variant="sleep" />
            <TimeDial value={wake} onChange={setWake} variant="wake" />
          </div>
          <Button
            onClick={saveSchedule}
            disabled={update.isPending}
            className="w-full h-12 rounded-full bg-gradient-purple shadow-glow"
          >
            {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("save")}
          </Button>
        </SheetContent>
      </Sheet>

      <Sheet open={dobOpen} onOpenChange={setDobOpen}>
        <SheetContent side="bottom" className="bg-surface border-border rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>{t("askDob")}</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-2 py-4">
            <div>
              <label className="text-xs text-muted-foreground">{t("day")}</label>
              <Input
                inputMode="numeric"
                placeholder="DD"
                value={d}
                onChange={(e) => setD(e.target.value.replace(/\D/g, "").slice(0, 2))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("month")}</label>
              <Input
                inputMode="numeric"
                placeholder="MM"
                value={m}
                onChange={(e) => setM(e.target.value.replace(/\D/g, "").slice(0, 2))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("year")}</label>
              <Input
                inputMode="numeric"
                placeholder="YYYY"
                value={y}
                onChange={(e) => setY(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            </div>
          </div>
          <Button
            onClick={saveDob}
            disabled={update.isPending}
            className="w-full h-12 rounded-full bg-gradient-purple shadow-glow"
          >
            {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("save")}
          </Button>
        </SheetContent>
      </Sheet>
    </main>
  );
}

function NavCard({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glass rounded-2xl p-4 text-left">
      <Icon className="h-5 w-5 text-primary" />
      <p className="text-sm font-semibold mt-2">{label}</p>
    </button>
  );
}
