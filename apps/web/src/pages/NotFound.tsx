import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[rgb(var(--hero-bg))] bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.25),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.18),transparent_50%)] px-6">
      <div data-ct-dark className="text-center">
        <div className="text-sm text-white/55">404</div>
        <div className="mt-2 text-3xl font-semibold text-white">Page not found</div>
        <div className="mt-3 text-sm text-white/55">Return to CareerTrack.</div>
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="primary">Back to landing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
