import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene3D = lazy(() => import("./HeroScene"));

export function Hero({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const show3D = !reducedMotion && !isMobile;

  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setMouse({ x, y });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const layer = useMemo(() => {
    const tx = (n: number) => `translate3d(${mouse.x * n}px, ${mouse.y * n}px, 0)`;
    return {
      bg: { transform: tx(14) },
      text: { transform: tx(6) },
      cards: { transform: tx(22) },
    };
  }, [mouse.x, mouse.y]);

  return (
    <section
      ref={heroRef}
      data-ct-hero
      className={cn(
        "relative overflow-hidden bg-[rgb(var(--hero-bg))] pb-24 pt-28 sm:pb-28 sm:pt-32",
        className
      )}
    >
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, rgba(20,184,166,0.22), transparent 55%), radial-gradient(circle at 80% 20%, rgba(14,165,233,0.16), transparent 50%), radial-gradient(circle at 60% 90%, rgba(234,179,8,0.10), transparent 55%)",
          }}
        />
        <div className="noise absolute inset-0" />
        <div className="grid-fade absolute inset-0 opacity-[0.55]" style={layer.bg} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-6" style={layer.text}>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-800 bg-[rgb(var(--hero-card))] px-3 py-1.5 text-xs text-teal-100">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            Premium personal career command center
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Your career, finally under control.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-teal-100/80 sm:text-lg">
            Track every opportunity, application, interview, and deadline in one intelligent workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start Tracking <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#product" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore CareerTrack
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge variant="info">
              <Timer className="text-white h-3.5 w-3.5" /> <span className="text-popins text-white">Deadlines visible</span>
            </Badge>
            <Badge variant="success">
              <ShieldCheck className="text-white h-3.5 w-3.5" /><span className="text-popins text-white"> Calm & focused UI</span>
            </Badge>
            <Badge variant="default" className="border-teal-700 bg-[rgb(var(--hero-card))] text-white">Frontend-only demo (REST-ready)</Badge>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: "Stages", v: "Wishlist → Offer" },
              { k: "Clarity", v: "One workspace" },
              { k: "Momentum", v: "Weekly insights" },
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-lg border border-teal-800 bg-[rgb(var(--hero-card))] px-4 py-3"
              >
                <div className="text-xs text-teal-200/60">{x.k}</div>
                <div className="mt-1 text-sm font-semibold text-white">{x.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div
            className={cn(
              "relative mx-auto aspect-[1.05/1] w-full max-w-[560px] overflow-hidden rounded-[34px] border border-teal-700 bg-[rgb(var(--hero-card))] shadow-[0_28px_72px_-28px_rgba(0,0,0,0.72)]",
              "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.20),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.14),transparent_58%)]"
            )}
          >
            {/* 3D scene */}
            {show3D ? (
              <Suspense
                fallback={
                  <div className="absolute inset-0 grid place-items-center text-sm text-white/50">
                    Loading 3D…
                  </div>
                }
              >
                <div className="absolute inset-0">
                  <HeroScene3D />
                </div>
              </Suspense>
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-sm font-semibold text-white/70">CareerTrack Orbit</div>
                  <div className="mt-2 text-xs text-white/45">
                    3D preview disabled on mobile / reduced motion
                  </div>
                </div>
              </div>
            )}

            {/* Floating UI cards */}
            <div className="pointer-events-none absolute inset-0" style={layer.cards}>
              {[
                {
                  title: "Interview",
                  meta: "18 Sep · 10:30",
                  x: "8%",
                  y: "18%",
                },
                {
                  title: "Assessment",
                  meta: "Due in 3 days",
                  x: "62%",
                  y: "16%",
                },
                {
                  title: "Offer",
                  meta: "Negotiation",
                  x: "66%",
                  y: "68%",
                },
                {
                  title: "Deadline",
                  meta: "Nova Fintech · 25 Sep",
                  x: "10%",
                  y: "70%",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="absolute w-[170px] rounded-xl border border-teal-700 bg-[#0d4a4d] px-4 py-3 shadow-[0_20px_48px_-24px_rgba(0,0,0,0.72)]"
                  style={{ left: c.x, top: c.y }}
                >
                  <div className="text-xs font-semibold text-white">{c.title}</div>
                  <div className="mt-1 text-xs text-teal-100/70">{c.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-teal-200/50">
            Subtle depth, motion, and light — designed to feel premium, not gimmicky.
          </div>
        </div>
      </div>
    </section>
  );
}
