import { useEffect, useState } from "react";
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
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out", 
        // Kunci: Berikan space konstan mt-4 ke atas layar di semua kondisi agar tidak mepet dinding browser
        "mt-4 sm:mt-6", 
        className
      )}
    >
      {/* Menggunakan max-w-full pada container pembungkus agar saat transparan bisa melebar bebas */}
      <div className={cn(
        "mx-auto w-full transition-all duration-500 ease-in-out",
        isTop ? "max-w-7xl px-4 sm:px-6" : "max-w-7xl px-4 sm:px-6"
      )}>
        <div 
          data-ct-dark 
          className={cn(
            "mx-auto flex h-16 w-full items-center justify-between border transition-all duration-500 ease-in-out",
            // Penyesuaian Style:
            isTop 
              ? "max-w-7xl rounded-none border-transparent bg-transparent shadow-none px-2 sm:px-4" // Transparan di atas: Tetap menjaga grid keselarasan halaman tanpa border kotak
              : "max-w-5xl rounded-full border-white/5 bg-[#0b3e40]/85 backdrop-blur-md shadow-2xl px-4 sm:px-6 lg:px-8" // Pas scroll: Mengempis jadi kapsul melayang yang indah
          )}
        >


          <Link to="/" className="flex h-full min-w-0 items-center justify-center">
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="h-[55px] w-auto shrink-0 object-contain transition-all duration-500 ease-in-out hover:scale-105" 
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
              <span className="text-sm font-medium text-white/80 hover:text-white transition">Login</span>
            </NavLink>
            <NavLink to="/register">
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
