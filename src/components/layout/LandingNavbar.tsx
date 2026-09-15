import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
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
        <div data-ct-dark className="mt-4 flex items-center justify-between rounded-full border border-white/5 bg-[#0b3e40]/85 backdrop-blur-md shadow-lg px-4 py-2">

          <Link to="/" className="focus-ring rounded-xl">
            <Logo compact />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="focus-ring rounded-lg text-sm text-white/70 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <NavLink to="/login" className="hidden sm:block">
              <Button variant="ghost" size="md"><span className="text-white">Login</span></Button>
            </NavLink>
            <NavLink to="/register">
              <Button variant="primary" size="md">Start Tracking</Button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
