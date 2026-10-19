import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  AlertCircle,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { adminLogin } from "@/services/adminApi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Form field validations
  function validateEmail(val: string): string | undefined {
    if (!val.trim()) {
      return "Email wajib diisi.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Format email tidak valid. Gunakan format yang benar (contoh: admin@careertrack.com).";
    }
    return undefined;
  }

  function validatePassword(val: string): string | undefined {
    if (!val) {
      return "Password wajib diisi.";
    }
    if (val.length < 6) {
      return "Password minimal 6 karakter.";
    }
    return undefined;
  }

  function handleBlur(field: "email" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
    if (field === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  }

  function handleAutoFillDemo() {
    setEmail("admin@careertrack.com");
    setPassword("admin123");
    setErrors({});
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin({ email, password });
      setSuccessMessage(`Selamat datang kembali, ${response.user.name}!`);
      // Redirect to admin company management
      setTimeout(() => {
        navigate("/admin/companies");
      }, 700);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat masuk ke portal admin. Silakan coba lagi.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[rgb(var(--hero-bg))]">
      {/* Background radial gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.22),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.12),transparent_50%)]" />
      <div className="noise pointer-events-none absolute inset-0" />

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Portal Tag */}
        <div className="absolute left-4 top-8 flex items-center gap-3 sm:left-6 lg:left-8">
          <Logo className="scale-105 origin-left" />
          <Badge
            variant="warning"
            className="hidden sm:inline-flex border-amber-400/40 bg-amber-500/10 text-amber-300 font-semibold uppercase tracking-wider text-[10px]"
          >
            Admin Portal
          </Badge>
        </div>

        {/* Top Right Quick Link */}
        <div className="absolute right-4 top-8 sm:right-6 lg:right-8">
          <Link
            to="/login"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-teal-700/60 bg-teal-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-teal-500 hover:text-white transition"
          >
            <span>Portal Mahasiswa</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* 2-Column Balanced Grid */}
        <div className="grid w-full gap-12 lg:grid-cols-12 lg:items-center mt-16 sm:mt-12 lg:mt-0">
          
          {/* Left Column: Heading, Security Info & Value Proposition */}
          <div data-ct-dark className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/40 bg-teal-950/60 px-3.5 py-1.5 text-xs text-teal-300 shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[rgb(var(--gold))]" />
              <span className="font-medium">CareerTrack Administration Panel</span>
            </div>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Pusat Kendali Mitra & Lowongan Karir
            </h1>

            <p className="max-w-lg text-pretty text-sm leading-relaxed text-slate-200/90 sm:text-base">
              Kelola daftar perusahaan mitra, publikasi lowongan pekerjaan, dan pipeline karir
              mahasiswa dalam satu antarmuka terintegrasi yang aman dan efisien.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="rounded-md bg-teal-900/60 p-1.5 text-teal-400 border border-teal-700/40">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <strong className="block text-white font-medium">Akses Khusus Terverifikasi</strong>
                  Halaman ini diperuntukkan bagi pengelola CDC dan administrator mitra industri.
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="rounded-md bg-teal-900/60 p-1.5 text-[rgb(var(--gold))] border border-teal-700/40">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <strong className="block text-white font-medium">Manajemen Terstruktur</strong>
                  CRUD Company & Position Management sesuai standar CareerTrack Service Layer.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Admin Login Card */}
          <div className="lg:col-span-6 lg:col-start-7 flex justify-center lg:justify-end">
            <Card className="w-full max-w-md rounded-3xl border-teal-800/80 bg-[#0c4447]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Masuk Sebagai Admin
                  </h2>
                  <Badge variant="warning" className="text-[10px] font-semibold">
                    CDC Staff
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-teal-100/75">
                  Masukkan email dan kata sandi administrator Anda.
                </p>
              </div>

              {/* Error State Banner */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs text-rose-200 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <strong className="font-semibold text-rose-100">Gagal Masuk: </strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Success State Banner */}
              {successMessage && (
                <div
                  role="status"
                  className="mb-5 flex items-center gap-2.5 rounded-xl border border-teal-500/40 bg-teal-950/70 p-3.5 text-xs text-teal-200 animate-in fade-in duration-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-300" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email Field */}
                <div>
                  <Label htmlFor="admin-email" className="text-teal-100">
                    Email Administrator
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300/60" />
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched.email) {
                          setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur("email")}
                      disabled={loading}
                      placeholder="admin@careertrack.com"
                      autoComplete="email"
                      className={`pl-9.5 text-slate-900 ${
                        errors.email && touched.email
                          ? "border-rose-400 focus:border-rose-500 ring-rose-400"
                          : ""
                      }`}
                      aria-invalid={Boolean(errors.email && touched.email)}
                      aria-describedby={errors.email && touched.email ? "admin-email-error" : undefined}
                    />
                  </div>
                  {/* Validation Error */}
                  {errors.email && touched.email && (
                    <p
                      id="admin-email-error"
                      className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-300"
                    >
                      <AlertCircle className="h-3 w-3 inline" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="admin-password" className="text-teal-100 mb-0">
                      Kata Sandi
                    </Label>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300/60" />
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touched.password) {
                          setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur("password")}
                      disabled={loading}
                      placeholder="Minimal 6 karakter"
                      autoComplete="current-password"
                      className={`pl-9.5 pr-10 text-slate-900 ${
                        errors.password && touched.password
                          ? "border-rose-400 focus:border-rose-500 ring-rose-400"
                          : ""
                      }`}
                      aria-invalid={Boolean(errors.password && touched.password)}
                      aria-describedby={errors.password && touched.password ? "admin-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Validation Error */}
                  {errors.password && touched.password && (
                    <p
                      id="admin-password-error"
                      className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-300"
                    >
                      <AlertCircle className="h-3 w-3 inline" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button (Loading State handled) */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2 font-bold cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-[rgb(var(--hero-bg))]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Memverifikasi kredensial...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Masuk ke Admin Portal
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {/* Empty State / Autofill Helper */}
                <div className="rounded-xl border border-teal-700/80 bg-teal-900/40 p-3.5 text-xs text-teal-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-[rgb(var(--gold))]" />
                      Akun Demo Admin
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillDemo}
                      disabled={loading}
                      className="text-[11px] text-[rgb(var(--gold))] hover:underline font-semibold focus:outline-none"
                    >
                      Gunakan Akun Demo
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-teal-200/90 bg-teal-950/60 p-1.5 rounded border border-teal-800/60">
                    email: <span className="text-white">admin@careertrack.com</span>
                    <br />
                    pass: <span className="text-white">admin123</span>
                  </div>
                </div>

                {/* Return link */}
                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="text-xs text-teal-200/80 hover:text-white hover:underline transition"
                  >
                    Bukan administrator? Masuk sebagai Mahasiswa
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
