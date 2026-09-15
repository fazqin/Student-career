import { NavLink } from "react-router-dom";
import { LayoutGrid, Briefcase, Layers, Calendar, BarChart3, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: Layers },
  { to: "/interviews", label: "Interviews", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  return (
    <aside className="sticky top-3 hidden h-[calc(100vh-24px)] w-[270px] flex-shrink-0 rounded-2xl border border-slate-200 bg-white p-3 lg:block">
      <div className="px-2 py-2">
        <Logo />
      </div>

      <nav className="mt-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 pb-2 pt-6 text-xs text-slate-500">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="font-semibold text-slate-700">Demo frontend</div>
          <div className="mt-1">Ready to connect to REST API later.</div>
        </div>
      </div>
    </aside>
  );
}
