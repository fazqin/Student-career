import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer data-ct-dark className="border-t border-teal-800 bg-[rgb(var(--hero-bg))]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm text-white/55">
              CareerTrack is a premium personal career command center for students — a calm,
              intelligent workspace to manage opportunities, applications, interviews, and deadlines.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Product
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#product" className="text-white/60 hover:text-white">Overview</a>
              </li>
              <li>
                <a href="#analytics" className="text-white/60 hover:text-white">Analytics</a>
              </li>
              <li>
                <a href="#tracking" className="text-white/60 hover:text-white">Tracking</a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
              App
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-white/60 hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to="/jobs" className="text-white/60 hover:text-white">Jobs</Link>
              </li>
              <li>
                <Link to="/applications" className="text-white/60 hover:text-white">
                  Applications
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} CareerTrack. Demo frontend.</div>
          <div className="flex items-center gap-4">
            <a className="text-white/45 hover:text-white" href="#">Twitter</a>
            <a className="text-white/45 hover:text-white" href="#">GitHub</a>
            <a className="text-white/45 hover:text-white" href="#">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
