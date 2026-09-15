import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight,  ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import Particles from "./Particles";

export function Hero({ className }: { className?: string }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setMouse({ x, y });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const layer = useMemo(() => {
    const tx = (n: number) => `translate3d(${mouse.x * n}px, ${mouse.y * n}px, 0)`;
    return {
      bg: { transform: tx(14) },
      text: { transform: tx(6) },
      cards: { transform: tx(22) },
    };
  }, [mouse.x, mouse.y]);

  return (
    <div className="w-full">
      {/* 1. SEKSI HERO PARALLAX (Bagian Atas yang Diam) */}
      <section
        ref={heroRef}
        data-ct-hero
        className={cn(
          "relative overflow-hidden pb-24 pt-28 sm:pb-28 sm:pt-32 min-h-[100vh] flex items-center justify-center",
          className
        )}
        style={{
          /* TRIK PARALLAX UTAMA: Mengunci gambar langsung ke latar belakang section */
          backgroundImage: "url('/Hero-bg.webp')", // Perbaikan path agar folder public terbaca root /
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Lapisan Filter Hijau Gelap Overlay & Efek Noise Konstan */}
        <div className="absolute inset-0 bg-[#0b3e40]/40 mix-blend-multiply pointer-events-none z-0" />
        <div className="noise absolute inset-0 opacity-40 pointer-events-none z-0" />

        <Particles
          particleColors={["#ffffff", "#5eead4", "#14b8a6"]}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          alphaParticles={true}
          disableRotation={false}
          mousePosition={mouse}
        />

        {/* Konten Teks & Fitur di Atas Latar Belakang */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 relative z-10">
          
          {/* 1. MENGUBAH GRID MENJADI FLEXBOX UNTUK PERATAAN TENGAH */}
          <div className="flex w-full flex-col items-center justify-center text-center">
            
            {/* 2. UBAH DARI lg:col-span-6 MENJADI KONTEN LEBAR PENULISAN TENGAH */}
            {/* Menambahkan max-w-3xl agar teks h1 desktop tidak terlalu molor panjang ke samping */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-lg text-teal-100">
                Premium personal career command center
              </div>

              <h1 className="mt-6  text-4xl font-semibold tracking-tight text-white sm:text-6xl max-w-4xl">
                Your career, finally under control.
                <br/> 
                Better than CDC.
              </h1>
              
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-teal-100/80 sm:text-lg">
                Track every opportunity, application, interview, and deadline in one intelligent workspace.
              </p>

              {/* 3. TOMBOL AKSI: Memastikan tombol berjejer tengah secara flex row */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center w-full">
                <a href="#register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Start Tracking <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="#product" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore CareerTrack
                  </Button>
                </a>
              </div>

              {/* 4. BADGES: Mengubah ke justify-center agar badge ikut memusat di tengah */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Badge variant="info">
                  <Timer className="text-white h-3.5 w-3.5" /> <span className="text-popins text-white">Deadlines visible</span>
                </Badge>
                <Badge variant="success">
                  <ShieldCheck className="text-white h-3.5 w-3.5" /><span className="text-popins text-white"> Calm & focused UI</span>
                </Badge>
                <Badge variant="default" className="border-teal-700 bg-[rgb(var(--hero-card))] text-white">Frontend-only demo (REST-ready)</Badge>
              </div>

              {/* 5. TIGA KARTU KECIL (STAGES, CLARITY, MOMENTUM) */}
            </div>
          </div>
        </div>

      </section>

      {/* 2. SEKSI SELIMUT PUTIH (Bagian Bawah yang Bergerak Naik Menutup Area Hijau) */}
      {/* z-20 dan bg-white wajib agar menimpa area fixed background di atasnya */}
      <div id="product" className="relative z-20 bg-white py-24 sm:py-32 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
            About Us
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Kenali Lebih Dekat CareerTrack
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-500">
            Bagian ini akan bergeser ke atas menutupi seksi hijau saat Anda melakukan scroll ke bawah, 
            meniru persis efek website SGA Cakrawala yang Anda inginkan.
          </p>
          {/* Lanjutkan konten halaman utama Anda di bawah sini */}
        </div>
      </div>
    </div>
  );
}
