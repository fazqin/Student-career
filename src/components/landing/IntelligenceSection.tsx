import { useRef } from "react";
import { Brain, TrendingUp, Compass } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

const insights = [
  {
    icon: TrendingUp,
    title: "You’re applying consistently.",
    body: "Your weekly application count has been steady for three weeks — keep the cadence.",
  },
  {
    icon: Brain,
    title: "Your interview rate is improving.",
    body: "More callbacks after tailoring your top 3 projects. Repeat what’s working.",
  },
  {
    icon: Compass,
    title: "Most opportunities are in Data & Technology.",
    body: "Industry clustering helps you focus your portfolio narrative and keywords.",
  },
];

export function IntelligenceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={cn(
            "transition duration-700",
            revealed ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-4"
          )}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--accent),0.9)]" />
              Career intelligence
            </div>
            <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white">
              Insight that feels like product, not hype.
            </h3>
            <p className="mt-4 text-pretty text-base text-white/60">
              CareerTrack summarizes your activity into clear statements — so you can adjust your
              strategy without getting lost in spreadsheets.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {insights.map((x) => (
              <div
                key={x.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-medium)]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50">
                    <x.icon className="h-5 w-5 text-teal-700" />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{x.title}</div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
