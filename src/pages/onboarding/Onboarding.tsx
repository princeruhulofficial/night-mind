import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app/Logo";
import { TimeDial } from "@/components/app/TimeDial";
import { ArrowRight, Briefcase, Heart, BookOpen, Check, Brain } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const FOCUS = [
  { id: "health", label: "Health", icon: Heart, blurb: "Sleep, exercise, mindful eating" },
  { id: "work", label: "Work", icon: Briefcase, blurb: "Deep work, focus, deadlines" },
  { id: "learning", label: "Learning", icon: BookOpen, blurb: "Skills, reading, growth" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
  const [index, setIndex] = useState(0);
  const [sleep, setSleep] = useState("22:30");
  const [wake, setWake] = useState("07:00");
  const [focus, setFocus] = useState<string[]>([]);
  const update = useUpdateProfile();

  useEffect(() => {
    if (!embla) return;
    embla.on("select", () => setIndex(embla.selectedScrollSnap()));
  }, [embla]);

  function next() {
    if (index < 2) embla?.scrollNext();
    else finish();
  }

  async function finish() {
    if (focus.length === 0) {
      toast.error("Pick at least one focus area");
      embla?.scrollTo(1);
      return;
    }
    try {
      await update.mutateAsync({ sleep_time: sleep, wake_time: wake, focus_areas: focus, onboarded: true });
      toast.success("All set! Let's plan your night.");
      navigate("/checkin");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function toggleFocus(id: string) {
    setFocus((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  return (
    <main className="min-h-screen flex flex-col safe-top">
      <div className="pt-6 pb-2 flex flex-col items-center">
        <Logo size={56} withText />
        <p className="text-xs text-muted-foreground mt-1">Your AI Companion for Better Days</p>
      </div>

      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {/* Card 1 — Sleep time */}
          <div className="min-w-0 flex-[0_0_100%] px-6 py-4">
            <Card num={1} title="When do you go to sleep?" subtitle="Drag the dial to set your bedtime.">
              <div className="my-4 grid place-items-center"><TimeDial value={sleep} onChange={setSleep} variant="sleep" /></div>
              <Hint>Better sleep leads to better focus and a better you.</Hint>
            </Card>
          </div>

          {/* Card 2 — Focus */}
          <div className="min-w-0 flex-[0_0_100%] px-6 py-4">
            <Card num={2} title="What areas do you want to focus on?" subtitle="Pick one or more.">
              <div className="space-y-3 my-4">
                {FOCUS.map((f) => {
                  const active = focus.includes(f.id);
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFocus(f.id)}
                      className={`w-full flex items-center gap-4 rounded-2xl p-4 text-left border transition ${active ? "bg-gradient-purple/20 border-primary shadow-glow" : "bg-surface/60 border-border"}`}
                    >
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${active ? "bg-gradient-purple text-white" : "bg-surface-elevated text-primary"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{f.label}</p>
                        <p className="text-xs text-muted-foreground">{f.blurb}</p>
                      </div>
                      {active && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Card 3 — Wake-up */}
          <div className="min-w-0 flex-[0_0_100%] px-6 py-4">
            <Card num={3} title="When do you wake up?" subtitle="Drag the dial to set your wake time.">
              <div className="my-4 grid place-items-center"><TimeDial value={wake} onChange={setWake} variant="wake" /></div>
              <Hint>A consistent wake time stabilizes your energy through the day.</Hint>
            </Card>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 safe-bottom space-y-4">
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-gradient-purple" : "w-2 bg-surface-elevated"}`} />
          ))}
        </div>
        <Button onClick={next} disabled={update.isPending} className="w-full h-14 rounded-full bg-gradient-purple hover:opacity-90 shadow-glow text-base">
          {index === 2 ? "Finish" : "Continue"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">Swipe to continue</p>
      </div>
    </main>
  );
}

function Card({ num, title, subtitle, children }: { num: number; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col animate-fade-in-up">
      <div className="h-8 w-8 rounded-full bg-gradient-purple grid place-items-center text-sm font-bold mb-4">{num}</div>
      <h2 className="text-xl font-semibold leading-snug">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto flex gap-2 items-start rounded-xl bg-surface/60 p-3 border border-border">
      <Brain className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
