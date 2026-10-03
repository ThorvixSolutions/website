"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { site } from "@/data/cms";
import { useHtmlClass, useMounted } from "@/lib/hooks";
import { easeInOutCubic } from "@/lib/scroll";
import { FONT, WIDE, clamp01, splitList } from "@/lib/text";

const NAME = site[0].f1 || "Thorvix";
const LINES = splitList("Compiling modules;Running 318 tests;Deploying;Live").slice(0, 5);
const DURATION = 2.5;
const GLYPHS = "{}[]<>/=*#01";
const FILL_SPREAD = 1.1;

// the 64 squares light up in a fixed shuffled order
const ORDER = Array.from({ length: 64 }, (_, i) => i).sort(
  (a, b) => ((((Math.sin(a * 12.9898) * 43758.5453) % 1) + 1) % 1) - ((((Math.sin(b * 12.9898) * 43758.5453) % 1) + 1) % 1),
);
const RANK: number[] = [];
ORDER.forEach((v, i) => (RANK[v] = i));

/**
 * First-visit loader: an 8×8 grid fills in while a build log ticks over, then the squares
 * gather into the four-block logo, the name decodes, and dark blocks fall away to reveal the page.
 * Shown once per browser session; BOOT_SCRIPT in lib/boot.ts decides whether it runs.
 */
export function Loader() {
  const mounted = useMounted();
  // the boot script sets `cgld-go` on <html> when this visit gets the loader
  const active = useHtmlClass("cgld-go");
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"shell" | "fill" | "mark" | "exit">("shell");
  const [pct, setPct] = useState(0);
  const [name, setName] = useState(NAME);

  useEffect(() => {
    if (!mounted || !active || !ref.current) return;
    const html = document.documentElement;
    const finish = () => html.classList.remove("cgld-go", "cg-hold-ld", "cgld-rm");
    // the CSS fades the loader out after 8s if this script never runs; it does, so cancel that
    ref.current.style.animation = "none";
    const timers: number[] = [];
    let raf = 0;
    let alive = true;
    const remember = () => {
      try {
        sessionStorage.setItem("cg-loaded", "1");
      } catch {}
    };
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    if (html.classList.contains("cgld-rm")) {
      later(() => {
        setStage("mark");
        setPct(100);
      }, 0);
      timers.push(
        window.setTimeout(() => {
          html.classList.remove("cg-hold-ld");
          remember();
          setStage("exit");
        }, 450),
      );
      timers.push(window.setTimeout(finish, 850));
      return () => timers.forEach((t) => window.clearTimeout(t));
    }

    const total = Math.max(1.6, DURATION) * 1000;
    const fillTime = total * 0.52;
    const markTime = total * 0.22;
    later(() => setStage("fill"), 0);
    const start = performance.now();
    const tick = (now: number) => {
      if (!alive) return;
      const p = clamp01((now - start) / fillTime);
      setPct(Math.round(easeInOutCubic(p) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // gather into the logo while the name decodes from random glyphs
    timers.push(
      window.setTimeout(() => {
        setStage("mark");
        let k = 0;
        const id = window.setInterval(() => {
          k++;
          const p = k / 14;
          if (p >= 1) {
            setName(NAME);
            window.clearInterval(id);
            return;
          }
          const keep = Math.floor(p * NAME.length);
          setName(NAME.slice(0, keep) + NAME.slice(keep).replace(/\S/g, () => GLYPHS[(Math.random() * 12) | 0]));
        }, 36);
        timers.push(id);
      }, fillTime),
    );
    timers.push(
      window.setTimeout(() => {
        setStage("exit");
        html.classList.remove("cg-hold-ld");
        remember();
      }, fillTime + markTime + 260),
    );
    timers.push(window.setTimeout(finish, fillTime + markTime + 260 + 720 + 420));
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, [mounted, active]);

  if (mounted && !active) return null;
  const step = Math.min(LINES.length, Math.floor((pct / 100) * LINES.length + 1e-4));

  return (
    <div ref={ref} className={`cgld cgld-${stage}`} aria-hidden>
      <div className="cgld-blocks">
        {Array.from({ length: 24 }, (_, i) => {
          const c = i % 6;
          const r = Math.floor(i / 6);
          const n = (((Math.sin(i * 7.13) * 9973) % 1) + 1) % 1;
          return <i key={i} style={{ "--d": `${Math.round((5 - c) * 45 + (3 - r) * 60 + n * 90)}ms`, "--r": `${((n - 0.5) * 16).toFixed(2)}deg` } as CSSProperties} />;
        })}
      </div>
      <div className="cgld-stage">
        <div className="cgld-grid">
          {Array.from({ length: 64 }, (_, i) => {
            const x = i % 8;
            const y = Math.floor(i / 8);
            const quad = (y < 4 ? 0 : 2) + (x < 4 ? 0 : 1);
            const orange = RANK[i] % 9 === 4;
            return (
              <i
                key={i}
                className={`q${quad}${orange ? " is-o" : ""}`}
                style={{ "--x": x, "--y": y, "--fd": `${Math.round((RANK[i] / 64) * FILL_SPREAD * 1000)}ms`, "--tx": quad % 2, "--ty": quad > 1 ? 1 : 0 } as CSSProperties}
                data-acc={orange || quad === 3 ? 1 : 0}
              />
            );
          })}
        </div>
        <p className="cgld-name" style={{ ...FONT.D, ...WIDE }}>
          {name}
        </p>
      </div>
      <div className="cgld-log" style={FONT.M}>
        <span className="cgld-pct">{String(pct).padStart(3, "0")}</span>
        <ul>
          {LINES.map((l, i) => (
            <li key={l} className={i < step ? "is-done" : i === step ? "is-on" : ""}>
              <i />
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
