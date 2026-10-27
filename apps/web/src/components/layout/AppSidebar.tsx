import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Briefcase,
  Layers,
  Calendar,
  User,
  LogOut,
  Crown,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/jobs", label: "Positions", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: Layers },
  { to: "/interviews", label: "Interviews", icon: Calendar },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

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
                    {/* KARTU PROMOSI TIER DENGAN TOMBOL POPUP */}
          <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-3 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-teal-900 text-xs">
              <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Career Booster Tier</span>
            </div>
            <p className="mt-1 text-[11px] text-teal-700 leading-snug">
              Dapatkan konsultasi 1-on-1 dan prioritas rekomendasi ke HR.
            </p>
            <button
              type="button"
              onClick={() => setShowSubscriptionModal(true)}
              className="mt-2.5 w-full rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition"
            >
              Lihat Paket Langganan
            </button>
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
                <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          currentTier="Free"
        />
      </aside>
    </div>
  );
}
