"use client";

import { CSSProperties, useRef } from "react";
import { team } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useScrollProgress, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise, splitList } from "@/lib/text";
import { Button, Eyebrow } from "@/ui";

/** `|` breaks a line; [n] drops photo n inline between the words. */
// PENDING (PENDING_FEATURES.md): the template's studio photos are not on thorvix.com; the tiles use team photos until real ones exist
// const TEXT = "Engineers [1] and designers | who build software [2] | startups [3] can bet on.";
// const PHOTOS = ["/images/studio/1.webp", "/images/studio/2.webp", "/images/studio/3.webp"];
// no [n] markers: the headline runs without photo tiles for now
const TEXT = "Forged for the future. | Expertise, infra | and execution on day one.";
const PHOTOS = team.map((p) => p.img).filter(Boolean);
const FACTS = splitList("Lahore, PK;Global remote;Mid-to-senior talent only");

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
                        {/* portraits in a wide tile: anchor near the top so faces stay in frame */}
                        <img src={PHOTOS[(+m[1] - 1) % PHOTOS.length]} alt="" loading="lazy" decoding="async" style={{ objectPosition: "50% 22%" }} />
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
            <Eyebrow text="The Thorvix edge" on={on} />
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
              Stop wasting months on recruitment and onboarding. We bring the expertise, the infra, and the execution.
            </p>
            <Button href="/about" label="Why Thorvix" kind="ghost" />
          </div>
        </div>
      </div>
    </section>
  );
}
