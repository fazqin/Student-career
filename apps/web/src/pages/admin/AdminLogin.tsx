import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
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

  // Field validations in English
  function validateEmail(val: string): string | undefined {
    if (!val.trim()) {
      return "Email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Invalid email format (e.g. admin@careertrack.com).";
    }
    return undefined;
  }

  function validatePassword(val: string): string | undefined {
    if (!val) {
      return "Password is required.";
    }
    if (val.length < 6) {
      return "Password must be at least 6 characters.";
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
    setEmail("faza@hbs.harvard.edu");
    setPassword("Faza123?");
    setShowPassword(false);
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
      setSuccessMessage(`Welcome back, ${response.user.name}!`);
      setTimeout(() => {
        navigate("/admin/companies");
      }, 700);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while signing in to the admin portal. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[rgb(var(--hero-bg))]">
      {/* Background Radial Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.22),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.12),transparent_50%)]" />
      <div className="noise pointer-events-none absolute inset-0" />

      {/* Clean Back Button at Top-Left */}
      <div className="absolute left-4 top-8 sm:left-6 lg:left-8 z-20">
        <Link
          to="/"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-teal-700/60 bg-teal-950/50 px-3 py-1.5 text-xs font-medium text-teal-200 hover:border-teal-500 hover:text-white transition"
          aria-label="Back to Landing Page"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 sm:px-6">
        {/* Main 2-Column Split Grid */}
        <div className="grid w-full gap-12 lg:grid-cols-12 lg:items-center mt-20 lg:mt-0">
          {/* Left Column: Logo & Welcome Text */}
          <div data-ct-dark className="lg:col-span-5 space-y-4">
            <Logo className="scale-110 origin-left" />
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back, Admin.
            </h1>
            <p className="max-w-md text-pretty text-base leading-relaxed text-slate-200/90">
              Sign in to your administration dashboard. Manage partner companies, job positions,
              and student application pipelines in one unified workspace.
            </p>
          </div>

          {/* Right Column: Login Card */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Card className="w-full max-w-md rounded-3xl border-teal-800 bg-[#0d4a4d] p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Sign in as Admin
                  </h2>
                  <Badge variant="warning" className="text-[10px] font-semibold">
                    Admin
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-teal-100/75">
                  Enter your admin email and password credentials.
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
                    <strong className="font-semibold text-rose-100">Sign in failed: </strong>
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
                    Email
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
                      placeholder="email@careertrack.com"
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
                  <Label htmlFor="admin-password" className="text-teal-100">
                    Password
                  </Label>
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
                      placeholder="••••••••"
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
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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

                {/* Submit Button */}
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
                      Verifying credentials...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Sign in to Admin Portal
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {/* Subtle Demo Autofill Option */}
                <div className="flex items-center justify-end text-xs text-teal-100/70 pt-0.5">
                  <button
                    type="button"
                    onClick={handleAutoFillDemo}
                    disabled={loading}
                    className="text-[11px] text-[rgb(var(--gold))] hover:underline font-medium transition focus:outline-none"
                  >
                    Use Demo Account
                  </button>
                </div>

                {/* Return to Student Portal Button */}
                <div className="pt-3 border-t border-teal-700/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                    className="w-full text-teal-200 hover:text-white border-teal-700/60 hover:bg-teal-900/40 text-xs py-2.5 h-10"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Return to Student Portal
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
