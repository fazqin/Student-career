import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Briefcase,
  Layers,
  Calendar,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
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
  const navigate = useNavigate();

  function handleLogout() {
    try {
      localStorage.removeItem("careertrack_user");
      localStorage.removeItem("careertrack_token");
    } catch {
      // ignore
    }
    navigate("/login");
  }

  return (
    <div data-ct-light className="space-y-4">
      <aside className="sticky top-3 hidden h-[calc(100vh-24px)] w-[270px] flex-shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 lg:flex">
        {/* Brand Logo */}
        <div className="px-2 py-2">
          <Logo variant="dark" />
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 space-y-1 flex-1">
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

        {/* Bottom Actions: Info Card & Sign Out Button */}
        <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
            <div className="font-semibold text-slate-700">Demo frontend</div>
            <div className="mt-1">Ready to connect to REST API later.</div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
