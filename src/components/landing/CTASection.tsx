import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div data-ct-dark className="relative overflow-hidden rounded-[34px] border border-teal-800 bg-[rgb(var(--hero-bg))] p-10 shadow-[var(--shadow-high)] sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(20,184,166,0.20),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(234,179,8,0.14),transparent_60%)]" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h3 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your next opportunity deserves a better system.
              </h3>
              <p className="mt-4 max-w-2xl text-pretty text-base text-teal-100/70">
                Keep your applications readable, your deadlines visible, and your momentum measurable —
                without turning your career search into a spreadsheet.
              </p>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full lg:w-auto">
                  Start Tracking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
