import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const nav = [
  { label: "Product", href: "#product" },
  { label: "Tracking", href: "#tracking" },
  { label: "Analytics", href: "#analytics" },
  { label: "Interviews", href: "#interviews" },
];

export function LandingNavbar({ className }: { className?: string }) {
  return (
    <header className={cn("fixed left-0 right-0 top-0 z-50", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div data-ct-dark className="mx-auto mt-2 sm:mt-4 lg:mt-6 flex h-16 w-full max-w-5xl items-center justify-between rounded-full border border-white/5 bg-[#0b3e40]/85 backdrop-blur-md shadow-2xl px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out">

          <Link to="/" className="flex h-full min-w-0 items-center justify-center">
            <img 
              src="Public\Logo.png" 
              alt="Logo" 
              className="h-[65px] w-auto shrink-0 object-contain transition-all duration-500 ease-in-out hover:scale-105" 
            />
          </Link>

          <nav className="hidden items-center justify-center gap-10 md:flex text-md font-medium">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="focus-ring rounded-lg text-md text-white/70 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <NavLink to="/login" className="hidden sm:block">
              {/* Tombol Login dibuat bersih berupa text link agar tidak tabrakan estetika */}
              <span className="text-sm font-medium text-white/80 hover:text-white transition">Login</span>
            </NavLink>
            <NavLink to="/register">
              {/* Ditambahkan rounded-full kustom jika button komponen mendukung className, atau langsung pakai style kapsul */}
              <Button 
                variant="primary" 
                size="md" 
                className="rounded-full px-5 py-2 !bg-[#d4a359] !text-white font-medium text-sm transition hover:brightness-110 shadow-sm"
              >
                Start Tracking
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
