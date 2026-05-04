import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function ScreenHeader({
  title, subtitle, right, onBack, gradient,
}: {
  title: ReactNode;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  gradient?: boolean;
}) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  return (
    <header className="flex items-start gap-3 px-5 pt-2 pb-4 safe-top">
      <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full bg-surface/60 backdrop-blur shrink-0" aria-label="Back">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1 text-center">
        <h1 className={`text-xl font-semibold ${gradient ? "gradient-text" : ""}`}>{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="shrink-0 w-10 flex justify-end">{right}</div>
    </header>
  );
}
