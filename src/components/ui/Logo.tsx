import { cn } from "@/utils/cn";

export function Logo({ 
  className, 
  compact = false, 
  variant = "dark" // Default ke "dark" agar halaman-halaman lama Anda tetap berwarna putih
}: { 
  className?: string; 
  compact?: boolean; 
  variant?: "light" | "dark"; // Menambahkan pilihan tipe variant
}) {
  
  // Menentukan warna teks berdasarkan variant yang dipanggil
  const titleColor = variant === "light" ? "text-slate-900" : "text-white";
  const subtitleColor = variant === "light" ? "text-slate-500" : "text-slate-300";

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
            src="/Logo.png" // Sedikit koreksi: path folder public di web disarankan memakai /Logo.png agar terbaca di semua route
            alt="Logo" 
            className={cn("object-contain", compact ? "h-6 w-6" : "h-8 w-8")} 
          />
        </div>
      </div>
      {!compact && (
        <div className="leading-tight">
          {/* Warna teks sekarang dinamis mengikuti variabel di atas */}
          <div className={cn("text-sm font-semibold tracking-tight", titleColor)}>
            CareerTrack
          </div>
          <div className={cn("text-xs", subtitleColor)}>
            Career command center
          </div>
        </div>
      )}
    </div>
  );
}
