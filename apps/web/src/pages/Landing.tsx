import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { FeatureStory } from "@/components/landing/FeatureStory";
import { TrackingKanban } from "@/components/landing/TrackingKanban";
import { LandingAnalytics } from "@/components/landing/LandingAnalytics";
import { InterviewPreview } from "@/components/landing/InterviewPreview";
import { IntelligenceSection } from "@/components/landing/IntelligenceSection";
import { Credibility } from "@/components/landing/Credibility";
import { CTASection } from "@/components/landing/CTASection";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function Landing() {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const hero = document.querySelector("[data-ct-hero]");
      const heroText = document.querySelector("[data-ct-hero-text]");
      const heroVisual = document.querySelector("[data-ct-hero-visual]");
      const showcase = document.querySelector("[data-ct-showcase]");

      if (hero && heroText && heroVisual) {
        gsap.to(heroText, {
          y: -24,
          opacity: 0.35,
          filter: "blur(6px)",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(heroVisual, {
          y: 48,
          rotateX: 6,
          rotateY: -8,
          scale: 0.92,
          transformOrigin: "50% 50%",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (showcase) {
        gsap.fromTo(
          showcase,
          { y: 26, opacity: 0.6, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scrollTrigger: {
              trigger: showcase,
              start: "top 80%",
              end: "top 55%",
              scrub: true,
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#0b3e40] overflow-x-hidden">
      <LandingNavbar />
      
      {/* Seluruh area seksi dibungkus relative agar hirarki sticky berjalan mulus */}
      <div className="relative">
        
        {/* 1. HERO SECTION (Lapisan Paling Bawah - Z-0) */}
        <div className="sticky top-0 z-0 w-full min-h-screen">
          <Hero />
        </div>

        {/* 2. PRODUCT SHOWCASE (Warna: Putih) */}
        <div className="relative sticky top-0 z-10 w-full min-h-screen bg-white text-slate-900 shadow-[0_-20px_40px_rgba(0,0,0,0.06)]">
          <ProductShowcase />
        </div>

        {/* 3. FEATURE STORY (Warna: Hijau Tua) */}
        <div className="relative sticky top-0 z-20 w-full min-h-screen bg-[#0b3e40] text-white shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
          <FeatureStory />
        </div>

        {/* 4. TRACKING KANBAN (Warna: Putih) */}
        <div className="relative sticky top-0 z-30 w-full min-h-screen bg-white text-slate-900 shadow-[0_-20px_40px_rgba(0,0,0,0.06)]">
          <TrackingKanban />
        </div>

        {/* 5. LANDING ANALYTICS (Warna: Hijau Tua) */}
        <div className="relative sticky top-0 z-40 w-full min-h-screen bg-[#0b3e40] text-white shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
          <LandingAnalytics />
        </div>

        {/* 6. INTERVIEW PREVIEW (Warna: Putih) */}
        <div className="relative sticky top-0 z-50 w-full min-h-screen bg-white text-slate-900 shadow-[0_-20px_40px_rgba(0,0,0,0.06)]">
          <InterviewPreview />
        </div>

        {/* 7. INTELLIGENCE SECTION (Warna: Hijau Tua) */}
        <div className="relative sticky top-0 z-50 w-full min-h-screen bg-[#0b3e40] text-white shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
          <IntelligenceSection />
        </div>

        {/* 8. CREDIBILITY (Warna: Putih) */}
        <div className="relative sticky top-0 z-50 w-full min-h-screen bg-white text-slate-900 shadow-[0_-20px_40px_rgba(0,0,0,0.06)]">
          <Credibility />
        </div>

        {/* 9. CTA SECTION (Lapisan Paling Atas - Warna: Hijau Tua) */}
        <div className="relative sticky top-0 z-50 w-full min-h-screen bg-[#0b3e40] text-white shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
          <CTASection />
        </div>

      </div>

      {/* Footer ditumpuk paling atas di bagian akhir halaman */}
      <div className="relative z-50 bg-[#062425]">
        <Footer />
      </div>
    </div>
  );
}
