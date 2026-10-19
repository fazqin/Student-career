import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { adminLogout } from "@/services/adminApi";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/admin/companies": {
    title: "Company Management",
    subtitle: "Manage partner companies & industry integration",
  },
  "/admin/positions": {
    title: "Position Management",
    subtitle: "Manage and publish career & internship opportunities",
  },
  "/admin/applications": {
    title: "Application Management",
    subtitle: "Track and manage student application pipelines",
  },
};

export function AdminTopbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const meta = useMemo(() => {
    return (
      titles[location.pathname] ?? {
        title: "Staff Dashboard",
        subtitle: "Staff Operations & Command Center",
      }
    );
  }, [location.pathname]);

  async function handleLogout() {
    await adminLogout();
    navigate("/admin/login");
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/admin/companies" className="focus-ring rounded-lg lg:hidden">
          <Logo compact />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm font-semibold tracking-tight text-slate-900">
              {meta.title}
            </h1>
            <Badge
              variant="warning"
              className="border-amber-400/40 bg-amber-500/10 text-amber-800 text-[10px] font-bold uppercase"
            >
              Staff
            </Badge>
          </div>
          <div className="truncate text-xs text-slate-500">{meta.subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLogout}
          title="Sign out from Staff session"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
