"use client";

import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { services, type ServiceRow } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { onFrame } from "@/lib/ticker";
import { FONT, WIDE, clamp01, cx, pad2, rise, splitList } from "@/lib/text";
import { Button, Heading } from "@/ui";

const N = services.length;
const tools = (s: string) =>
  String(s || "")
    .split(/[;,]/)
    .map((t) => t.trim())
    .filter(Boolean);

/** One service as a full chapter: copy on the left, a four-slab isometric stack on the right. */
function Chapter({ s, i, mounted, reduced, onEl }: { s: ServiceRow; i: number; mounted: boolean; reduced: boolean; onEl: (i: number, el: HTMLElement | null) => void }) {
  const ref = useRef<HTMLElement>(null);
  const on = useReveal(ref, mounted, reduced, 0.22);
  return (
    <article
      ref={(el) => {
        ref.current = el;
        onEl(i, el);
      }}
      id={`svc-${s.slug}`}
      className={cx("cgsl-ch", on && "is-on")}
      aria-labelledby={`cgsl-h-${s.slug}`}
    >
      <div className="cgsl-copy">
        <p className="cgsl-meta" style={FONT.M}>
          <b>{pad2(i + 1)}</b> / {pad2(N)} · {s.f5}
        </p>
        <Heading text={s.f1} on={on} size="clamp(34px,4.2vw,64px)" style={{ marginTop: 14 }} className="cgsl-h" />
        <span id={`cgsl-h-${s.slug}`} className="cg-sr">
          {s.f1}
        </span>
        <p className="cgsl-short" style={rise(on, 200)}>
          {s.f2}
        </p>
        <p className="cgsl-detail" style={rise(on, 280)}>
          {s.f7}
        </p>
        <div className="cgsl-inc" style={rise(on, 360)}>
          <p style={FONT.M}>Included</p>
          <ul>
            {splitList(s.f9).map((x) => (
              <li style={FONT.M} key={x}>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="cgsl-facts" style={rise(on, 440)}>
          <div>
            <b style={{ ...FONT.D, ...WIDE }}>{s.f3}</b>
            <span style={FONT.M}>{s.f4}</span>
          </div>
          <div>
            <b style={{ ...FONT.D, ...WIDE }}>{s.f10}</b>
            <span style={FONT.M}>From</span>
          </div>
          <div className="cgsl-tools">
            <span style={FONT.M}>Stack</span>
            <p>{tools(s.f6).join(" · ")}</p>
          </div>
        </div>
        <div style={rise(on, 520)}>
          <Button href={`/services/${s.slug}`} label="Explore the service" kind="ghost" ariaLabel={`Explore the service: ${s.f1}`} />
        </div>
      </div>
      <div className="cgsl-vis" aria-hidden>
        <div className="cgsl-iso">
          {[0, 1, 2, 3].map((z) => (
            <div className="cgsl-slab" key={z} style={{ "--z": z, transitionDelay: `${(3 - z) * 110 + 150}ms` } as CSSProperties}>
              <div className={cx("cgsl-top", z === 3 && "is-cap")}>
                {z === 3 && (
                  <>
                    <span className="cgsl-tn" style={FONT.M}>
                      {pad2(i + 1)}
                    </span>
                    <span className="cgsl-tt" style={FONT.D}>
                      {s.f1}
                    </span>
                  </>
                )}
                <span className="cgsl-grid" />
              </div>
              <div className="cgsl-sf" />
              <div className="cgsl-sr" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ServicesList() {
  const ref = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const chapters = useRef<(HTMLElement | null)[]>([]);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const [active, setActive] = useState(0);
  useMagnetic(ref, mounted);

  // the chapter crossing 45% of the viewport is active; the rail fills with overall progress
  useEffect(() => {
    if (!mounted || !ref.current) return;
    const el = ref.current;
    let tops: number[] = [], top = 0, height = 1, vh = 900, last = -1;
    return onFrame(
      () => {
        let a = 0;
        tops.forEach((t, i) => {
          if (t < vh * 0.45) a = i;
        });
        if (a !== last) {
          last = a;
          setActive(a);
        }
        railRef.current?.style.setProperty("--p", clamp01((vh * 0.45 - top) / Math.max(1, height - vh * 0.5)).toFixed(4));
      },
      () => {
        const r = el.getBoundingClientRect();
        top = r.top;
        height = r.height;
        vh = window.innerHeight || 900;
        tops = chapters.current.map((c) => (c ? c.getBoundingClientRect().top : 1e9));
      },
    );
  }, [mounted]);

  const jump = (i: number) => (e: MouseEvent) => {
    const c = chapters.current[i];
    if (!c) return;
    e.preventDefault();
    const y = c.getBoundingClientRect().top + window.scrollY - 110;
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    try {
      history.replaceState(null, "", `#svc-${services[i].slug}`);
    } catch {}
  };

  const phone = w < 810;
  return (
    <div ref={ref} className={cx("cg cgsl", phone ? "is-ph" : w < 1100 && "is-tab")} data-cg-w={w} style={FONT.B}>
      <div className="cgsl-w">
        {!phone && (
          <nav className="cgsl-idx" aria-label="Services">
            <p style={FONT.M}>Services</p>
            <div ref={railRef} className="cgsl-rail" aria-hidden>
              <i />
            </div>
            <ol>
              {services.map((s, i) => (
                <li className={i === active ? "is-act" : ""} key={s.slug}>
                  <a href={`#svc-${s.slug}`} onClick={jump(i)} aria-current={i === active ? "true" : undefined}>
                    <em style={FONT.M}>{pad2(i + 1)}</em>
                    <span>{s.f1}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="cgsl-list">
          {services.map((s, i) => (
            <Chapter key={s.slug} s={s} i={i} mounted={mounted} reduced={reduced} onEl={(k, el) => (chapters.current[k] = el)} />
          ))}
        </div>
      </div>
    </div>
  );
}
