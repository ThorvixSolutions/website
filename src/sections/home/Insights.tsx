"use client";

import { useEffect, useRef, useState } from "react";
import { posts } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, plain, rise } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const HEADING = "Notes from *the build*";
const POSTS = posts.slice(0, 3);
const STEPS = [32, 16, 8, 4];

/** Cover image that "renders in" through coarse pixel steps on hover. */
function Cover({ src, on, reduced }: { src: string; on: boolean; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    if (!on || reduced || busy.current) return;
    const cv = canvasRef.current;
    const img = imgRef.current;
    if (!cv || !img || !img.complete || !img.naturalWidth) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    busy.current = true;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    // cover-fit
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;
    let step = 0;
    let cancelled = false;
    let timer = 0;
    const draw = () => {
      if (cancelled) return;
      if (step >= STEPS.length) {
        ctx.clearRect(0, 0, cv.width, cv.height);
        busy.current = false;
        return;
      }
      const px = STEPS[step++];
      small.width = Math.max(1, Math.ceil(w / px));
      small.height = Math.max(1, Math.ceil(h / px));
      sctx.imageSmoothingQuality = "high";
      try {
        sctx.drawImage(img, (small.width - iw / px) / 2, (small.height - ih / px) / 2, iw / px, ih / px);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, small.width * px * dpr, small.height * px * dpr);
      } catch {
        ctx.clearRect(0, 0, cv.width, cv.height);
        busy.current = false;
        return;
      }
      timer = window.setTimeout(draw, 85);
    };
    draw();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      busy.current = false;
      ctx.clearRect(0, 0, cv.width, cv.height);
    };
  }, [on, reduced]);

  return (
    <div className="cgin-cov">
      <img ref={imgRef} src={src} alt="" loading="lazy" decoding="async" draggable={false} />
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}

export function Insights() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.12);
  const [hover, setHover] = useState(-1);
  useMagnetic(ref, mounted);

  return (
    <section ref={ref} className={cx("cg cgin", w < 810 ? "is-ph" : w < 1100 && "is-tab", on && "is-on")} style={FONT.B} aria-label={plain(HEADING)}>
      <div className="cg-wrap">
        <div className="cgin-head">
          <div>
            <Eyebrow text="Insights" on={on} />
            <Heading text={HEADING} on={on} delay={100} style={{ marginTop: 22 }} />
          </div>
          <div className="cgin-side" style={rise(on, 350)}>
            <p className="cgin-body">What we learn shipping products every two weeks: costs, stacks and the habits that keep projects on time.</p>
            <Button href="/blog" label="All articles" kind="ghost" />
          </div>
        </div>
        <ul className="cgin-grid">
          {POSTS.map((p, i) => (
            <li className="cgin-li" style={rise(on, 300 + i * 140, 50)} key={p.slug}>
              <a
                className="cgin-card"
                href={`/blog/${p.slug}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(-1)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(-1)}
              >
                <div className="cgin-media">
                  <Cover src={p.img} on={hover === i} reduced={reduced} />
                  <span className="cgin-chip" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
                  </span>
                  <span className="cgin-idx" style={FONT.M}>{`0${i + 1}`}</span>
                </div>
                <p className="cgin-meta" style={FONT.M}>
                  <span>{p.f2}</span>
                  <span>{p.f3}</span>
                  <span className="cgin-date">{p.f7}</span>
                </p>
                <h3 className="cgin-title" style={FONT.D}>
                  <span>{p.f1}</span>
                </h3>
                <p className="cgin-sum">{p.f4}</p>
                <span className="cgin-read" style={FONT.M}>
                  Read
                  <i aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
