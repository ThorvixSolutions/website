"use client";

import { CSSProperties, useRef } from "react";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useScrollProgress, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise, splitList } from "@/lib/text";
import { Button, Eyebrow } from "@/ui";

/** `|` breaks a line; [n] drops photo n inline between the words. */
const TEXT = "Engineers [1] and designers | who build software [2] | startups [3] can bet on.";
const PHOTOS = ["/images/studio/1.webp", "/images/studio/2.webp", "/images/studio/3.webp"];
const FACTS = splitList("Founded 2016;Austin, Texas;38 engineers and designers");

export function Studio() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.1);
  const phone = w < 810;
  useScrollProgress(ref, mounted, reduced);
  useMagnetic(ref, mounted);

  const label = plain(TEXT.replace(/\[\d\]/g, ""));
  const lines = TEXT.split("|").map((l) => l.trim()).filter(Boolean);

  return (
    <section ref={ref} className={cx("cg cgst", phone && "is-ph", on && "is-on", reduced && "is-still")} style={FONT.B} aria-label={label}>
      <div className="cg-wrap cgst-wrap">
        <h2 className="cgst-h" style={FONT.D} aria-label={label}>
          {lines.map((line, i) => (
            <span
              className="cgst-l"
              aria-hidden
              key={i}
              style={{ "--dir": i % 2 ? 1 : -1, "--a": 0.1 + i * 0.07, textAlign: phone ? "left" : i % 2 ? "right" : "left" } as CSSProperties}
            >
              <span className="cgst-li">
                {line.split(/(\[\d\])/).map((part, k) => {
                  const m = part.match(/^\[(\d)\]$/);
                  if (m) {
                    return (
                      <span className="cgst-tile" key={k}>
                        <img src={PHOTOS[(+m[1] - 1) % PHOTOS.length]} alt="" loading="lazy" decoding="async" />
                      </span>
                    );
                  }
                  return part ? <span key={k}>{part.replace(/\s+/g, " ")}</span> : null;
                })}
              </span>
            </span>
          ))}
        </h2>
        <div className="cgst-row">
          <div className="cgst-meta" style={rise(on, 200)}>
            <Eyebrow text="The studio" on={on} />
            <ul className="cgst-facts" style={FONT.M}>
              {FACTS.map((f, i) => (
                <li key={i}>
                  <i aria-hidden>{pad2(i + 1)}</i>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="cgst-copy" style={rise(on, 360)}>
            <p>
              Forrentech is a software development studio of senior engineers, product designers and AI specialists. We join early, own the hard
              parts and ship working software every two weeks, so founders spend their time on customers, not on managing a build.
            </p>
            <Button href="/about" label="About the studio" kind="ghost" />
          </div>
        </div>
      </div>
    </section>
  );
}
