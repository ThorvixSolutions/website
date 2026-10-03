"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { work } from "@/data/cms";
import { useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise, splitList } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const HEADING = "Trusted by *enterprise* leaders";
const CLIENTS = splitList("Ren Solutions;GAJET;Ash Official;Redvyn");
const RESULTS = "Ren Solutions|Distributor;GAJET|E-commerce;Ash Official|E-commerce";
const INTERVAL = 2.4;
// with fewer than 8 clients the 4×2 grid repeats them; the second row is shifted by two
// so a client never sits under itself
const START = Array.from({ length: 8 }, (_, i) => (CLIENTS.length < 8 && i >= 4 ? i + 2 : i) % CLIENTS.length);

/** Each logo gets its own wordmark treatment so the grid reads like real brands. */
const MARKS: CSSProperties[] = [
  { fontWeight: 800, fontStretch: "125%", textTransform: "uppercase", letterSpacing: "-.01em" },
  { fontWeight: 400, fontStretch: "75%", letterSpacing: "-.03em", fontStyle: "italic" },
  { fontWeight: 600, fontStretch: "100%", letterSpacing: "-.045em" },
  { fontWeight: 300, fontStretch: "112%", textTransform: "uppercase", letterSpacing: ".18em" },
  { fontWeight: 900, fontStretch: "62%", textTransform: "uppercase", letterSpacing: ".02em" },
  { fontWeight: 500, fontStretch: "125%", letterSpacing: "-.03em", textTransform: "lowercase" },
  { fontWeight: 700, fontStretch: "88%", letterSpacing: "-.02em" },
  { fontWeight: 400, fontStretch: "100%", textTransform: "uppercase", letterSpacing: ".32em" },
];

const results: Record<string, string> = {};
for (const r of splitList(RESULTS)) {
  const [k, v] = r.split("|").map((x) => x.trim());
  if (k && v) results[k.toLowerCase()] = v;
}
for (const c of work) if (c.f1 && c.f4) results[c.f1.trim().toLowerCase()] = `${c.f4} ${c.f5 || ""}`.trim();

// cells flip in a scattered order so neighbours never turn together
const ORDER = [0, 5, 2, 7, 4, 1, 6, 3];

export function Clients() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.15);
  const hovered = useRef(-1);
  const [grid, setGrid] = useState(() => ({
    shown: START,
    prev: Array(8).fill(-1) as number[],
    turns: Array(8).fill(0) as number[],
    next: 8,
  }));

  useEffect(() => {
    if (!mounted || !on || reduced || CLIENTS.length <= 8) return;
    let k = 0;
    const id = window.setInterval(
      () => {
        if (document.hidden) return;
        const cell = ORDER[k % 8];
        k++;
        if (cell === hovered.current) return;
        setGrid((g) => {
          const n = CLIENTS.length;
          let pick = g.next % n;
          let guard = 0;
          while (g.shown.includes(pick) && guard++ < n) pick = (pick + 1) % n;
          const shown = g.shown.slice();
          const prev = g.prev.slice();
          const turns = g.turns.slice();
          prev[cell] = shown[cell];
          shown[cell] = pick;
          turns[cell]++;
          return { shown, prev, turns, next: pick + 1 };
        });
      },
      (Math.max(0.6, INTERVAL) * 1000) / 2.2,
    );
    return () => window.clearInterval(id);
  }, [mounted, on, reduced]);

  return (
    <section ref={ref} className={cx("cg cgcl", w < 810 && "is-ph", on && "is-on")} style={FONT.B} aria-label={plain(HEADING)}>
      <div className="cg-wrap cgcl-wrap">
        <div className="cgcl-head">
          <div>
            <Eyebrow text="Clients" on={on} />
            <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 18 }} />
          </div>
          {/* PENDING (PENDING_FEATURES.md): no intro copy on thorvix.com
          <p className="cgcl-body" style={rise(on, 300)}>
            Funded startups and growing companies in travel, health, fintech and retail ship their products with us.
          </p>
          */}
        </div>
        <ul className="cgcl-grid" aria-label="Clients">
          {Array.from({ length: 8 }, (_, i) => {
            const turns = grid.turns[i];
            const name = CLIENTS[grid.shown[i] % CLIENTS.length] || "";
            const old = grid.prev[i] >= 0 ? CLIENTS[grid.prev[i]] : "";
            const result = results[name.toLowerCase()] || "";
            const flip = turns > 0 && !reduced;
            return (
              <li
                className="cgcl-cell"
                key={i}
                style={rise(on, 200 + i * 70, 24)}
                onPointerEnter={() => (hovered.current = i)}
                onPointerLeave={() => (hovered.current = -1)}
              >
                <div className="cgcl-in" tabIndex={0} aria-label={result ? `${name}: ${result}` : name}>
                  <div className="cgcl-cube" data-flip={flip ? "1" : "0"} key={turns}>
                    {flip && (
                      <span className="cgcl-face cgcl-old" style={{ ...FONT.D, ...MARKS[Math.max(0, grid.prev[i]) % MARKS.length] }} aria-hidden>
                        {old}
                      </span>
                    )}
                    <span className="cgcl-face cgcl-new" style={{ ...FONT.D, ...MARKS[grid.shown[i] % MARKS.length] }}>
                      {name}
                    </span>
                  </div>
                  <span className="cgcl-hot" aria-hidden>
                    <b style={FONT.D}>{name}</b>
                    {result && <span style={FONT.M}>{result}</span>}
                  </span>
                  <i className="cgcl-ix" style={FONT.M} aria-hidden>
                    {pad2(i + 1)}
                  </i>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
