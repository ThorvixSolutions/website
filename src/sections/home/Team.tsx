"use client";

import { FocusEvent, PointerEvent, useRef } from "react";
import { team } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const HEADING = "Minds behind the *machines.*";
const PEOPLE = team.slice(0, 8);
// photos resolve through an 8×10 grid of squares that blink away
const PX = 8 * 10;
const noise = (n: number) => {
  const t = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return t - Math.floor(t);
};

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.18);
  const phone = w < 810;
  const tablet = w >= 810 && w < 1100;
  useMagnetic(ref, mounted);

  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reduced) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
  };
  const untilt = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  // keep a focused card visible when the row scrolls sideways (tablet / phone)
  const reveal = (e: FocusEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const row = card.parentElement;
    if (!row || row.scrollWidth <= row.clientWidth + 2) return;
    if (card.offsetLeft < row.scrollLeft + 20 || card.offsetLeft + card.offsetWidth > row.scrollLeft + row.clientWidth - 20) {
      row.scrollTo({ left: Math.max(0, card.offsetLeft - 20), behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <section ref={ref} id="team" className={cx("cg cgtm", on && "is-on", phone ? "is-ph" : tablet && "is-tab")} style={FONT.B} aria-label={plain(HEADING)}>
      <div className="cg-wrap">
        <div className="cgtm-top">
          <div className="cgtm-hl">
            <Eyebrow text="The team" on={on} />
            <Heading text={HEADING} on={on} delay={120} />
          </div>
          <div className="cgtm-side" style={rise(on, 300)}>
            <p>
              A dedicated core of specialists building the future of enterprise intelligence. No layers, no account managers: you work directly
              with the people who build.
            </p>
            <Button href="/about" label="Meet the whole team" kind="ghost" />
          </div>
        </div>
        <div className="cgtm-row">
          {PEOPLE.map((p, i) => (
            <article
              key={p.slug}
              className="cgtm-card"
              tabIndex={0}
              aria-label={`${p.f1}, ${p.f2}`}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              onFocus={reveal}
              style={rise(on, 150 + i * 110, 30)}
            >
              <div className="cgtm-ph">
                {p.img && <img src={p.img} alt={`${p.f1}, ${p.f2}`} loading="lazy" decoding="async" draggable={false} />}
                {!reduced && (
                  <div className="cgtm-px" aria-hidden>
                    {Array.from({ length: PX }, (_, n) => {
                      const r = noise(n + i * 131);
                      return <i key={n} className={r < 0.16 ? "is-hot" : ""} style={{ animationDelay: `${Math.round(i * 160 + r * 950)}ms` }} />;
                    })}
                  </div>
                )}
                <span className="cgtm-idx" style={FONT.M}>
                  {pad2(i + 1)} / {pad2(PEOPLE.length)}
                </span>
                <div className="cgtm-bio">
                  <p>{p.f3}</p>
                </div>
              </div>
              <div className="cgtm-meta">
                <b>{p.f1}</b>
                <span style={FONT.M}>
                  <i aria-hidden />
                  {p.f2}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
