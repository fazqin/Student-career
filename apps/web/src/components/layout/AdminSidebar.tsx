import { NavLink, useNavigate } from "react-router-dom";
import { Building2, Briefcase, Layers, LogOut, ShieldCheck, Bot } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { adminLogout, getAdminUser } from "@/services/adminApi";

const adminNavItems = [
  { to: "/admin/companies", label: "Company Management", icon: Building2 },
  { to: "/admin/positions", label: "Position Management", icon: Briefcase },
  { to: "/admin/applications", label: "Application Management", icon: Layers },
  { to: "/admin/bot", label: "Application Bot", icon: Bot },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  async function handleLogout() {
    await adminLogout();
    navigate("/admin/login");
  }

  return (
    <div data-ct-light className="space-y-4">
      <aside className="sticky top-3 hidden h-[calc(100vh-24px)] w-[270px] flex-shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 lg:flex">
        {/* Brand Header */}
        <div className="px-2 py-2 flex items-center justify-between border-b border-slate-100 pb-3">
          <Logo variant="light" compact={false} />
          <Badge
            variant="warning"
            className="border-amber-400/40 bg-amber-500/10 text-amber-800 text-[10px] font-bold uppercase"
          >
            Admin
          </Badge>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 space-y-1 flex-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Admin Management
          </div>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-slate-100 font-semibold text-[rgb(var(--hero-bg))]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Area: Admin User & Logout Only */}
        <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
          {/* Admin User Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--hero-bg))] text-white font-bold text-xs shrink-0">
                <ShieldCheck className="h-4 w-4 text-[rgb(var(--gold))]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-slate-800">
                  {adminUser?.name || "Administrator"}
                </div>
                <div className="truncate text-[11px] text-slate-500">
                  {adminUser?.email || "admin@careertrack.com"}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
