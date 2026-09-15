import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Your career at a glance" },
  "/jobs": { title: "Jobs", subtitle: "Discover and shortlist opportunities" },
  "/applications": { title: "Applications", subtitle: "Track every pipeline stage" },
  "/interviews": { title: "Interviews", subtitle: "Upcoming sessions and prep" },
  "/analytics": { title: "Analytics", subtitle: "Momentum and conversion rates" },
  "/profile": { title: "Profile", subtitle: "Your professional snapshot" },
};

export function AppTopbar() {
  const location = useLocation();
  const meta = useMemo(() => {
    const path = location.pathname.startsWith("/jobs/") ? "/jobs" : location.pathname;
    return titles[path] ?? { title: "CareerTrack", subtitle: "" };
  }, [location.pathname]);

  const [cmdHint, setCmdHint] = useState(false);
  useEffect(() => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    setCmdHint(isMac);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/" className="focus-ring rounded-lg lg:hidden">
          <Logo compact />
        </Link>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-slate-900">
            {meta.title}
          </div>
          <div className="truncate text-xs text-slate-500">{meta.subtitle}</div>
        </div>
      </div>

      <div className="hidden w-[420px] max-w-[40vw] items-center gap-2 md:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9 bg-slate-50" placeholder="Search (demo)" />
        </div>
        <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-500 lg:flex">
          {cmdHint ? <Command className="h-3.5 w-3.5" /> : <span className="text-[11px]">Ctrl</span>}
          <span className="text-[11px]">K</span>
        </div>
      </div>
    </div>
  );
}
