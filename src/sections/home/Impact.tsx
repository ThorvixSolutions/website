"use client";

import { CSSProperties, PointerEvent, ReactNode, useRef, useState } from "react";
import { useMounted, useReducedMotion, useReveal, useScrollProgress, useWidth } from "@/lib/hooks";
import { FONT, clamp01, cx, plain, rise, splitPairs } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const HEADING = "A year of *shipping,* one square a day.";
const NOTE = "Commits to client repositories over the last 12 months. Every orange square is working software going out.";
const STATS = splitPairs("140+|products shipped;99.98%|uptime across client apps;2 weeks|to the first release;4.9/5|average client rating").slice(0, 4);
const TOTAL = "3,412 commits in the last year";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// deterministic noise so the heatmap looks the same on every visit
const noise = (n: number) => {
  const t = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return t - Math.floor(t);
};
/** Activity level 0–4 for a week/day: busier on weekdays, with a few release spikes. */
const level = (week: number, day: number) => {
  const n = noise(week * 7 + day);
  const base = day >= 5 ? 0.25 : 0.62;
  const spike = week % 9 === 7 || week % 13 === 5 ? 0.3 : 0;
  const v = n * 0.8 + base * 0.5 + spike - 0.15;
  return v < 0.3 ? 0 : v < 0.55 ? 1 : v < 0.72 ? 2 : v < 0.88 ? 3 : 4;
};

/** Each digit is a 0–9 strip that rolls up to its value. */
function Roll({ text, on, delay = 0 }: { text: string; on: boolean; delay?: number }) {
  let k = 0;
  return (
    <span className="cgim-roll" aria-hidden>
      {Array.from(String(text || "")).map((ch, i): ReactNode => {
        if (!/\d/.test(ch))
          return (
            <span className="cgim-ch" key={i}>
              {ch}
            </span>
          );
        const d = +ch;
        const order = k++;
        return (
          <span className="cgim-dg" key={i}>
            <span className="cgim-strip" style={{ translate: `0 ${on ? -d * 10 : 0}%`, transitionDelay: `${delay + order * 90}ms` }}>
              {"0123456789".split("").map((x) => (
                <span key={x}>{x}</span>
              ))}
            </span>
            <span className="cgim-sz">{ch}</span>
          </span>
        );
      })}
    </span>
  );
}

export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.1);
  const phone = w < 810;
  const weeks = phone ? 20 : w < 1100 ? 36 : 52;
  const [tip, setTip] = useState<{ x: number; y: number; t: string } | null>(null);

  // the squares fill in from left to right as the section scrolls through
  useScrollProgress(ref, mounted, reduced, (sp) => {
    gridRef.current?.style.setProperty("--f", clamp01((sp - 0.22) / 0.36).toFixed(4));
  });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as Element).closest?.<HTMLElement>("[data-w]");
    const grid = gridRef.current;
    if (!cell || !grid) {
      setTip(null);
      return;
    }
    const wk = +cell.dataset.w!;
    const d = +cell.dataset.d!;
    const lv = level(wk + (52 - weeks), d);
    const count = lv === 0 ? 0 : Math.round(lv * 3 + noise(wk * 13 + d) * 4);
    const r = cell.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    setTip({ x: r.left - g.left + r.width / 2, y: r.top - g.top, t: `${DAYS[d]} · ${count} commits` });
  };

  const cells: ReactNode[] = [];
  for (let wk = 0; wk < weeks; wk++)
    for (let d = 0; d < 7; d++)
      cells.push(
        <i
          key={wk * 7 + d}
          data-w={wk}
          data-d={d}
          className={`l${level(wk + (52 - weeks), d)}`}
          style={{ gridColumn: wk + 1, gridRow: d + 1, "--c": (wk / weeks).toFixed(3) } as CSSProperties}
        />,
      );

  return (
    <div ref={ref} className={cx("cg cg-dark cgim", on && "is-on", phone ? "is-ph" : w < 1100 && "is-tab", reduced && "is-full")} style={FONT.B}>
      <section className="cg-wrap cgim-in" aria-label={plain(HEADING)}>
        <div className="cgim-head">
          <div>
            <Eyebrow text="Impact" on={on} />
            <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 16, maxWidth: 900 }} />
          </div>
          <p className="cgim-note" style={rise(on, 300)}>
            {NOTE}
          </p>
        </div>
        <dl className="cgim-stats">
          {STATS.map((s, i) => (
            <div className="cgim-stat" style={rise(on, 200 + i * 110)} key={s.b}>
              <dt className="cgim-l" style={FONT.M}>
                {s.b}
              </dt>
              <dd className="cgim-v" style={FONT.D}>
                <span className="cg-sr">{s.a}</span>
                <Roll text={s.a} on={on} delay={300 + i * 140} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="cgim-map" style={rise(on, 500)}>
          <div className="cgim-days" style={FONT.M} aria-hidden>
            {DAYS.map((d, i) => (
              <span key={d}>{i % 2 === 0 ? d : ""}</span>
            ))}
          </div>
          <div
            ref={gridRef}
            className="cgim-grid"
            style={{ gridTemplateColumns: `repeat(${weeks},1fr)`, "--f": reduced ? 1 : 0 } as CSSProperties}
            onPointerMove={onMove}
            onPointerLeave={() => setTip(null)}
            role="img"
            aria-label={TOTAL}
          >
            {cells}
            {tip && (
              <span className="cgim-tip" style={{ ...FONT.M, left: tip.x, top: tip.y }}>
                {tip.t}
              </span>
            )}
          </div>
          <div className="cgim-foot" style={FONT.M}>
            <span>{TOTAL}</span>
            <span className="cgim-leg">
              Less
              <i className="l0" />
              <i className="l1" />
              <i className="l2" />
              <i className="l3" />
              <i className="l4" />
              More
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
