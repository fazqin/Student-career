import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

const items = [
  { d: "18 Sep", company: "Pulse AI Studio", title: "Technical Interview", meta: "10:30 · Video" },
  { d: "21 Sep", company: "Nova Fintech", title: "HR Interview", meta: "15:00 · Video" },
  { d: "26 Sep", company: "Helio Health", title: "Final Interview", meta: "09:00 · On-site" },
];

export function InterviewPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);

  return (
    <section id="interviews" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={cn(
            "grid items-center gap-10 lg:grid-cols-12 transition duration-700",
            revealed ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-4"
          )}
        >
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <span className=" rounded-full text-slate-800 bg-[rgba(var(--accent2),0.9)]" />
              <p className="font-xl text-slate-900">Interviews</p>
            </div>
            <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900">
              A timeline that keeps you ready.
            </h3>
            <p className="mt-4 text-pretty text-base text-slate-900">
              Upcoming interviews appear in a clean timeline — what’s next, who it’s with, and where
              you need to be.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { k: "Prep notes", v: "Attached to every interview" },
                { k: "Time zones", v: "Always clear (coming soon)" },
              ].map((x) => (
                <div key={x.k} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{x.k}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-800">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card className="rounded-lg border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Upcoming interviews</div>
              <div className="mt-1 text-xs text-slate-500">Next 14 days</div>

              <div className="mt-6 space-y-3">
                {items.map((i) => (
                  <div
                    key={i.title}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-400 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-500">{i.d}</div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">{i.company}</div>
                        <div className="mt-1 text-xs text-slate-600">{i.title}</div>
                      </div>
                      <div className="text-xs font-medium text-slate-500">{i.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
