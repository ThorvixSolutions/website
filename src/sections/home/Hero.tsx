"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/cms";
import { resolveRgb, startCube } from "@/lib/cube";
import { useClock, useMagnetic, useMounted, useReducedMotion, useReleased, useWidth } from "@/lib/hooks";
import { onFrame } from "@/lib/ticker";
import { FONT, WIDE, clamp01, cx, rise, splitList, splitPairs } from "@/lib/text";
import { Button } from "@/ui";

const S = site[0];
const STATS = "140+|products shipped;2 wk|to the first release;4.9/5|client rating";
const SHIP_LABELS = splitList("Module 08 · incoming;Merging into main;Shipped to production");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const time = useClock(mounted, S.f7);

  const [entered, setEntered] = useState(false);
  const [phase, setPhase] = useState(2);
  const [hasGl, setHasGl] = useState(false);
  const [hasCur, setHasCur] = useState(false);
  const inRef = useRef(false);
  useEffect(() => {
    inRef.current = entered;
  }, [entered]);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 120);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  useMagnetic(ref, mounted);

  const phone = w < 810;
  const tablet = w >= 810 && w < 1100;

  // WebGL cube
  useEffect(() => {
    if (!mounted || !canvasRef.current || !objRef.current || !ref.current) return;
    return startCube({
      canvas: canvasRef.current,
      host: objRef.current,
      accent: resolveRgb(ref.current, "var(--cg-brass)", "255,90,31"),
      reduced,
      phone: window.innerWidth < 810,
      isIn: () => inRef.current,
      onPhase: setPhase,
      onReady: () => setHasGl(true),
    });
  }, [mounted, reduced]);

  // --sy: 0 → 1 over the first viewport of scroll; the headline lines drift apart with it
  useEffect(() => {
    if (!mounted || reduced || !ref.current) return;
    const el = ref.current;
    let y = 0, vh = 900;
    return onFrame(
      () => el.style.setProperty("--sy", clamp01(y / vh).toFixed(4)),
      () => {
        y = window.scrollY;
        vh = window.innerHeight || 900;
      },
    );
  }, [mounted, reduced]);

  // custom cursor: a dot everywhere, a "Drag" ring over the cube, hidden over buttons
  useEffect(() => {
    if (!mounted || !ref.current || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const el = ref.current;
    const cur = curRef.current;
    if (!cur) return;
    setHasCur(true);
    let tx = -99, ty = -99, x = -99, y = -99, mode = "", inside = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      inside = true;
      const target = e.target as Element;
      const next = target.closest?.(".cg-btn, a, button") ? "btn" : target.closest?.(".cgh-obj") ? "lbl" : "";
      if (next !== mode) {
        mode = next;
        cur.dataset.m = next;
      }
    };
    const leave = () => {
      inside = false;
      mode = "out";
      cur.dataset.m = "out";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const stop = onFrame(() => {
      if (!inside && x < -50) return;
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      cur.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    });
    return () => {
      stop();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [mounted]);

  const stats = splitPairs(STATS);

  return (
    <section
      ref={ref}
      className={cx("cg cg-dark cgh", entered && "is-in", hasCur && "has-cur", phone ? "is-ph" : tablet && "is-tab", hasGl && "has-gl")}
      data-cg-w={w}
      style={FONT.B}
      aria-label="Intro"
    >
      <div className="cgh-glow" aria-hidden />
      <div className="cgh-grain" aria-hidden />
      <div className="cgh-wrap">
        <div className="cgh-navsp" aria-hidden />
        <div className="cgh-labels" style={{ ...FONT.M, ...rise(entered, 120) }} aria-hidden>
          <span>[01] {S.f2}</span>
          <span>
            <i className="cgh-led" />
            {S.f10}
          </span>
          <span>{`${S.f6.toUpperCase()} — ${time}`}</span>
        </div>
        <h1 className="cgh-h1" style={{ ...FONT.D, ...WIDE }} aria-label="Software that ships.">
          <span className="cgh-l cgh-l1" aria-hidden>
            <span style={rise(entered, 180, 90)}>Software</span>
          </span>
          <span className="cgh-l cgh-l2" aria-hidden>
            <span style={rise(entered, 300, 90)}>
              that <em className="cgh-acc">ships.</em>
            </span>
          </span>
        </h1>
      </div>
      <div
        ref={objRef}
        className="cgh-obj"
        data-cur="Drag"
        role="img"
        aria-label="Eight glossy blocks forming a cube; the orange block flies in and snaps into place"
      >
        <canvas ref={canvasRef} className="cgh-cv" />
        <div className="cgh-tag" style={FONT.M} aria-live="off">
          <i className={phase === 2 ? "is-ok" : ""} />
          <span className="cgh-swap" key={phase}>
            {SHIP_LABELS[phase]}
          </span>
        </div>
      </div>
      <div className="cgh-foot">
        <div className="cgh-copy" style={rise(entered, 520)}>
          <p className="cgh-sub">
            Thorvix is a software development studio. We design, build and ship web apps, mobile apps and AI features for startups and growing
            companies, one working release every two weeks.
          </p>
          <div className="cgh-btns">
            <Button href="/contact" label="Start a project" kind="solid" />
            <Button href="/work" label="See our work" kind="ghost" />
          </div>
        </div>
        <div className="cgh-stats" style={rise(entered, 680)}>
          {stats.map((s) => (
            <div className="cgh-stat" key={s.a}>
              <b style={{ ...FONT.D, ...WIDE }}>{s.a}</b>
              <span style={FONT.M}>{s.b}</span>
            </div>
          ))}
        </div>
      </div>
      <div ref={curRef} className="cgh-cur" aria-hidden data-m="out">
        <span className="cgh-dot" />
        <span className="cgh-ring" style={FONT.M}>
          Drag
        </span>
      </div>
    </section>
  );
}
