"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { services, work } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReleased, useReveal, useWidth } from "@/lib/hooks";
import { onFrame } from "@/lib/ticker";
import { FONT, WIDE, clamp01, cx, pad2, rise, splitList } from "@/lib/text";
import { ArrowRight, Button, Eyebrow, Heading } from "@/ui";

/** Which case study best illustrates each service layer (matched against "type industry"). */
const RELATED: Record<string, RegExp> = {
  web: /web|platform|commerce|dashboard/i,
  mobile: /mobile|app/i,
  ai: /\bai\b|assistant|dashboard/i,
  design: /web|app/i,
  cloud: /commerce|platform|web/i,
  team: /app|platform/i,
};
const tools = (s: string) =>
  String(s || "")
    .split(/[;,]/)
    .map((t) => t.trim())
    .filter(Boolean);

export function ServiceDetail({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pipeRef = useRef<HTMLElement>(null);
  const incRef = useRef<HTMLElement>(null);
  const caseRef = useRef<HTMLElement>(null);
  const othRef = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);
  useMagnetic(ref, mounted);

  const s = services.find((x) => x.slug === slug) || services[0];
  const index = Math.max(0, services.findIndex((x) => x.slug === s.slug));
  const steps = splitList(s.f8);
  const included = splitList(s.f9);
  const pattern = RELATED[String(s.f5 || "").toLowerCase()];
  const related = (pattern && work.find((c) => pattern.test(`${c.f7} ${c.f2}`))) || work[0];
  const others = services.filter((x) => x.slug !== s.slug);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  const intro = entered || reduced;
  const pipeOn = useReveal(pipeRef, mounted, reduced, 0.2);
  const incOn = useReveal(incRef, mounted, reduced, 0.2);
  const caseOn = useReveal(caseRef, mounted, reduced, 0.2);
  const othOn = useReveal(othRef, mounted, reduced, 0.2);

  // the pipeline rail fills as it scrolls up the screen; stages tick "passed" in turn
  useEffect(() => {
    if (!mounted || reduced || !pipeRef.current) return;
    const el = pipeRef.current;
    let top = 0, height = 1, vh = 900, last = -1;
    return onFrame(
      () => {
        const p = clamp01((vh * 0.78 - top) / Math.max(1, height * 0.85));
        el.style.setProperty("--p", p.toFixed(4));
        const pct = Math.round(p * 100);
        if (pct !== last) {
          last = pct;
          setProgress(p);
        }
      },
      () => {
        const r = el.getBoundingClientRect();
        top = r.top;
        height = r.height;
        vh = window.innerHeight || 900;
      },
    );
  }, [mounted, reduced]);

  const p = reduced ? 1 : progress;
  const total = Math.max(1, steps.length);
  const passed = (i: number) => p >= (i + 0.5) / total;
  const phone = w < 810;

  return (
    <div ref={ref} className={cx("cg cgsd", phone ? "is-ph" : w < 1100 && "is-tab", intro && "is-in", reduced && "is-still")} data-cg-w={w} style={FONT.B}>
      <section className="cgsd-top cg-dark" aria-label={s.f1}>
        <div className="cgsd-glow" aria-hidden />
        <div className="cgsd-w cgsd-tin">
          <div className="cgsd-tcopy">
            <nav className="cgsd-cr" aria-label="Breadcrumb" style={{ ...FONT.M, ...rise(intro, 0) }}>
              <ol>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <span aria-current="page">{s.f1}</span>
                </li>
              </ol>
            </nav>
            <p className="cgsd-meta" style={{ ...FONT.M, ...rise(intro, 80) }}>
              <b>{pad2(index + 1)}</b> / {pad2(services.length)} · {s.f5}
            </p>
            <Heading text={s.f1} on={intro} tag="h1" size={phone ? "clamp(40px,12vw,60px)" : "clamp(56px,7vw,120px)"} lh={0.9} delay={160} style={{ marginTop: 18 }} />
            <p className="cgsd-short" style={rise(intro, 420)}>
              {s.f2}
            </p>
            <div className="cgsd-btns" style={rise(intro, 520)}>
              <Button href={`/contact?service=${encodeURIComponent(s.slug)}`} label="Start a project" kind="solid" />
              <Button href="/work" label="See our work" kind="ghost" />
            </div>
          </div>
          <div className="cgsd-tside" style={rise(intro, 300)}>
            <div className="cgsd-iso" aria-hidden>
              {[0, 1, 2, 3].map((z) => (
                <div className="cgsd-slab" key={z} style={{ "--z": z, transitionDelay: `${(3 - z) * 120 + 350}ms` } as CSSProperties}>
                  <div className={cx("cgsd-top-f", z === 3 && "is-cap")}>
                    {z === 3 && (
                      <span className="cgsd-tt" style={FONT.D}>
                        {s.f1}
                      </span>
                    )}
                    <span className="cgsd-grid" />
                  </div>
                  <div className="cgsd-sf" />
                  <div className="cgsd-sr" />
                </div>
              ))}
            </div>
            <dl className="cgsd-kpi">
              <div>
                <dt style={FONT.M}>{s.f4}</dt>
                <dd style={{ ...FONT.D, ...WIDE }}>{s.f3}</dd>
              </div>
              <div>
                <dt style={FONT.M}>From</dt>
                <dd style={{ ...FONT.D, ...WIDE }}>{s.f10}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section ref={pipeRef} className={cx("cgsd-pipe", pipeOn && "is-on")} aria-label="How it works">
        <div className="cgsd-w">
          <div className="cgsd-hd">
            <Eyebrow text="How it works" on={pipeOn} />
            <Heading text="From brief to *release.*" on={pipeOn} style={{ marginTop: 18 }} />
          </div>
          <div className="cgsd-track" style={{ "--n": total } as CSSProperties}>
            <div className="cgsd-rail" aria-hidden>
              <i />
            </div>
            <ol>
              {steps.map((step, i) => (
                <li className={cx("cgsd-st", passed(i) && "is-pass")} style={rise(pipeOn, 150 + i * 110)} key={step}>
                  <span className="cgsd-node" aria-hidden>
                    <i />
                  </span>
                  <div className="cgsd-card">
                    <p className="cgsd-sh" style={FONT.M}>
                      <span>Stage {pad2(i + 1)}</span>
                      <em>{passed(i) ? "✓ Passed" : "···"}</em>
                    </p>
                    <b style={FONT.D}>{step}</b>
                    <span className="cgsd-bar" aria-hidden>
                      <i />
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section ref={incRef} className={cx("cgsd-inc", incOn && "is-on")} aria-label="What's included">
        <div className="cgsd-w cgsd-incw">
          <div>
            <Eyebrow text="What's included" on={incOn} />
            <Heading text="Everything in the *build.*" on={incOn} style={{ marginTop: 18 }} />
            <p className="cgsd-detail" style={rise(incOn, 300)}>
              {s.f7}
            </p>
          </div>
          <div>
            <ul className="cgsd-grid4">
              {included.map((x, i) => (
                <li style={rise(incOn, 200 + i * 90)} key={x}>
                  <em style={FONT.M}>{pad2(i + 1)}</em>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="cgsd-tools" style={rise(incOn, 600)}>
              <p style={FONT.M}>Stack we use</p>
              <ul>
                {tools(s.f6).map((t) => (
                  <li style={FONT.M} key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {related && (
        <section ref={caseRef} className={cx("cgsd-case", caseOn && "is-on")} aria-label="Related case">
          <div className="cgsd-w">
            <Eyebrow text="Related case" on={caseOn} />
            <a className="cgsd-cc cg-dark" href={`/work/${related.slug}`} style={rise(caseOn, 150, 30)}>
              <span className="cgsd-cph">
                <img src={related.img} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="cgsd-cin">
                <span className="cgsd-cm" style={FONT.M}>
                  {related.f1} · {related.f2} · {related.f7}
                </span>
                <b style={FONT.D}>{related.f3}</b>
                <span className="cgsd-cr2">
                  <b style={{ ...FONT.D, ...WIDE }}>{related.f4}</b>
                  <span style={FONT.M}>{related.f5}</span>
                </span>
                <span className="cgsd-cbtn" style={FONT.M}>
                  Read the case
                  <ArrowRight size={14} />
                </span>
              </span>
            </a>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section ref={othRef} className={cx("cgsd-oth", othOn && "is-on")} aria-label="Other services">
          <div className="cgsd-w">
            <Eyebrow text="Other services" on={othOn} />
            <ul>
              {others.map((o, i) => (
                <li style={rise(othOn, 120 + i * 80)} key={o.slug}>
                  <a href={`/services/${o.slug}`}>
                    <em style={FONT.M}>{pad2(services.findIndex((x) => x.slug === o.slug) + 1)}</em>
                    <b style={FONT.D}>{o.f1}</b>
                    <span style={FONT.M}>
                      {o.f3} · {o.f4}
                    </span>
                    <i aria-hidden>
                      <ArrowRight size={14} />
                    </i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
