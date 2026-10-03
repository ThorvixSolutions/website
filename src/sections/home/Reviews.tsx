"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { reviews, type ReviewRow } from "@/data/cms";
import { useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise, splitList } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const HEADING = "What our clients *say.*";
const PR_TITLE = "Client review · {company}";
const DIFF = splitList("client: {company};reviewer: {name};status: approved");
const INTERVAL = 8;
const LIST = reviews.slice(0, 6);
const N = LIST.length;

const fill = (s: string, r: ReviewRow) => String(s || "").replace(/\{company\}/g, r.f4 || "").replace(/\{name\}/g, r.f2 || "");
const slug = (s: string) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
// thorvix.com has no reviewer photos: fall back to a tile with the company's initials
const avatar = (r: ReviewRow) =>
  r.img ||
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#1c1c1c"/><text x="20" y="25" font-family="monospace" font-size="14" fill="#fff" text-anchor="middle">${(r.f4 || "")
      .split(/\s+/)
      .map((p) => p[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase()}</text></svg>`,
  )}`;

export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.2);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [hold, setHold] = useState(false);
  const [turn, setTurn] = useState(0);

  const go = useCallback(
    (i: number) => {
      if (!N) return;
      const next = ((i % N) + N) % N;
      if (next === cur) return;
      setPrev(cur);
      setCur(next);
      setTurn((t) => t + 1);
    },
    [cur],
  );

  // auto-advance, paused while the pointer or focus is inside
  useEffect(() => {
    if (!on || reduced || hold || N < 2) return;
    const t = window.setTimeout(() => go(cur + 1), Math.max(3, INTERVAL) * 1000);
    return () => window.clearTimeout(t);
  }, [on, reduced, hold, cur, go]);

  // the outgoing comment slides away for 700ms
  useEffect(() => {
    if (prev < 0) return;
    const t = window.setTimeout(() => setPrev(-1), 700);
    return () => window.clearTimeout(t);
  }, [prev, turn]);

  const review = LIST[cur] || LIST[0];
  const quote = String(review.f1 || "");
  const [typing, setTyping] = useState({ turn: 0, n: 0 });
  const animate = mounted && !reduced && turn > 0;

  // the new quote types itself out, two characters at a time, in under a second
  useEffect(() => {
    if (!animate) return;
    const len = quote.length;
    let n = 0;
    const step = Math.max(8, Math.min(22, 900 / Math.max(1, len)));
    const id = window.setInterval(() => {
      n += 2;
      setTyping({ turn, n: Math.min(len, n) });
      if (n >= len) window.clearInterval(id);
    }, step);
    return () => window.clearInterval(id);
  }, [turn, animate, quote.length]);
  const typed = !animate ? quote.length : typing.turn === turn ? typing.n : 0;

  const comment = (r: ReviewRow, live: boolean) => {
    const text = String(r.f1 || "");
    return (
      <>
        <div className="cgrv-who">
          <img src={avatar(r)} alt="" loading="lazy" decoding="async" />
          <span>
            <b>{r.f2}</b>
            <em style={FONT.M}>
              {r.f3} · {r.f4}
            </em>
          </span>
          <time style={FONT.M}>just now</time>
        </div>
        <blockquote className="cgrv-q">
          {live ? (
            <>
              <span>{text.slice(0, typed)}</span>
              {typed < text.length && <i className="cgrv-caret" aria-hidden />}
              <span className="cgrv-ghost" aria-hidden>
                {text.slice(typed)}
              </span>
            </>
          ) : (
            text
          )}
        </blockquote>
        <span className="cgrv-ok" style={FONT.M}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          Approved these changes
        </span>
      </>
    );
  };

  return (
    <section
      ref={ref}
      className={cx("cg cg-dark cgrv", on && "is-on", hold && "is-hold", w < 810 ? "is-ph" : w < 1100 && "is-tab")}
      style={{ ...FONT.B, "--iv": `${Math.max(3, INTERVAL)}s` } as CSSProperties}
      aria-label={plain(HEADING)}
      aria-roledescription="carousel"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(cur + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(cur - 1);
        }
      }}
    >
      <div className="cg-wrap cgrv-grid">
        <div className="cgrv-l">
          <Eyebrow text="Client voices" on={on} />
          <Heading text={HEADING} on={on} delay={120} />
          {/* PENDING (PENDING_FEATURES.md): no intro copy on thorvix.com
          <p className="cgrv-copy" style={rise(on, 300)}>
            Every project ends with a review. These are the ones our clients left.
          </p>
          */}
          <div className="cgrv-tabs" role="tablist" aria-label="Clients" style={rise(on, 420)}>
            {LIST.map((r, i) => (
              <button type="button" role="tab" aria-selected={i === cur} className={cx("cgrv-tab", i === cur && "is-on")} onClick={() => go(i)} key={r.slug}>
                <img src={avatar(r)} alt="" loading="lazy" decoding="async" />
                <span>
                  <b>{r.f4}</b>
                  <em style={FONT.M}>{r.f2}</em>
                </span>
                <i className="cgrv-bar" aria-hidden>
                  <i key={i === cur ? `p${turn}` : "x"} />
                </i>
              </button>
            ))}
          </div>
          <div className="cgrv-nav" style={rise(on, 500)}>
            <button type="button" className="cgrv-arr" onClick={() => go(cur - 1)} aria-label="Previous review">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" className="cgrv-arr" onClick={() => go(cur + 1)} aria-label="Next review">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
            <span className="cgrv-num" style={FONT.M}>
              {pad2(cur + 1)} / {pad2(N)}
            </span>
          </div>
        </div>
        <div className="cgrv-win" style={rise(on, 260, 40)}>
          <div className="cgrv-bar0" style={FONT.M}>
            <span className="cgrv-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="cgrv-file">
              <i aria-hidden />
              reviews/{slug(review.f4 || "client")}.md
            </span>
          </div>
          <div className="cgrv-pr" style={FONT.M}>
            <span className="cgrv-merged">
              <i aria-hidden />
              Merged
            </span>
            <b>{fill(PR_TITLE, review)}</b>
            <span className="cgrv-prn">#{480 + cur * 7}</span>
          </div>
          <div className="cgrv-diff" style={FONT.M} aria-hidden>
            {DIFF.map((line, i) => (
              <div className="cgrv-dl" style={{ animationDelay: `${i * 90}ms` }} key={`${i}-${cur}`}>
                <em>{i + 1}</em>
                <span>+</span>
                {fill(line, review)}
              </div>
            ))}
          </div>
          <div className="cgrv-thread">
            {/* every comment rendered invisibly so the box keeps the tallest one's height */}
            <div className="cgrv-sizer" aria-hidden>
              {LIST.map((r, i) => (
                <div className="cgrv-c" key={i}>
                  {comment(r, false)}
                </div>
              ))}
            </div>
            {prev >= 0 && LIST[prev] && (
              <div className="cgrv-c is-out" aria-hidden key={`o${turn}`}>
                {comment(LIST[prev], false)}
              </div>
            )}
            <div className={cx("cgrv-c is-cur", turn > 0 && "is-new")} aria-live="polite" key={`n${turn}`}>
              {comment(review, true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
