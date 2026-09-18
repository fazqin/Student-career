import { RefObject, useEffect, useState } from "react";

export function useReveal<T extends HTMLElement>(ref: RefObject<T | null>, options?: {
  rootMargin?: string;
  threshold?: number;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin ?? "-10% 0px -10% 0px",
        threshold: options?.threshold ?? 0.15,
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, options?.rootMargin, options?.threshold]);

  return revealed;
}
