import { useEffect, useState } from "react";
import { Hourglass, Languages, Smartphone } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useLifeClock } from "@/hooks/useLifeClock";
import { tr, type Lang } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function bnNum(n: number | string) {
  const map = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return String(n).replace(/\d/g, (d) => map[+d]);
}

export function LifeClock() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const lang: Lang = (profile?.language as Lang) ?? "en";
  const parts = useLifeClock(profile?.birth_date ?? null);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState(""); const [m, setM] = useState(""); const [y, setY] = useState("");
  const [showHomeHint, setShowHomeHint] = useState(false);

  // Auto-prompt once if birth_date missing
  useEffect(() => {
    if (profile && !profile.birth_date) {
      const dismissed = localStorage.getItem("nm_dob_dismissed");
      if (!dismissed) setOpen(true);
    }
  }, [profile]);

  const fmt = (n: number) => (lang === "bn" ? bnNum(n) : n);

  async function save() {
    const dn = +d, mn = +m, yn = +y;
    if (!dn || !mn || !yn || mn < 1 || mn > 12 || dn < 1 || dn > 31 || yn < 1900 || yn > new Date().getFullYear()) {
      toast.error(tr(lang, "invalidDate")); return;
    }
    const iso = `${yn}-${String(mn).padStart(2,"0")}-${String(dn).padStart(2,"0")}`;
    try {
      await update.mutateAsync({ birth_date: iso } as any);
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  }

  function dismiss() {
    localStorage.setItem("nm_dob_dismissed", "1");
    setOpen(false);
  }

  async function toggleLang() {
    const next: Lang = lang === "en" ? "bn" : "en";
    try { await update.mutateAsync({ language: next } as any); } catch (e: any) { toast.error(e.message); }
  }

  return (
    <>
      <section className="rounded-2xl p-5 border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-surface relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Hourglass className="h-4 w-4 text-primary" />
            <p className="font-semibold text-sm">{tr(lang, "lifeClock")}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleLang} aria-label="Language" className="text-[11px] flex items-center gap-1 px-2 py-1 rounded-full bg-surface-elevated text-muted-foreground">
              <Languages className="h-3 w-3" /> {lang === "en" ? "EN" : "বাং"}
            </button>
            <button onClick={() => setShowHomeHint(true)} aria-label="Add to home" className="text-[11px] flex items-center gap-1 px-2 py-1 rounded-full bg-surface-elevated text-muted-foreground">
              <Smartphone className="h-3 w-3" />
            </button>
          </div>
        </div>

        {!profile?.birth_date ? (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-3">{tr(lang, "askDobSub")}</p>
            <Button onClick={() => setOpen(true)} className="rounded-full bg-gradient-purple shadow-glow">
              {tr(lang, "askDob")}
            </Button>
          </div>
        ) : parts && (
          <>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{tr(lang, "timeSpent")}</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <Cell label={tr(lang,"years")} value={fmt(parts.years)} />
              <Cell label={tr(lang,"months")} value={fmt(parts.months)} />
              <Cell label={tr(lang,"days")} value={fmt(parts.days)} />
              <Cell label={tr(lang,"hours")} value={fmt(parts.hours)} />
              <Cell label={tr(lang,"minutes")} value={fmt(parts.minutes)} />
              <Cell label={tr(lang,"seconds")} value={fmt(parts.seconds)} highlight />
            </div>
            <p className="text-xs italic text-muted-foreground border-l-2 border-primary pl-3">
              "{tr(lang, "guilt")}"
            </p>
          </>
        )}
      </section>

      <Dialog open={open} onOpenChange={(o) => !o && dismiss()}>
        <DialogContent className="bg-surface border-border max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>{tr(lang, "askDob")}</DialogTitle>
            <DialogDescription>{tr(lang, "askDobSub")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div><label className="text-xs text-muted-foreground">{tr(lang,"day")}</label>
              <Input inputMode="numeric" placeholder="DD" value={d} onChange={(e) => setD(e.target.value.replace(/\D/g,"").slice(0,2))} /></div>
            <div><label className="text-xs text-muted-foreground">{tr(lang,"month")}</label>
              <Input inputMode="numeric" placeholder="MM" value={m} onChange={(e) => setM(e.target.value.replace(/\D/g,"").slice(0,2))} /></div>
            <div><label className="text-xs text-muted-foreground">{tr(lang,"year")}</label>
              <Input inputMode="numeric" placeholder="YYYY" value={y} onChange={(e) => setY(e.target.value.replace(/\D/g,"").slice(0,4))} /></div>
          </div>
          <div className="flex gap-2 pt-3">
            <Button variant="outline" onClick={dismiss} className="flex-1 rounded-full">{tr(lang,"later")}</Button>
            <Button onClick={save} disabled={update.isPending} className="flex-1 rounded-full bg-gradient-purple shadow-glow">{tr(lang,"save")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHomeHint} onOpenChange={setShowHomeHint}>
        <DialogContent className="bg-surface border-border max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>{tr(lang, "addToHome")}</DialogTitle>
            <DialogDescription>{tr(lang, "addToHomeHint")}</DialogDescription>
          </DialogHeader>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
            <li>iOS Safari: Share → Add to Home Screen</li>
            <li>Android Chrome: ⋮ → Install app / Add to Home screen</li>
            <li>Desktop Chrome/Edge: address bar → Install</li>
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-2 text-center ${highlight ? "bg-gradient-purple/30 border border-primary" : "bg-surface-elevated"}`}>
      <div className={`text-lg font-bold tabular-nums ${highlight ? "text-primary" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
