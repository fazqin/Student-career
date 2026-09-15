import { useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

export function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);

  return (
    <section id="product" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={cn(
            "mx-auto max-w-3xl text-center text-[rgb(var(--text-dark))] transition duration-700",
            revealed ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-4"
          )}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--accent2),0.9)]" />
            Product interface preview
          </div>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A calm workspace for high-stakes decisions.
          </h2>
          <p className="mt-4 text-pretty text-base text-white/60">
            CareerTrack turns scattered notes and tabs into a single command center — with stages,
            deadlines, interviews, and analytics designed to feel effortless.
          </p>
        </div>

        <div className="mt-12">
          <Card data-ct-showcase className="overflow-hidden rounded-lg border-slate-200 bg-white">
            <CardHeader className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">CareerTrack Dashboard</div>
                <div className="mt-1 text-xs text-slate-500">Applications · Interviews · Deadlines · Momentum</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info">Weekly momentum</Badge>
                <Badge variant="stage">Stages</Badge>
                <Badge variant="default">Glass UI</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.12),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(234,179,8,0.10),transparent_40%)]" />
                <div className="grid gap-4 p-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <div className="grid gap-3">
                      {["Applications", "Interviews", "Offers", "Rejected"].map((k, i) => (
                        <div
                          key={k}
                          className={cn(
                            "rounded-lg border border-slate-200 bg-slate-50 p-4",
                            i === 2 && "shadow-sm border-teal-200 bg-teal-50"
                          )}
                        >
                          <div className="text-xs text-slate-500">{k}</div>
                          <div className="mt-2 flex items-end justify-between">
                            <div className="text-2xl font-semibold tracking-tight text-slate-900">
                              {[14, 5, 1, 3][i]}
                            </div>
                            <div className="text-xs text-slate-500">This month</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Application Overview</div>
                          <div className="mt-1 text-xs text-slate-500">Conversion feels visible, not stressful.</div>
                        </div>
                        <div className="text-xs text-slate-500">Last 8 weeks</div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {["Wishlist → Applied", "Applied → Interview", "Interview → Offer"].map((x, idx) => (
                          <div key={x} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="text-xs text-slate-600">{x}</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">
                              {["62%", "29%", "12% "][idx]}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-400">Trend: improving</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-slate-800">Upcoming Interviews</div>
                          <div className="text-[11px] text-slate-500">Next 14 days</div>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {[
                            { d: "18 Sep", c: "Pulse AI Studio", t: "Technical + UI Systems" },
                            { d: "21 Sep", c: "Nova Fintech", t: "Product Analytics" },
                            { d: "26 Sep", c: "Helio Health", t: "Case Study Review" },
                            { d: "02 Oct", c: "Mosaic Media", t: "Offer & Matching" },
                          ].map((i) => (
                            <div key={i.t} className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold text-slate-900">{i.c}</div>
                                <div className="text-[11px] text-slate-500">{i.d}</div>
                              </div>
                              <div className="mt-1 text-[11px] text-slate-600">{i.t}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
