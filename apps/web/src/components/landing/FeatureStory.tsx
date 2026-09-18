import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { useReveal } from "@/hooks/useReveal";

const stages = [
  { key: "Wishlist", hint: "Capture" },
  { key: "Applied", hint: "Commit" },
  { key: "Assessment", hint: "Prove" },
  { key: "Interview", hint: "Connect" },
  { key: "Offer", hint: "Decide" },
];

export function FeatureStory() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);
  const [active, setActive] = useState(stages[2].key);

  const activeIndex = useMemo(
    () => Math.max(0, stages.findIndex((s) => s.key === active)),
    [active]
  );

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={cn(
            "grid items-start gap-10 lg:grid-cols-12 transition duration-700",
            revealed ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-4"
          )}
        >
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--accent),0.9)]" />
              Feature storytelling
            </div>
            <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white">
              Track every opportunity through a clear pipeline.
            </h3>
            <p className="mt-4 text-pretty text-base text-white/60">
              No more guessing where you stand. CareerTrack keeps your pipeline legible — with
              realistic stages, sharp priorities, and a calm system for follow-ups.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={cn(
                    "focus-ring rounded-full border px-3 py-1.5 text-xs transition",
                    active === s.key
                      ? "border-teal-200 bg-teal-50 text-teal-800"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  onMouseEnter={() => setActive(s.key)}
                  onFocus={() => setActive(s.key)}
                >
                  {s.key}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="rounded-lg border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Pipeline</div>
                  <div className="mt-1 text-xs text-slate-500">A visual story of progress — not a table.</div>
                </div>
                <Badge variant="info">Hover stages</Badge>
              </div>

              <div className="mt-6">
                <div className="relative h-2 rounded-full bg-slate-100">
                  <div
                    className="absolute left-0 top-0 h-2 rounded-full bg-[linear-gradient(90deg,rgba(20,184,166,0.9),rgba(8,51,53,0.95))]"
                    style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {stages.map((s, i) => {
                    const done = i <= activeIndex;
                    return (
                      <div
                        key={s.key}
                        className={cn(
                          "rounded-lg border p-3 transition",
                          done
                            ? "border-teal-200 bg-teal-50"
                            : "border-slate-200 bg-slate-50"
                        )}
                      >
                        <div className="text-xs font-semibold text-slate-800">{s.key}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{s.hint}</div>
                        <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                          <div
                            className={cn(
                              "h-1.5 rounded-full",
                              done
                                ? "bg-[rgba(20,184,166,0.75)]"
                                : "bg-slate-200"
                            )}
                            style={{ width: done ? "100%" : "35%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {["Follow-up reminders that feel gentle", "Notes attached to every stage"].map(
                    (t) => (
                      <div
                        key={t}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="text-xs font-semibold text-slate-800">{t}</div>
                        <div className="mt-2 text-xs text-slate-500">
                          Designed to keep you consistent without turning your search into busywork.
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
