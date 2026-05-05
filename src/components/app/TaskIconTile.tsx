import { getTaskImage } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function TaskIconTile({ icon, size = 48, className }: { icon?: string | null; size?: number; className?: string }) {
  const src = getTaskImage(icon);
  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 grid place-items-center shrink-0 overflow-hidden",
        className
      )}
      style={{ height: size, width: size }}
    >
      <img src={src} alt="" loading="lazy" width={size} height={size} className="h-[88%] w-[88%] object-contain drop-shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
    </div>
  );
}
