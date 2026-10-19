import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Home } from "lucide-react";

import { loginUser } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAutoFillDemo() {
    setEmail("faza@student.example");
    setPassword("demo");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser({ email, password });
      nav("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="relative min-h-screen overflow-hidden bg-[rgb(var(--hero-bg))]">
    {/* Efek Gradasi Latar Belakang */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.22),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.12),transparent_50%)]" />
    <div className="noise pointer-events-none absolute inset-0" />

    {/* Container Utama */}
    <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 sm:px-6">
      
      {/* 1. LOGO: Berada mandiri di pojok kiri atas */}
      <div className="absolute left-4 top-8 sm:left-6 lg:left-8">
        <Logo className="scale-110 origin-left transition-transform duration-200" />
      </div>

      {/* 2. GRID UTAMA (Membagi Kiri & Kanan secara Seimbang) */}
      <div className="grid w-full gap-12 lg:grid-cols-12 lg:items-center mt-24 lg:mt-0">
          
          {/* SISI KIRI: Teks Sambutan & Deskripsi */}
          <div data-ct-dark className="lg:col-span-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-slate-200/90">
              Log in to your career command center. This is a frontend-only demo; authentication is
              mocked behind a REST-ready API layer.
            </p>
          </div>

          {/* SISI KANAN: Box Login / Form Input */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Card className="w-full max-w-md rounded-3xl border-teal-800 bg-[#0d4a4d] p-6 shadow-xl">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@student.example"
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
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <Button variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Login"}
                </Button>

                <div className="flex items-center justify-between text-xs text-teal-100/70 pt-1">
                  <span>
                    New to CareerTrack?{" "}
                    <Link className="text-white hover:underline font-semibold" to="/register">
                      Create account
                    </Link>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillDemo}
                    className="text-[11px] text-[rgb(var(--gold))] hover:underline font-medium focus:outline-none"
                  >
                    Demo autofill
                  </button>
                </div>

                {/* Tautan ke Admin Portal & Landing Page */}
                <div className="pt-3 border-t border-teal-700/50 space-y-2 text-center">
                  <div>
                    <Link
                      to="/admin/login"
                      className="inline-flex items-center gap-1.5 text-xs text-teal-200/80 hover:text-white hover:underline transition"
                    >
                      <Shield className="h-3.5 w-3.5 text-teal-300" />
                      <span>Masuk sebagai Staff</span>
                    </Link>
                  </div>
                  <div>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 text-[11px] text-teal-300/70 hover:text-white hover:underline transition"
                    >
                      <Home className="h-3 w-3" />
                      <span>Kembali ke Landing Page</span>
                    </Link>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


