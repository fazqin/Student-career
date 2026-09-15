import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("Faza Ganteng");
  const [email, setEmail] = useState("faza@student.example");
  const [password, setPassword] = useState("demo");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      nav("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[rgb(var(--hero-bg))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.22),transparent_52%),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.12),transparent_58%)]" />
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6">
        <div className="grid w-full gap-8 lg:grid-cols-12 lg:items-center">
            <div data-ct-dark className="lg:col-span-6">
              <Logo />
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white">
                Start tracking like a pro.
              </h1>
              <p className="mt-4 max-w-md text-pretty text-base text-teal-100/70">
                Create your CareerTrack workspace. Everything is mock data for now — the architecture is
                ready to connect to a REST API later.
              </p>
            </div>

          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <Card className="w-full max-w-md rounded-3xl border-teal-800 bg-[#0d4a4d] p-6 shadow-xl">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <Button variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Creating…" : "Create account"}
                </Button>

                <div className="text-center text-sm text-teal-100/70">
                  Already have an account?{" "}
                  <Link className="text-white hover:underline font-semibold" to="/login">
                    Login
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
