import { cn } from "@/lib/utils";

export function UserAvatar({ name, url, size = 40, className }: { name?: string | null; url?: string | null; size?: number; className?: string }) {
  const initial = (name ?? "U")[0]?.toUpperCase();
  return (
    <div
      className={cn("rounded-full overflow-hidden bg-gradient-purple grid place-items-center text-white font-bold shrink-0 shadow-glow-soft", className)}
      style={{ height: size, width: size, fontSize: size * 0.4 }}
    >
      {url ? <img src={url} alt={name ?? "Avatar"} className="h-full w-full object-cover" /> : <span>{initial}</span>}
    </div>
  );
}
