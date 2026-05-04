import { ScreenHeader } from "@/components/app/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHANGES = [
  { strike: '"Study new skills"', text: "Break into 2 smaller steps" },
  { strike: "Added 2-Minute Rule", text: "to build momentum" },
  { strike: "Workout moved to", text: "11 AM (your peak time)" },
];

export default function Adjustment() {
  const navigate = useNavigate();
  return (
    <main className="pb-10">
      <ScreenHeader title="Plan Adjusted" right={<button className="h-9 w-9 rounded-full glass grid place-items-center">⋯</button>} />
      <div className="px-5 space-y-5">
        <div className="grid place-items-center">
          <div className="h-24 w-24 rounded-full bg-gradient-purple grid place-items-center shadow-glow animate-pulse-glow"><Check className="h-12 w-12 text-white" /></div>
        </div>
        <p className="text-center text-sm">I've adjusted your <span className="text-primary">plan</span> based on your patterns.</p>

        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs text-muted-foreground">What changed?</p>
          {CHANGES.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-md bg-emerald-500/20 grid place-items-center text-emerald-400 mt-0.5"><Check className="h-3.5 w-3.5" /></div>
              <p className="text-sm leading-snug"><span className="font-semibold">{c.strike}</span> <span className="text-muted-foreground">{c.text}</span></p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/20 grid place-items-center text-primary">✦</div>
          <div className="text-xs">
            <p className="font-semibold mb-0.5">Why this works?</p>
            <p className="text-muted-foreground">Small steps + right timing = higher success rate.</p>
          </div>
        </div>

        <Button onClick={() => navigate("/tasks")} className="w-full h-12 rounded-full bg-gradient-purple shadow-glow">See Updated Plan <ArrowRight className="h-4 w-4 ml-2" /></Button>
      </div>
    </main>
  );
}
