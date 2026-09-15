import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

const columns = [
  { key: "Wishlist" },
  { key: "Applied" },
  { key: "Assessment" },
  { key: "Interview" },
  { key: "Offer" },
  { key: "Rejected" },
];

const demoCards = {
  Wishlist: [
    { title: "Backend Intern", company: "Orbit Mobility", meta: "Remote" },
    { title: "Risk Modeling Intern", company: "Nova Fintech", meta: "Remote" },
  ],
  Applied: [
    { title: "SWE Intern", company: "Aurora Labs", meta: "Hybrid" },
    { title: "Product Design Intern", company: "Pulse AI Studio", meta: "Hybrid" },
  ],
  Assessment: [
    { title: "Data Science Intern", company: "Helio Health", meta: "Take-home" },
  ],
  Interview: [
    { title: "Frontend Intern", company: "Pulse AI Studio", meta: "18 Sep" },
    { title: "Analytics Intern", company: "Nova Fintech", meta: "21 Sep" },
  ],
  Offer: [{ title: "Marketing Analytics", company: "Mosaic Media", meta: "Offer" }],
  Rejected: [{ title: "Security Intern", company: "Vertex Security", meta: "Screen" }],
};

export function TrackingKanban() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);

  return (
    <section id="tracking" className="relative py-20 sm:py-28">
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
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--accent2),0.9)]" />
              Application tracking
            </div>
            <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white">
              A Kanban pipeline that reads like your real week.
            </h3>
            <p className="mt-4 text-pretty text-base text-white/60">
              CareerTrack keeps stages simple, realistic, and immediately understandable. Your next
              action is always visible.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="p-5">
              <div className="flex min-w-0 gap-3 overflow-x-auto pb-4">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className="w-[220px] flex-shrink-0 rounded-lg border border-slate-200 bg-slate-100"
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="text-xs font-semibold text-slate-800">{col.key}</div>
                      <div className="text-[11px] font-medium text-slate-500">
                        {(demoCards as any)[col.key]?.length ?? 0}
                      </div>
                    </div>
                    <div className="space-y-2 px-3 pb-3">
                      {((demoCards as any)[col.key] ?? []).map((c: any) => (
                        <div
                          key={c.title}
                          className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-teal-400 shadow-sm"
                        >
                          <div className="text-xs font-semibold text-slate-900">{c.title}</div>
                          <div className="mt-1 text-[11px] text-slate-600">{c.company}</div>
                          <div className="mt-2 text-[11px] text-slate-500">{c.meta}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500">
              In the real product, cards move through stages as you progress.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
