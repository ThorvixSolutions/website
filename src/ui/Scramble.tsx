"use client";

import { useEffect, useState } from "react";

const GLYPHS = "{}[]<>/=*#01";
const scramble = (s: string) => s.replace(/\S/g, () => GLYPHS[(Math.random() * 12) | 0]);

/**
 * Text that "decodes": it shows random glyphs, then resolves left to right over `dur` ms
 * once `on` turns true. `still` shows the plain text.
 */
export function Scramble({ text, on, delay = 0, dur = 800, still }: { text: string; on: boolean; delay?: number; dur?: number; still?: boolean }) {
  const [frame, setFrame] = useState<string | null>(null);
  useEffect(() => {
    if (!on || still) return;
    let raf = 0;
    let last = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const p = (now - start) / dur;
      if (p >= 1) {
        setFrame(null);
        return;
      }
      if (now - last > 45) {
        last = now;
        if (p < 0) setFrame(scramble(text));
        else {
          const keep = Math.floor(p * text.length);
          setFrame(text.slice(0, keep) + scramble(text.slice(keep)));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, text, still, delay, dur]);
  return <>{on && !still && frame !== null ? frame : text}</>;
}
