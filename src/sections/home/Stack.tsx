"use client";

import { useEffect, useRef, useState } from "react";
import { useIsoLayoutEffect, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { onFrame } from "@/lib/ticker";
import { FONT, WIDE, cx, pad2, plain, rise, splitList } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const HEADING = "The stack we *build* with";
const TABS = ["All", "Web", "Mobile", "AI", "Cloud"];
/** name | category | monogram */
const ITEMS = splitList(
  "React|Web|Re;Next.js|Web|N.;TypeScript|Web|TS;Node|Web|No;Swift|Mobile|Sw;Kotlin|Mobile|Kt;React Native|Mobile|RN;Flutter|Mobile|Fl;Python|AI|Py;Go|Cloud|Go;Postgres|Web|Pg;Redis|Cloud|Rd;OpenAI|AI|OA;Anthropic|AI|An;LangChain|AI|LC;pgvector|AI|pv;AWS|Cloud|AW;GCP|Cloud|GC;Docker|Cloud|Dk;Terraform|Cloud|Tf;Vercel|Web|Vc;Stripe|Web|St;Figma|Design|Fg;GitHub Actions|Cloud|GA",
).map((row, i) => {
  const [name = "", cat = "", mg = ""] = row.split("|").map((x) => x.trim());
  return { name, cat, mg, key: `${i}-${name}` };
});

const isAll = (tab: string) => tab.toLowerCase() === "all";
const countFor = (tab: string) => (isAll(tab) ? ITEMS.length : ITEMS.filter((t) => t.cat.toLowerCase() === tab.toLowerCase()).length);

export function Stack() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.15);
  const [tab, setTab] = useState(TABS[0]);
  const before = useRef(new Map<string, DOMRect>());

  const matches = (t: (typeof ITEMS)[number]) => isAll(tab) || t.cat.toLowerCase() === tab.toLowerCase();
  const ordered = [...ITEMS.filter(matches), ...ITEMS.filter((t) => !matches(t))];

  // FLIP: remember where every chip was, switch the filter, then animate from old to new spot
  const pick = (next: string) => {
    if (next === tab) return;
    const grid = gridRef.current;
    if (grid) {
      const m = new Map<string, DOMRect>();
      grid.querySelectorAll<HTMLElement>("[data-sk]").forEach((el) => m.set(el.dataset.sk || "", el.getBoundingClientRect()));
      before.current = m;
    }
    setTab(next);
  };

  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    const prev = before.current;
    if (!grid || !prev.size || reduced) {
      before.current = new Map();
      return;
    }
    grid.querySelectorAll<HTMLElement>("[data-sk]").forEach((el) => {
      const from = prev.get(el.dataset.sk || "");
      if (!from) return;
      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (!dx && !dy) return;
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px,${dy}px)`;
      void el.offsetWidth;
      el.style.transition = "";
      el.style.transform = "";
    });
    before.current = new Map();
  }, [tab]);

  // chips lean away from the pointer; the closest lit chip gets highlighted
  useEffect(() => {
    if (!mounted || reduced || !gridRef.current || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const grid = gridRef.current;
    let px = -9999, py = -9999, dirty = false;
    let chips: { el: HTMLElement; x: number; y: number }[] = [];
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      dirty = true;
    };
    const leave = () => {
      px = -9999;
      py = -9999;
      dirty = true;
    };
    grid.addEventListener("pointermove", move);
    grid.addEventListener("pointerleave", leave);
    const stop = onFrame(
      () => {
        if (!dirty) return;
        dirty = false;
        let nearest: HTMLElement | null = null;
        let best = 140;
        for (const c of chips) {
          const dx = c.x - px;
          const dy = c.y - py;
          const d = Math.hypot(dx, dy);
          const f = d < 140 ? 1 - d / 140 : 0;
          const push = f * 14;
          c.el.style.translate = f ? `${((dx / (d || 1)) * push).toFixed(1)}px ${((dy / (d || 1)) * push).toFixed(1)}px` : "0 0";
          if (d < best && !c.el.classList.contains("is-dim")) {
            best = d;
            nearest = c.el;
          }
        }
        for (const c of chips) c.el.classList.toggle("is-near", c.el === nearest);
      },
      () => {
        if (!dirty) return;
        chips = Array.from(grid.querySelectorAll<HTMLElement>(".cgsk-chip")).map((el) => {
          const r = el.parentElement!.getBoundingClientRect();
          return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
      },
    );
    return () => {
      stop();
      grid.removeEventListener("pointermove", move);
      grid.removeEventListener("pointerleave", leave);
    };
  }, [mounted, reduced]);

  return (
    <section ref={ref} className={cx("cg cgsk", on && "is-on", w < 810 ? "is-ph" : w < 1100 && "is-tab")} style={FONT.B} aria-label={plain(HEADING)}>
      <div className="cg-wrap">
        <div className="cgsk-top">
          <div className="cgsk-hl">
            <Eyebrow text="Tech stack" on={on} />
            <Heading text={HEADING} on={on} delay={120} />
          </div>
          <div className="cgsk-side" style={rise(on, 300)}>
            <p>We pick proven tools your next hire already knows, so the product stays easy to grow long after launch.</p>
            <span className="cgsk-count" style={FONT.M}>
              <b style={FONT.D}>{ITEMS.length}</b>tools in production
            </span>
          </div>
        </div>
        <div className="cgsk-tabs" role="group" aria-label="Filter the stack" style={{ ...FONT.M, ...rise(on, 380) }}>
          {TABS.map((t) => (
            <button type="button" key={t} className={cx("cgsk-tab", t === tab && "is-on")} aria-pressed={t === tab} onClick={() => pick(t)}>
              <i aria-hidden />
              {t}
              <sup>{pad2(countFor(t))}</sup>
            </button>
          ))}
        </div>
        <div ref={gridRef} className="cgsk-grid" aria-live="polite">
          {ordered.map((item) => {
            const dim = !matches(item);
            const idx = Math.min(ITEMS.indexOf(item), 23);
            return (
              <div
                key={item.key}
                data-sk={item.key}
                className="cgsk-cell"
                style={{
                  opacity: on ? 1 : 0,
                  translate: on ? "0 0" : "0 24px",
                  transition: `opacity .7s ease ${idx * 28}ms, translate .9s cubic-bezier(.2,.8,.2,1) ${idx * 28}ms`,
                }}
              >
                <div className={cx("cgsk-chip", dim && "is-dim")} aria-hidden={dim || undefined}>
                  <span className="cgsk-mg" style={{ ...FONT.D, ...WIDE }}>
                    {item.mg}
                  </span>
                  <span className="cgsk-tx">
                    <b>{item.name}</b>
                    <em style={FONT.M}>{item.cat}</em>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
