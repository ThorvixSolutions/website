"use client";

import { useEffect, useRef, useState } from "react";
import { work, type WorkRow } from "@/data/cms";
import { useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, WIDE, cx, pad2, rise } from "@/lib/text";
import { ArrowRight } from "@/ui";
import { PixelImage } from "@/ui/PixelImage";

const INDUSTRIES = Array.from(new Set(work.map((c) => String(c.f2 || "").trim()).filter(Boolean)));

function Card({ c, big, i, on }: { c: WorkRow; big: boolean; i: number; on: boolean }) {
  const [play, setPlay] = useState(0);
  const replay = () => setPlay((n) => n + 1);
  return (
    <li className={cx("cgwl-card", big && "is-big")} style={rise(on, 120 + i * 90, 36)}>
      <a href={`/work/${c.slug}`} onMouseEnter={replay} onFocus={replay} aria-label={`${c.f1}: ${c.f3}`}>
        <span className="cgwl-ph">
          <PixelImage src={c.img} play={play} base="cgwl-pix" eager={i < 2} />
          <span className="cgwl-res" aria-hidden>
            <b style={{ ...FONT.D, ...WIDE }}>{c.f4}</b>
            <span style={FONT.M}>{c.f5}</span>
          </span>
        </span>
        <span className="cgwl-meta" style={FONT.M}>
          <span>{c.f1}</span>
          <span>
            {c.f2} · {c.f7}
          </span>
        </span>
        <span className="cgwl-t">
          <b style={FONT.D}>{c.f3}</b>
          <i aria-hidden>
            <ArrowRight size={15} />
          </i>
        </span>
        <span className="cgwl-sum">{c.f6}</span>
        <span className="cg-sr">Read the case</span>
      </a>
    </li>
  );
}

/** All case studies with industry filter chips; the filter is kept in the URL as ?i=. */
export function WorkList() {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.05);
  const [filter, setFilter] = useState("");
  const [round, setRound] = useState(0);
  const phone = w < 810;

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("i");
      const match = q && INDUSTRIES.find((x) => x.toLowerCase() === q.toLowerCase());
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
      if (match) setFilter(match);
    } catch {}
  }, []);

  const pick = (x: string) => {
    setFilter(x);
    setRound((n) => n + 1);
    try {
      const url = new URL(window.location.href);
      if (x) url.searchParams.set("i", x);
      else url.searchParams.delete("i");
      history.replaceState(null, "", url.toString());
    } catch {}
  };

  const shown = filter ? work.filter((c) => String(c.f2 || "").trim() === filter) : work;
  const chips: [string, string, number][] = [["", "All", work.length], ...INDUSTRIES.map((x): [string, string, number] => [x, x, work.filter((c) => String(c.f2 || "").trim() === x).length])];

  return (
    <div ref={ref} className={cx("cg cgwl", phone ? "is-ph" : w < 1100 && "is-tab")} data-cg-w={w} style={FONT.B}>
      <div className="cgwl-w">
        <h2 className="cg-sr">Case studies</h2>
        <div className="cgwl-bar" style={rise(on, 0)}>
          <div className="cgwl-chips" role="group" aria-label="Filter by industry">
            {chips.map(([value, label, count]) => (
              <button
                type="button"
                key={value || "all"}
                className={filter === value ? "is-on" : ""}
                aria-pressed={filter === value}
                onClick={() => pick(value)}
                onFocus={(e) => {
                  try {
                    e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                  } catch {}
                }}
                style={FONT.M}
              >
                {label}
                <em>{pad2(count)}</em>
              </button>
            ))}
          </div>
          <p className="cgwl-count" style={FONT.M} aria-live="polite">
            <b>{pad2(shown.length)}</b> cases
          </p>
        </div>
        {shown.length ? (
          <ul className="cgwl-grid" key={round}>
            {shown.map((c, i) => (
              <Card key={c.slug} c={c} big={i === 0 && !phone} i={i} on={on} />
            ))}
          </ul>
        ) : (
          <p className="cgwl-empty">No cases in this industry yet.</p>
        )}
      </div>
    </div>
  );
}
