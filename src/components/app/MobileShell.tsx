import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function MobileShell() {
  return (
    <div className="min-h-screen pb-28">
      <Outlet />
      <BottomNav />
    </div>
  );
}
