import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

const logos = ["Northbridge", "Aster", "Kairo", "Prism", "Wavelength", "Evergreen"];

export function Credibility() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={cn(
            "rounded-lg border border-slate-200 bg-white p-8 sm:p-10 transition duration-700 shadow-sm",
            revealed ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm translate-y-4"
          )}
        >
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="text-sm font-semibold text-slate-900">
                Designed for ambitious students building their next opportunity.
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Demo credibility section — the logos below are fictional placeholders for visual tone
                only (not real partnerships).
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {logos.map((l) => (
                  <div
                    key={l}
                    className="grid place-items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-xs font-semibold tracking-wide text-slate-500"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
