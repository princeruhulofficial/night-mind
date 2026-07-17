import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/hooks/useTranslation";
import { MobileShell } from "@/components/app/MobileShell";
import { Protected } from "@/components/app/Protected";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Onboarding from "./pages/onboarding/Onboarding";
import SleepTime from "./pages/onboarding/SleepTime";
import Home from "./pages/app/Home";
import Tasks from "./pages/app/Tasks";
import Checkin from "./pages/app/Checkin";
import Plan from "./pages/app/Plan";
import Why from "./pages/app/Why";
import Credibility from "./pages/app/Credibility";
import Patterns from "./pages/app/Patterns";
import Adjustment from "./pages/app/Adjustment";
import Reminder from "./pages/app/Reminder";
import WeeklyDebrief from "./pages/app/WeeklyDebrief";
import Profile from "./pages/app/Profile";
import Leaderboard from "./pages/app/Leaderboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner theme="dark" position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <I18nProvider>
            <div className="mx-auto max-w-md min-h-screen relative">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />

                {/* Onboarding (logged-in but not yet onboarded ok) */}
                <Route element={<Protected requireOnboarded={false} />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/onboarding/sleep" element={<SleepTime />} />
                </Route>

                {/* Main app with bottom nav */}
                <Route element={<Protected />}>
                  <Route element={<MobileShell />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/checkin" element={<Checkin />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                  {/* Full-screen app routes (no bottom nav) */}
                  <Route path="/plan" element={<Plan />} />
                  <Route path="/why" element={<Why />} />
                  <Route path="/credibility" element={<Credibility />} />
                  <Route path="/patterns" element={<Patterns />} />
                  <Route path="/adjustment" element={<Adjustment />} />
                  <Route path="/reminder" element={<Reminder />} />
                  <Route path="/debrief" element={<WeeklyDebrief />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </I18nProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
