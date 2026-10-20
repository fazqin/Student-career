import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [semester, setSemester] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await registerUser({
      name,
      email,
      password,
      university,
      major,
      semester
    });

    nav("/dashboard");
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Registrasi gagal."
    );
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
                  <Label htmlFor="name" className="text-white font-semibold text-sm">
                    Full Name / Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white font-semibold text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white font-semibold text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="university" className="text-white font-semibold text-sm">
                    University / Universitas
                  </Label>
                  <Input
                    id="university"
                    placeholder="e.g. Stanford University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="major" className="text-white font-semibold text-sm">
                    Major / Jurusan
                  </Label>
                  <Input
                    id="major"
                    placeholder="e.g. Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="semester" className="text-white font-semibold text-sm">
                    Semester
                  </Label>
                  <Input
                    id="semester"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="e.g. 1"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-200">
                    {error}
                  </p>
                )}
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
