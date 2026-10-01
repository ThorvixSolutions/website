"use client";

import { CSSProperties, useRef, useState } from "react";
import { plans } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, WIDE, cx, plain, rise, splitList } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const HEADING = "Ways to work *with us*";
const BASE_ENGINEERS = 2;
const ENGINEER_RATE = 5500;
const DESIGNER_RATE = 3500;
const PLANS = plans.slice(0, 3);

const toNumber = (s: string) => {
  const n = parseFloat(String(s || "").replace(/[^\d.]/g, ""));
  return isFinite(n) ? n : 0;
};
const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-US")}`;

/** Price whose digits roll on 0–9 strips when the number changes. */
function Roll({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <span className="cgpr-roll" style={style} aria-hidden>
      {String(text)
        .split("")
        .map((ch, i) =>
          /\d/.test(ch) ? (
            <span className="cgpr-dg" key={i}>
              <span className="cgpr-col" style={{ translate: `0 ${-Number(ch) * 10}%` }}>
                {"0123456789".split("").map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span className="cgpr-sep" key={i}>
              {ch}
            </span>
          ),
        )}
    </span>
  );
}

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.12);
  const [engineers, setEngineers] = useState(BASE_ENGINEERS);
  const [designer, setDesigner] = useState(false);
  useMagnetic(ref, mounted);

  return (
    <section ref={ref} className={cx("cg cgpr", w < 810 ? "is-ph" : w < 1100 && "is-tab", on && "is-on")} style={FONT.B} aria-label={plain(HEADING)}>
      <div className="cg-wrap">
        <div className="cgpr-head">
          <div>
            <Eyebrow text="Build your team" on={on} />
            <Heading text={HEADING} on={on} delay={100} style={{ marginTop: 22 }} />
          </div>
          <p className="cgpr-body" style={rise(on, 350)}>
            Fixed price for a first release, a monthly squad for a roadmap, or a retainer to keep a live product fast. Every plan ships working
            software every two weeks.
          </p>
        </div>
        <ul className="cgpr-cards">
          {PLANS.map((p, i) => {
            const popular = /^(yes|true|1)$/i.test(String(p.f6 || "").trim());
            const perks = splitList(p.f5).slice(0, 7);
            const cur = (String(p.f2 || "").match(/^[^\d]*/) || [""])[0] || "$";
            const base = toNumber(p.f2);
            const price = popular ? base + (engineers - BASE_ENGINEERS) * ENGINEER_RATE + (designer ? DESIGNER_RATE : 0) : base;
            const href = `/contact?plan=${encodeURIComponent(p.slug || "")}${popular ? `&engineers=${engineers}${designer ? "&designer=yes" : ""}` : ""}`;
            return (
              <li className={cx("cgpr-card", popular && "is-pop cg-dark")} style={rise(on, 300 + i * 130, 40)} key={p.slug}>
                <div className="cgpr-in">
                  <div className="cgpr-top">
                    <span className="cgpr-idx" style={FONT.M}>{`0${i + 1}`}</span>
                    <h3 style={{ ...FONT.D, ...WIDE }}>{p.f1}</h3>
                    {popular && (
                      <span className="cgpr-pop" style={FONT.M}>
                        Most chosen
                      </span>
                    )}
                  </div>
                  <p className="cgpr-for">{p.f4}</p>
                  <p className="cgpr-price" aria-live={popular ? "polite" : undefined}>
                    <span className="cg-sr">
                      {money(price, cur)} {p.f3}
                    </span>
                    <Roll text={money(price, cur)} style={{ ...FONT.D, ...WIDE }} />
                    <span className="cgpr-per" style={FONT.M}>
                      {popular ? "per month" : p.f3}
                    </span>
                  </p>
                  {popular && (
                    <div className="cgpr-calc">
                      <label className="cgpr-sl" style={FONT.M}>
                        <span className="cgpr-sl-t">
                          <span>Engineers</span>
                          <b>{engineers}</b>
                        </span>
                        <input
                          type="range"
                          min={1}
                          max={6}
                          step={1}
                          value={engineers}
                          onChange={(e) => setEngineers(Number(e.target.value))}
                          aria-label="Engineers"
                          style={{ "--f": `${((engineers - 1) / 5) * 100}%` } as CSSProperties}
                        />
                        <span className="cgpr-ticks" aria-hidden>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <i key={n} className={n <= engineers ? "is-on" : ""} />
                          ))}
                        </span>
                      </label>
                      <button type="button" className={cx("cgpr-tg", designer && "is-on")} role="switch" aria-checked={designer} onClick={() => setDesigner(!designer)} style={FONT.M}>
                        <span className="cgpr-tg-k" aria-hidden>
                          <i />
                        </span>
                        Add a designer
                        <em>+{money(DESIGNER_RATE, cur)}</em>
                      </button>
                    </div>
                  )}
                  <ul className="cgpr-inc">
                    {perks.map((perk) => (
                      <li key={perk}>
                        <i aria-hidden />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button href={href} label={p.f7 || "Book a call"} kind={popular ? "solid" : "ghost"} className="cgpr-btn" />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="cgpr-note" style={{ ...FONT.M, ...rise(on, 800) }}>
          Prices in USD. Fixed quotes after a free scoping call. No lock-in: plans pause or cancel with 30 days notice.
        </p>
      </div>
    </section>
  );
}
