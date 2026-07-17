import { Home, MessageCircle, ListChecks, User as UserIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export function BottomNav() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = [
    { to: "/home", icon: Home, label: t("navHome") },
    { to: "/checkin", icon: MessageCircle, label: t("navCheckin") },
    { to: "/tasks", icon: ListChecks, label: t("navTasks") },
    { to: "/profile", icon: UserIcon, label: t("navProfile") },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-3 safe-bottom pointer-events-none">
      <div className="relative max-w-md mx-auto pointer-events-auto">
        <div className="glass rounded-full h-16 flex items-center justify-around px-2 shadow-glow-soft">
          {items.slice(0, 2).map(({ to, icon: Icon, label }) => (
            <NavItem key={to} to={to} Icon={Icon} label={label} />
          ))}
          <div className="w-14" aria-hidden />
          {items.slice(2).map(({ to, icon: Icon, label }) => (
            <NavItem key={to} to={to} Icon={Icon} label={label} />
          ))}
        </div>
        <button
          onClick={() => navigate("/checkin")}
          aria-label="Quick check-in"
          className="absolute left-1/2 -translate-x-1/2 -top-6 h-16 w-16 rounded-full bg-gradient-purple shadow-glow animate-pulse-glow flex items-center justify-center"
        >
          <div className="h-12 w-12 rounded-full bg-background/40 backdrop-blur flex items-center justify-center">
            <div className="h-7 w-7 rounded-full bg-gradient-aurora" />
          </div>
        </button>
      </div>
    </nav>
  );
}

function NavItem({ to, Icon, label }: { to: string; Icon: typeof Home; label: string }) {
  return (
    <NavLink to={to} className="flex-1 flex justify-center">
      {({ isActive }) => (
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 py-2 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </div>
      )}
    </NavLink>
  );
}
