import avatar from "@/assets/ai-avatar.png";
import { cn } from "@/lib/utils";

export function AiAvatar({ size = 48, glow = true, className }: { size?: number; glow?: boolean; className?: string }) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      {glow && <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />}
      <img src={avatar} alt="NightMind AI" width={size} height={size} className="relative rounded-full" />
    </div>
  );
}
