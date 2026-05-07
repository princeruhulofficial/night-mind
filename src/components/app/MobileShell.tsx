import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { useReminderBootstrap } from "@/hooks/useReminderBootstrap";

export function MobileShell() {
  useReminderBootstrap();
  return (
    <div className="min-h-screen pb-28">
      <Outlet />
      <BottomNav />
    </div>
  );
}
