"use client";

import { useEffect, useRef, useState } from "react";
import { services, site } from "@/data/cms";
import { resolveRgb } from "@/lib/cube";
import { useClock, useIsoLayoutEffect, useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { scrollToTop } from "@/lib/scroll";
import { FONT, WIDE, cx, parseLinks, rise } from "@/lib/text";
import { Button } from "@/ui";

const S = site[0];
const COMPANY = parseLinks("Work:/work, Process:/process, Pricing:/pricing, About:/about, Blog:/blog, Contact:/contact");
const LEGAL = parseLinks("Privacy:/privacy, Terms:/terms");
const SOCIALS = parseLinks(S.f9);
const WORDMARK = (S.f1 || "Codeforge").toUpperCase();

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.05);
  const time = useClock(mounted, S.f7);
  const year = mounted ? String(new Date().getFullYear()) : "2026";
  const [size, setSize] = useState(Math.min(40, 110.6 / Math.max(3, WORDMARK.length)));
  useMagnetic(ref, mounted);

  // fit the wordmark edge to edge (font-size in container-query width units)
  useIsoLayoutEffect(() => {
    const band = bandRef.current;
    const mark = markRef.current;
    if (!band || !mark) return;
    const fit = () => {
      const bw = band.clientWidth;
      const mw = mark.scrollWidth;
      if (bw > 0 && mw > 0)
        setSize((s) => {
          const next = (bw / mw) * s * 0.995;
          return Math.abs(next - s) > 0.05 ? Math.min(40, next) : s;
        });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(band);
    const t = window.setTimeout(fit, 900);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // grid behind the wordmark: cells light up orange along the pointer's path and fade out
  useEffect(() => {
    if (!mounted || !canvasRef.current || !bandRef.current || !ref.current) return;
    const cv = canvasRef.current;
    const band = bandRef.current;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const rgb = resolveRgb(ref.current, "var(--cg-brass)", "255,90,31");
    let W = 0, H = 0, dpr = 1, cell = 14, cols = 0, rows = 0;
    let heat = new Float32Array();
    let visible = false, dirty = true, raf = 0, running = true;
    const resize = () => {
      const r = band.getBoundingClientRect();
      W = Math.round(r.width);
      H = Math.round(r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cell = Math.max(9, Math.round(W / 110));
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      heat = new Float32Array(cols * rows);
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(band);
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
    io.observe(band);
    const noise = (n: number) => {
      const t = Math.sin(n * 91.7 + 17.3) * 43758.5453;
      return t - Math.floor(t);
    };
    const stamp = (x: number, y: number, radius: number, strength: number) => {
      const cx0 = Math.floor(x / cell);
      const cy0 = Math.floor(y / cell);
      for (let dy = -radius; dy <= radius; dy++)
        for (let dx = -radius; dx <= radius; dx++) {
          const c = cx0 + dx;
          const r = cy0 + dy;
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const d = Math.hypot(dx, dy);
          if (d > radius + 0.2) continue;
          const v = strength * (1 - d / (radius + 1)) * (0.6 + 0.4 * noise(c * 13 + r * 7));
          const i = r * cols + c;
          if (heat[i] < v) heat[i] = v;
        }
    };
    let lx = -1, ly = -1;
    const move = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      const r = band.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const dist = lx < 0 ? 0 : Math.hypot(x - lx, y - ly);
      const steps = Math.max(1, Math.ceil(dist / (cell * 0.6)));
      for (let s = 1; s <= steps; s++) stamp(lx < 0 ? x : lx + ((x - lx) * s) / steps, ly < 0 ? y : ly + ((y - ly) * s) / steps, 3, 1);
      lx = x;
      ly = y;
    };
    const leave = () => {
      lx = -1;
      ly = -1;
    };
    band.addEventListener("pointermove", move);
    band.addEventListener("pointerleave", leave);
    const touch = !window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const t0 = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (!reduced) {
        if (touch) {
          // no pointer: a slow sweep across the band
          const p = ((now - t0) / 4200) % 1;
          stamp(p * (W + 80) - 40, H * (0.5 + 0.3 * Math.sin(p * Math.PI * 4)), 4, 0.9);
        } else if (Math.random() < 0.08) stamp(Math.random() * W, Math.random() * H, 0, 0.8);
      }
      let hot = false;
      for (let i = 0; i < heat.length; i++)
        if (heat[i] > 0.01) {
          hot = true;
          break;
        }
      if (!hot && !dirty) return;
      dirty = false;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgb(226,226,226)";
      for (let x = 0; x <= W; x += cell) ctx.fillRect(x, 0, 1, H);
      for (let y = 0; y <= H; y += cell) ctx.fillRect(0, y, W, 1);
      for (let i = 0; i < heat.length; i++) {
        const v = heat[i];
        if (v < 0.01) {
          heat[i] = 0;
          continue;
        }
        const c = i % cols;
        const r = (i / cols) | 0;
        ctx.fillStyle = `rgba(${rgb},${Math.min(1, v * 1.6).toFixed(3)})`;
        ctx.fillRect(c * cell + 1, r * cell + 1, cell - 1, cell - 1);
        heat[i] = v * 0.965 - 0.004;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      band.removeEventListener("pointermove", move);
      band.removeEventListener("pointerleave", leave);
    };
  }, [mounted, reduced]);

  return (
    <footer ref={ref} className={cx("cg cg-dark cgft", w < 810 ? "is-ph" : w < 1100 && "is-tab", on && "is-on")} style={FONT.B}>
      <div className="cg-wrap">
        <div className="cgft-top">
          <div className="cgft-lead" style={rise(on, 0)}>
            <p className="cgft-kick" style={FONT.M}>
              <i />
              Have a product in mind?
            </p>
            <a className="cgft-mail" href={`mailto:${S.f4}`} style={{ ...FONT.D, ...WIDE }}>
              <span>{S.f4}</span>
              <em aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </em>
            </a>
            <div className="cgft-live" style={FONT.M}>
              {S.f10 && (
                <span>
                  <i className="cgft-led" />
                  {S.f10}
                </span>
              )}
              <span>{`Local time · ${S.f6 || "Austin"} ${time}`}</span>
            </div>
          </div>
          <nav className="cgft-cols" aria-label="Footer" style={rise(on, 150)}>
            <div>
              <p className="cgft-h" style={FONT.M}>
                Services
              </p>
              <ul>
                {services.slice(0, 6).map((s) => (
                  <li key={s.slug}>
                    <a href={`/services/${s.slug}`}>{s.f1}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="cgft-h" style={FONT.M}>
                Company
              </p>
              <ul>
                {COMPANY.map((l) => (
                  <li key={l.h}>
                    <a href={l.h}>{l.l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="cgft-h" style={FONT.M}>
                Social
              </p>
              <ul>
                {SOCIALS.map((l) => (
                  <li key={l.h}>
                    <a href={l.h} target="_blank" rel="noopener">
                      {l.l}
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <div className="cgft-mid" style={rise(on, 250)}>
          <span style={FONT.M}>{S.f11}</span>
          <Button
            href="#"
            label="Back to top"
            kind="quiet"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop(reduced);
            }}
          />
        </div>
        <div ref={bandRef} className="cgft-band" aria-hidden>
          <span ref={markRef} className="cgft-wm" style={{ ...FONT.D, ...WIDE, fontSize: `${size}cqw` }}>
            {WORDMARK}
          </span>
          <canvas ref={canvasRef} className="cgft-cv" />
        </div>
        <div className="cgft-legal" style={FONT.M}>
          <span>{`© ${year} ${S.f1 || "Codeforge"}`}</span>
          {LEGAL.map((l) => (
            <a href={l.h} key={l.h}>
              {l.l}
            </a>
          ))}
          <span className="cgft-made">Built in Austin, shipped worldwide</span>
        </div>
      </div>
    </footer>
  );
}
