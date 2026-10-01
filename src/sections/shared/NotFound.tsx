"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic, useMounted, useReducedMotion, useReleased, useWidth } from "@/lib/hooks";
import { FONT, WIDE, cx, rise } from "@/lib/text";
import { Button } from "@/ui";

const CODE = "404".split("");
// the second character is "missing": a ghost glyph with a blinking block where it should be
const MISSING = 1;
const TERMINAL = "$ git checkout main";

export function NotFound() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);
  const [typed, setTyped] = useState(0);
  useMagnetic(ref, mounted);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  const on = entered || reduced;
  const typing = mounted && on && !reduced;

  useEffect(() => {
    if (!typing) return;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setTyped(n);
      if (n >= TERMINAL.length) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [typing]);

  const shown = typing ? TERMINAL.slice(0, typed) : TERMINAL;

  return (
    <section ref={ref} className={cx("cg cg-dark cg4", on && "is-on", w < 810 && "is-ph", reduced && "is-rm")} data-cg-w={w} style={FONT.B}>
      <div className="cg4-grid" aria-hidden />
      <div className="cg4-in">
        <p className="cg4-eb" style={{ ...FONT.M, ...rise(on, 0, 10) }}>
          <i aria-hidden />
          Error 404
        </p>
        <div className="cg4-code" style={{ ...FONT.D, ...WIDE }} aria-hidden>
          {CODE.map((ch, i) =>
            i === MISSING ? (
              <span className="cg4-gap" key={i}>
                <span className="cg4-ghost">{ch}</span>
                <span className="cg4-blk">
                  <i />
                </span>
              </span>
            ) : (
              <span className="cg4-ch" style={rise(on, 80 + i * 90, 60)} key={i}>
                {ch}
              </span>
            ),
          )}
        </div>
        <h1 className="cg4-h1" style={{ ...FONT.D, ...WIDE, ...rise(on, 360) }}>
          This page didn&apos;t ship.
        </h1>
        <p className="cg4-copy" style={rise(on, 460)}>
          The link is broken or the page moved. Everything else is live and running.
        </p>
        <div className="cg4-btns" style={rise(on, 560)}>
          <Button href="/" label="Back to home" kind="solid" />
          <Button href="/contact" label="Contact us" kind="ghost" />
        </div>
        <p className="cg4-term" style={{ ...FONT.M, ...rise(on, 660) }} aria-label={TERMINAL}>
          <span aria-hidden>{shown}</span>
          <i aria-hidden />
        </p>
      </div>
    </section>
  );
}
