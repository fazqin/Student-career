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
    <div ref={rootRef} className="min-h-screen">
      <LandingNavbar />
      <div className="relative">
        <Hero />
        <div data-ct-light>
          <ProductShowcase />
          <FeatureStory />
          <TrackingKanban />
          <LandingAnalytics />
          <InterviewPreview />
          <IntelligenceSection />
          <Credibility />
          <CTASection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
