import moon from "@/assets/moon-logo.png";

export function Logo({ size = 56, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={moon} alt="NightMind logo" width={size} height={size} className="animate-float drop-shadow-[0_0_30px_hsl(var(--primary-glow)/0.6)]" />
      {withText && (
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-foreground">Night</span>
          <span className="gradient-text">Mind</span>
        </h1>
      )}
    </div>
  );
}
