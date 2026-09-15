import { cn } from "@/utils/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("group inline-flex items-center gap-3", className)} aria-label="CareerTrack">
      <div
        className={cn(
          "relative grid place-items-center rounded-lg border border-teal-800 bg-[rgb(var(--hero-bg))] shadow-[0_12px_28px_-14px_rgba(8,51,53,0.65)]",
          compact ? "h-9 w-9" : "h-11 w-11"
        )}
      >
        <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.35),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(234,179,8,0.2),transparent_55%)]" />
        <div className="relative w-full h-full p-1.5 flex items-center justify-center">
  <img 
    src="..\Public\Logo.png" 
    alt="Logo" 
    className={cn("object-contain", compact ? "h-6 w-6" : "h-8 w-8")} 
  />
</div>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-slate-900 group-data-[ct-dark]:text-white">CareerTrack</div>
          <div className="text-xs text-slate-500 group-data-[ct-dark]:text-white/60">Career command center</div>
        </div>
      )}
    </div>
  );
}
