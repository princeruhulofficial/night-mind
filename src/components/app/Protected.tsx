import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

export function Protected({ requireOnboarded = true }: { requireOnboarded?: boolean }) {
  const { user, loading } = useAuth();
  const { data: profile, isLoading } = useProfile();
  if (loading || (user && isLoading)) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (requireOnboarded && profile && !profile.onboarded) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
