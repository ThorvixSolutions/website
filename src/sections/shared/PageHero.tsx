"use client";

import { useEffect, useRef, useState } from "react";
import { resolveRgb } from "@/lib/cube";
import { useMounted, useReducedMotion, useReleased, useWidth } from "@/lib/hooks";
import { onFrame } from "@/lib/ticker";
import { FONT, WIDE, cx, parseLinks, rise, splitPairs } from "@/lib/text";
import { Scramble } from "@/ui/Scramble";

/** 5×7 pixel digits for the big page number on the right. */
const DIGITS: Record<string, string[]> = {
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};
const CELL = 26;

type Props = {
  /** two-digit page number, e.g. "01" */
  index: string;
  eyebrow: string;
  /** `|` breaks a line, `*word*` paints it orange */
  title: string;
  intro: string;
  /** "Home:/, Services:/services" */
  crumbs: string;
  /** "6|services;2 wk|sprint cycle" */
  facts: string;
};

/** Dark page header: breadcrumb, decoding title, key numbers, a pixel page number and a cursor-trail grid. */
export function PageHero({ index, eyebrow, title, intro, crumbs, facts }: Props) {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  // dotted grid; cells glow orange along the pointer path (or a slow drifting trail on touch)
  useEffect(() => {
    if (!mounted || reduced || !canvasRef.current || !ref.current) return;
    const cv = canvasRef.current;
    const host = ref.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const accent = resolveRgb(host, "var(--cg-brass)", "255,90,31");
    const white = resolveRgb(host, "var(--cg-cloud)", "255,255,255");
    let W = 0, H = 0, dpr = 1, cols = 0, rows = 0, heat = new Float32Array();
    let visible = true, px = -1, py = -1, lx = -1, ly = -1, hot = 0, dirty = true;
    const t0 = performance.now();
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const resize = () => {
      const r = host.getBoundingClientRect();
      W = Math.round(r.width);
      H = Math.round(r.height);
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cols = Math.ceil(W / CELL);
      rows = Math.ceil(H / CELL);
      heat = new Float32Array(cols * rows);
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
    io.observe(host);
    const noise = (n: number) => {
      const t = Math.sin(n * 91.7 + 17.3) * 43758.5;
      return t - Math.floor(t);
    };
    const stamp = (x: number, y: number, radius: number) => {
      const c0 = Math.floor(x / CELL), r0 = Math.floor(y / CELL);
      for (let dy = -radius; dy <= radius; dy++)
        for (let dx = -radius; dx <= radius; dx++) {
          const c = c0 + dx, r = r0 + dy;
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const d = Math.hypot(dx, dy);
          if (d > radius + 0.3) continue;
          const v = (1 - d / (radius + 1)) * (0.5 + 0.5 * noise(c * 13 + r * 7));
          const i = r * cols + c;
          if (heat[i] < v) heat[i] = v;
        }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const leave = () => {
      px = -1;
      lx = -1;
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    const stop = onFrame((now) => {
      if (!visible) return;
      if (px >= 0) {
        const steps = lx < 0 ? 1 : Math.max(1, Math.ceil(Math.hypot(px - lx, py - ly) / 12));
        for (let s = 1; s <= steps; s++) stamp(lx < 0 ? px : lx + ((px - lx) * s) / steps, lx < 0 ? py : ly + ((py - ly) * s) / steps, 2);
        lx = px;
        ly = py;
      } else if (!fine) {
        const t = (now - t0) / 1000;
        stamp(((t * 90) % (W + 400)) - 200, H * 0.5 + Math.sin(t * 0.8) * H * 0.3, 2);
      }
      if (!hot && !dirty && px < 0 && fine) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      hot = 0;
      dirty = false;
      ctx.fillStyle = `rgba(${white},.05)`;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (noise(r * cols + c) > 0.82) ctx.fillRect(c * CELL + CELL / 2 - 1, r * CELL + CELL / 2 - 1, 2, 2);
      for (let i = 0; i < heat.length; i++) {
        const v = heat[i];
        if (v < 0.02) {
          heat[i] = 0;
          continue;
        }
        hot++;
        ctx.fillStyle = `rgba(${accent},${Math.min(0.85, v * 0.9).toFixed(3)})`;
        ctx.fillRect((i % cols) * CELL + 2, ((i / cols) | 0) * CELL + 2, 22, 22);
        heat[i] = v * 0.95 - 0.005;
      }
    });
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [mounted, reduced]);

  const on = entered || reduced;
  const num = String(index || "").replace(/\D/g, "").slice(0, 2);
  const crumbList = parseLinks(crumbs);
  const factList = splitPairs(facts);
  const label = title.replace(/\*/g, "").replace(/\s*\|\s*/g, " ").trim();
  let dot = 0;

  return (
    <section ref={ref} className={cx("cg cg-dark cgph", on && "is-on", w < 810 ? "is-ph" : w < 1100 && "is-tab")} data-cg-w={w} style={FONT.B}>
      <canvas ref={canvasRef} className="cgph-cv" aria-hidden />
      <div className="cgph-glow" aria-hidden />
      <div className="cgph-in">
        <div className="cgph-copy">
          {crumbList.length > 0 && (
            <nav className="cgph-crumbs" aria-label="Breadcrumb" style={{ ...FONT.M, ...rise(on, 0, 10) }}>
              <ol>
                {crumbList.map((c, i) => (
                  <li key={c.h}>
                    {i < crumbList.length - 1 ? <a href={c.h}>{c.l}</a> : <span aria-current="page">{c.l}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <p className="cgph-eb" style={{ ...FONT.M, ...rise(on, 80, 10) }}>
            <i aria-hidden />
            {num ? `[${num}] ` : ""}
            {eyebrow}
          </p>
          <h1 className="cgph-h1" style={{ ...FONT.D, ...WIDE }} aria-label={label}>
            {title.split("|").map((line, li) => (
              <span className="cgph-l" aria-hidden key={li}>
                <span style={rise(on, 140 + li * 110, 70)}>
                  {line
                    .split(/(\*[^*]+\*)/)
                    .filter(Boolean)
                    .map((part, k) =>
                      /^\*.+\*$/.test(part) ? (
                        <em className="cgph-acc" key={k}>
                          <Scramble text={part.slice(1, -1)} on={on} delay={260 + li * 110} still={reduced} />
                        </em>
                      ) : (
                        <Scramble text={part} on={on} delay={200 + li * 110} still={reduced} key={k} />
                      ),
                    )}
                </span>
              </span>
            ))}
          </h1>
          {intro && (
            <p className="cgph-intro" style={rise(on, 420)}>
              {intro}
            </p>
          )}
          {factList.length > 0 && (
            <dl className="cgph-facts" style={rise(on, 540)}>
              {factList.map((f) => (
                <div key={f.b}>
                  <dt style={FONT.M}>{f.b}</dt>
                  <dd style={{ ...FONT.D, ...WIDE }}>{f.a}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="cgph-side" aria-hidden>
          {num && (
            <div className="cgph-num" aria-hidden>
              {num.split("").map((d, di) => (
                <div className="cgph-dg" key={di}>
                  {(DIGITS[d] || DIGITS[0])
                    .join("")
                    .split("")
                    .map((bit, k) => {
                      const n = dot++;
                      return <i key={k} className={bit === "1" ? "is-on" : ""} style={bit === "1" ? { transitionDelay: `${200 + ((n * 37) % 23) * 38}ms` } : undefined} />;
                    })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
