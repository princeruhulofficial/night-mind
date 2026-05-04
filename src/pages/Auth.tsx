import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <CenterSpinner />;
  if (user) return <Navigate to="/onboarding" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email if confirmation is required.");
        navigate("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/home");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        <div className="text-center space-y-3">
          <Logo size={72} withText />
          <p className="text-sm text-muted-foreground">Your AI Companion for Better Days</p>
        </div>

        <form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4 shadow-glow-soft">
          <div className="flex rounded-full bg-surface p-1">
            {(["signup", "signin"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-full transition ${mode === m ? "bg-gradient-purple text-white shadow-glow" : "text-muted-foreground"}`}
              >
                {m === "signup" ? "Sign Up" : "Sign In"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
          </div>

          <Button type="submit" disabled={busy} className="w-full bg-gradient-purple hover:opacity-90 shadow-glow h-12 rounded-full text-base">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}

function CenterSpinner() {
  return (
    <div className="min-h-screen grid place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
