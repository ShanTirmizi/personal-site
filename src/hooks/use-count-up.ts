"use client";

import { useEffect, useRef, useState } from "react";

// Counts 0 → target with the handoff's easing (ease-out cubic, ~1.2s) the first
// time the element scrolls into view. Honors prefers-reduced-motion.
export function useCountUp(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const ease = (x: number) => 1 - Math.pow(1 - x, 3);
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / duration);
              setValue(target * ease(p));
              if (p < 1) raf = requestAnimationFrame(tick);
              else setValue(target);
            };
            raf = requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
}
