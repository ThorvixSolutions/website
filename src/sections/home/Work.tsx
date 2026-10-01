"use client";

import { useRef, useState } from "react";
import { work } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useScrollProgress, useWidth } from "@/lib/hooks";
import { easeInOutCubic, scrollToProgress } from "@/lib/scroll";
import { FONT, clamp01, cx, pad2, plain, rise } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const HEADING = "Products we *shipped.*";
const INTRO = "Web apps, mobile apps and AI features for startups and growing companies. Every one live, every one measured.";
const CASES = work.slice(0, 8);
const N = Math.max(1, CASES.length);
// 3×3 camera grid: the first case sits in the centre tile, the rest wrap around it
const TILES = Array.from({ length: 9 }, (_, i) => (i === 4 ? CASES[0] : CASES[(i + 1) % N]));
// block wipe between cases
const COLS = 14;
const ROWS = 8;
const BLOCKS = Array.from({ length: COLS * ROWS }, (_, i) => i);

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.05);
  const stack = w < 1100 || reduced;
  useMagnetic(ref, mounted);

  const [tick, setTick] = useState(0); // which case the progress ticks point at
  const [shown, setShown] = useState(0); // which case is on screen (lags behind the wipe)
  const [wipe, setWipe] = useState(0); // remounts the block wipe
  const [full, setFull] = useState(false);
  const busy = useRef(false);
  const queued = useRef(0);
  const holdUntil = useRef(0);
  const lastIdx = useRef(0);

  // swap the case halfway through the wipe; queue further changes until the wipe ends
  const go = (i: number) => {
    if (busy.current) {
      queued.current = i;
      return;
    }
    busy.current = true;
    queued.current = i;
    setWipe((n) => n + 1);
    window.setTimeout(() => setShown(queued.current), 430);
    window.setTimeout(() => {
      busy.current = false;
      if (queued.current !== i) go(queued.current);
    }, 900);
  };

  useScrollProgress(ref, mounted, reduced || stack, (_, pp) => {
    const el = ref.current;
    const grid = gridRef.current;
    if (!el || !grid) return;
    // first 30%: zoom the camera from the grid into the centre tile
    const z = easeInOutCubic(clamp01(pp / 0.3));
    const tw = grid.offsetWidth / 3;
    const th = grid.offsetHeight / 3;
    const maxScale = Math.min(4, Math.max(window.innerWidth / Math.max(1, tw - 4), window.innerHeight / Math.max(1, th - 4)));
    el.style.setProperty("--z", z.toFixed(4));
    el.style.setProperty("--zs", (1 + (maxScale - 1) * z).toFixed(4));
    const isFull = pp > 0.31 || performance.now() < holdUntil.current;
    setFull((f) => (f === isFull ? f : isFull));
    const fullEl = fullRef.current;
    if (fullEl && !isFull && fullEl.style.opacity) {
      fullEl.style.opacity = "";
      fullEl.style.transition = "";
      fullEl.style.pointerEvents = "";
    }
    // remaining 62%: step through the cases
    const i = Math.min(N - 1, Math.max(0, Math.floor(clamp01((pp - 0.34) / 0.62) * N)));
    if (i !== lastIdx.current) {
      lastIdx.current = i;
      setTick(i);
      if (reduced) setShown(i);
      else go(i);
    }
  });

  // tabbing into the case jumps straight to the full view
  const onFocusFull = () => {
    holdUntil.current = performance.now() + 2500;
    const el = ref.current;
    const fullEl = fullRef.current;
    if (el) {
      el.classList.add("is-full");
      el.style.setProperty("--z", "1");
      el.setAttribute("data-kb", "");
    }
    if (fullEl) {
      fullEl.style.transition = "none";
      fullEl.style.opacity = "1";
      fullEl.style.pointerEvents = "auto";
    }
    setFull(true);
    if (el && !full) scrollToProgress(el, 0.36);
  };

  const cur = CASES[shown] || CASES[0];

  return (
    <div ref={ref} className={cx("cg cgwk", stack && "is-stack", on && "is-on", full && "is-full", w < 810 && "is-ph")} style={{ ...FONT.B, ["--n" as string]: N }}>
      {stack ? (
        <section className="cg-wrap cgwk-list" aria-label={plain(HEADING)}>
          <Eyebrow text="Selected work" on={on} />
          <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 16 }} />
          <p className="cgwk-intro" style={rise(on, 200)}>
            {INTRO}
          </p>
          <div className="cgwk-cards">
            {CASES.map((c, i) => (
              <a className="cgwk-card" href={`/work/${c.slug}`} style={rise(on, 200 + i * 80)} key={c.slug}>
                <span className="cgwk-cimg">
                  <img src={c.img} alt="" loading="lazy" decoding="async" />
                  <em style={FONT.M}>{pad2(i + 1)}</em>
                </span>
                <span className="cgwk-cmeta" style={FONT.M}>
                  {c.f1} · {c.f2}
                </span>
                <span className="cgwk-ct" style={FONT.D}>
                  {c.f3}
                </span>
                <span className="cgwk-cres">
                  <b style={FONT.D}>{c.f4}</b>
                  <span>{c.f5}</span>
                </span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 34 }}>
            <Button href="/work" label="All case studies" kind="ghost" />
          </div>
        </section>
      ) : (
        <section className="cgwk-stage" aria-label={plain(HEADING)}>
          <div className="cg-wrap cgwk-head">
            <div>
              <Eyebrow text="Selected work" on={on} />
              <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 16 }} />
            </div>
            <p className="cgwk-intro" style={rise(on, 300)}>
              {INTRO}
            </p>
          </div>
          <div className="cgwk-cam">
            <div ref={gridRef} className="cgwk-grid">
              {TILES.map((c, i) => (
                <div
                  key={i}
                  className={cx("cgwk-tile", i === 4 && "is-c")}
                  style={{ transitionDelay: `${(Math.abs((i % 3) - 1) + Math.abs(Math.floor(i / 3) - 1)) * 90}ms` }}
                >
                  <img src={c.img} alt="" loading="lazy" decoding="async" draggable={false} />
                  {i !== 4 && c && (
                    <span className="cgwk-tl" style={FONT.M}>
                      {c.f1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div ref={fullRef} className="cgwk-full" onFocusCapture={onFocusFull}>
            {CASES.map((c, i) => (
              <img key={c.slug} className={i === shown ? "is-on" : ""} src={c.img} alt="" loading="lazy" decoding="async" />
            ))}
            <div className="cgwk-shade" />
            <div className="cgwk-blocks" aria-hidden key={wipe}>
              {wipe > 0 && BLOCKS.map((b) => <i key={b} style={{ animationDelay: `${((b % COLS) + Math.floor(b / COLS)) * 18}ms` }} />)}
            </div>
            <div className="cg-wrap cgwk-case cg-dark">
              <div className="cgwk-count" style={FONT.M}>
                <b>{pad2(shown + 1)}</b> / {pad2(N)}
                <span className="cgwk-ticks">
                  {CASES.map((_, i) => (
                    <i key={i} className={i === tick ? "is-on" : ""} />
                  ))}
                </span>
              </div>
              <div className="cgwk-copy" key={`c${shown}`}>
                <p className="cgwk-meta" style={FONT.M}>
                  {cur.f1} · {cur.f2} · {cur.f7}
                </p>
                <h3 className="cgwk-title" style={FONT.D}>
                  {cur.f3}
                </h3>
                <div className="cgwk-btns">
                  <Button href={`/work/${cur.slug}`} label="Read the case" kind="solid" />
                  <Button href="/work" label="All case studies" kind="ghost" />
                </div>
              </div>
              <div className="cgwk-res" key={`r${shown}`}>
                <b style={FONT.D}>{cur.f4}</b>
                <span style={FONT.M}>{cur.f5}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
