import { useMemo, useRef } from "react";
import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/Card";

export function LandingAnalytics() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);

  const data = useMemo(
    () => [
      { w: "W1", a: 2, i: 0 },
      { w: "W2", a: 4, i: 1 },
      { w: "W3", a: 6, i: 1 },
      { w: "W4", a: 8, i: 2 },
      { w: "W5", a: 10, i: 2 },
      { w: "W6", a: 11, i: 3 },
      { w: "W7", a: 13, i: 4 },
      { w: "W8", a: 14, i: 5 },
    ],
    []
  );

  return (
    <section id="analytics" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={cn(
            "grid gap-10 lg:grid-cols-12 transition duration-700",
            revealed ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-4"
          )}
        >
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--accent),0.9)]" />
              Analytics
            </div>
            <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white">
              Know your momentum — without feeling judged.
            </h3>
            <p className="mt-4 text-pretty text-base text-white/60">
              CareerTrack surfaces conversion and consistency in a way that feels calm and actionable.
              You’ll see patterns early — interview rate, offer rate, and where to focus next.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                { k: "Interview rate", v: "Improving", hint: "28% → 36%" },
                { k: "Offer rate", v: "Stable", hint: "~8%" },
                { k: "Most active", v: "Data & Tech", hint: "Industry cluster" },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/50">{x.k}</div>
                    <div className="text-xs font-semibold text-white/85">{x.v}</div>
                  </div>
                  <div className="mt-2 text-xs text-white/45">{x.hint}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="rounded-3xl border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white/85">Application growth</div>
                  <div className="mt-1 text-xs text-white/50">8-week snapshot (demo)</div>
                </div>
                <div className="text-xs text-white/45">Applications vs Interviews</div>
              </div>

              <div className="mt-6 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ left: 4, right: 8, top: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="appFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(20,184,166,0.5)" />
                        <stop offset="100%" stopColor="rgba(20,184,166,0.04)" />
                      </linearGradient>
                      <linearGradient id="intFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(234,179,8,0.45)" />
                        <stop offset="100%" stopColor="rgba(234,179,8,0.04)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(203,213,225,0.8)" vertical={false} />
                    <XAxis dataKey="w" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: 8,
                        color: "#0f172a",
                      }}
                      labelStyle={{ color: "#1e293b" }}
                    />
                    <Area type="monotone" dataKey="a" name="Applications" stroke="#14b8a6" fill="url(#appFill)" strokeWidth={2} />
                    <Area type="monotone" dataKey="i" name="Interviews" stroke="#eab308" fill="url(#intFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
