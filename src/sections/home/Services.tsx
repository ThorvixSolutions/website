"use client";

import { CSSProperties, useRef, useState } from "react";
import { services } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useScrollProgress, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const HEADING = "Everything a product *needs.*";
const BODY = "Six teams under one roof, so design, code, AI and cloud ship together.";
const LIST = services.slice(0, 6);
const N = LIST.length;

const tools = (s: (typeof LIST)[number]) =>
  String(s.f6 || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.08);
  const pinned = w >= 1100;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(0);
  const activeRef = useRef(0);
  useMagnetic(ref, mounted);

  // while pinned, scroll progress picks the active service
  useScrollProgress(ref, mounted && pinned, reduced, (_, pp) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(pp * N * 0.9999)));
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
  });

  const jump = (i: number) => {
    const el = ref.current;
    setActive(i);
    activeRef.current = i;
    if (!el || !pinned) return;
    const r = el.getBoundingClientRect();
    const target = r.top + window.scrollY + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / N);
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  };

  const cur = LIST[active] || LIST[0];

  return (
    <section
      ref={ref}
      className={cx("cg cg-dark cgsv", pinned ? "is-pin" : "is-list", on && "is-on", reduced && "is-still")}
      style={{ ...FONT.B, ...(pinned ? { height: `${Math.max(2, N) * 58 + 40}vh` } : {}) }}
      aria-label={plain(HEADING)}
    >
      {pinned ? (
        <div className="cgsv-stick">
          <div className="cg-wrap cgsv-wrap">
            <div className="cgsv-left">
              <div className="cgsv-head">
                <Eyebrow text="Services" on={on} />
                <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 18 }} />
              </div>
              <div className="cgsv-panel" key={active}>
                <p className="cgsv-count" style={FONT.M}>
                  <b>{pad2(active + 1)}</b> / {pad2(N)}
                </p>
                <h3 className="cgsv-name" style={FONT.D}>
                  {cur.f1}
                </h3>
                <p className="cgsv-short">{cur.f2}</p>
                <div className="cgsv-out">
                  <b style={FONT.D}>{cur.f3}</b>
                  <span style={FONT.M}>{cur.f4}</span>
                </div>
                <ul className="cgsv-tools" style={FONT.M}>
                  {tools(cur).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <Button href={`/services/${cur.slug}`} label="Explore the service" kind="solid" />
              </div>
              <ol className="cgsv-index" style={FONT.M} aria-label="Services">
                {LIST.map((s, i) => (
                  <li key={s.slug}>
                    <button type="button" className={i === active ? "is-act" : ""} aria-current={i === active ? "true" : undefined} onClick={() => jump(i)}>
                      <span>{pad2(i + 1)}</span>
                      {s.f1}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="cgsv-scene" aria-hidden>
              <div className="cgsv-iso">
                {LIST.map((s, i) => (
                  <div
                    key={s.slug}
                    className={cx("cgsv-slab", i === active && "is-act", i < active && "is-past")}
                    style={{ "--i": i, "--z": N - 1 - i } as CSSProperties}
                  >
                    <div className="cgsv-top">
                      <span className="cgsv-tn" style={FONT.M}>
                        {pad2(i + 1)}
                      </span>
                      <span className="cgsv-tt" style={FONT.D}>
                        {s.f1}
                      </span>
                      <span className="cgsv-grid" />
                    </div>
                    <div className="cgsv-sf" />
                    <div className="cgsv-sr" />
                  </div>
                ))}
              </div>
              <p className="cgsv-cap" style={FONT.M}>
                <i />
                {`${pad2(active + 1)} · ${cur.f5 || ""} layer`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="cg-wrap cgsv-wrap cgsv-lwrap">
          <div className="cgsv-head">
            <Eyebrow text="Services" on={on} />
            <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 16 }} />
            <p className="cgsv-body" style={rise(on, 240)}>
              {BODY}
            </p>
          </div>
          <ul className="cgsv-acc">
            {LIST.map((s, i) => {
              const isOpen = open === i;
              return (
                <li key={s.slug} className={isOpen ? "is-open" : ""} style={rise(on, 200 + i * 80, 20)}>
                  <button type="button" className="cgsv-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span className="cgsv-mini" aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="cgsv-rn" style={FONT.M}>
                      {pad2(i + 1)}
                    </span>
                    <span className="cgsv-rt" style={FONT.D}>
                      {s.f1}
                    </span>
                    <span className="cgsv-pm" aria-hidden />
                  </button>
                  <div className="cgsv-body2" inert={!isOpen}>
                    <div>
                      <p className="cgsv-short">{s.f2}</p>
                      <div className="cgsv-out">
                        <b style={FONT.D}>{s.f3}</b>
                        <span style={FONT.M}>{s.f4}</span>
                      </div>
                      <ul className="cgsv-tools" style={FONT.M}>
                        {tools(s).map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <Button href={`/services/${s.slug}`} label="Explore the service" kind="solid" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {pinned && <p className="cg-sr">{BODY}</p>}
    </section>
  );
}
