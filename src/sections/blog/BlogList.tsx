"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { posts, type PostRow } from "@/data/cms";
import { useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, rise } from "@/lib/text";
import { ArrowRight } from "@/ui";

const TOPICS = Array.from(new Set(posts.map((p) => String(p.f2 || "").trim()).filter(Boolean)));
const STEPS = [32, 16, 8, 4];

/** Cover that re-renders through coarse pixel steps each time `run` changes. */
function Cover({ src, run, still, ratio }: { src: string; run: number; still: boolean; ratio: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (!run || still) return;
    const cv = canvasRef.current;
    const img = imgRef.current;
    if (!cv || !img || !img.complete || !img.naturalWidth) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const r = cv.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width));
    const H = Math.max(1, Math.round(r.height));
    cv.width = W;
    cv.height = H;
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;
    let step = 0;
    let timer = 0;
    const draw = () => {
      if (step >= STEPS.length) {
        setShowing(false);
        return;
      }
      if (step === 0) setShowing(true);
      const px = STEPS[step++];
      small.width = Math.ceil(W / px);
      small.height = Math.ceil(H / px);
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(img, (W - iw) / 2 / px, (H - ih) / 2 / px, iw / px, ih / px);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(small, 0, 0, small.width * px, small.height * px);
      timer = window.setTimeout(draw, 85);
    };
    timer = window.setTimeout(draw, 0);
    return () => window.clearTimeout(timer);
  }, [run, still]);

  return (
    <span className="cgbl-cov" style={{ aspectRatio: ratio }}>
      <img ref={imgRef} src={src} alt="" loading="lazy" decoding="async" />
      <canvas ref={canvasRef} aria-hidden style={{ opacity: showing ? 1 : 0 }} />
    </span>
  );
}

/** All notes: topic chips (kept in the URL as ?k=), the latest note large, the rest in a grid. */
export function BlogList() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.05);
  const [topic, setTopic] = useState("");
  const [runs, setRuns] = useState<Record<string, number>>({});
  const phone = w < 810;

  useEffect(() => {
    try {
      const k = new URLSearchParams(window.location.search).get("k");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
      if (k) setTopic(k);
    } catch {}
  }, []);

  const pick = (t: string) => {
    setTopic(t);
    try {
      const url = new URL(window.location.href);
      if (t) url.searchParams.set("k", t);
      else url.searchParams.delete("k");
      history.replaceState(null, "", url.toString());
    } catch {}
  };
  const replay = (slug: string) => setRuns((r) => ({ ...r, [slug]: (r[slug] || 0) + 1 }));

  const shown = posts.filter((p) => !topic || String(p.f2 || "").toLowerCase() === topic.toLowerCase());
  const [lead, ...rest] = shown;

  const card = (p: PostRow, i: number, big: boolean) => (
    <a href={`/blog/${p.slug}`} className={cx("cgbl-card", big && "is-big")} style={rise(on, 120 + i * 90, 30)} onMouseEnter={() => replay(p.slug)} onFocus={() => replay(p.slug)} key={p.slug}>
      <Cover src={p.img} run={runs[p.slug] || 0} still={reduced} ratio={big ? (phone ? "4/3" : "16/10") : "4/3"} />
      <span className="cgbl-txt">
        <span className="cgbl-meta" style={FONT.M}>
          {big && <em>Latest</em>}
          <b>{p.f2}</b>
          <span>{p.f3}</span>
          <span>{p.f7}</span>
        </span>
        <strong style={FONT.D}>
          <span>{p.f1}</span>
        </strong>
        <span className="cgbl-sum">{p.f4}</span>
        <span className="cgbl-go" style={FONT.M}>
          Read the note
          <i aria-hidden>
            <ArrowRight size={13} />
          </i>
        </span>
      </span>
    </a>
  );

  return (
    <section ref={ref} className={cx("cg cgbl", phone ? "is-ph" : w < 1100 && "is-tab")} data-cg-w={w} style={FONT.B} aria-label="Notes">
      <div className="cgbl-w">
        <div className="cgbl-chips" role="group" aria-label="Filter by topic" style={{ ...FONT.M, ...rise(on, 0) }}>
          {["", ...TOPICS].map((t) => {
            const count = t ? posts.filter((p) => String(p.f2 || "").toLowerCase() === t.toLowerCase()).length : posts.length;
            const active = topic.toLowerCase() === t.toLowerCase();
            return (
              <button
                type="button"
                key={t || "all"}
                className={active ? "is-on" : ""}
                aria-pressed={active}
                onClick={() => pick(t)}
                onFocus={(e) => {
                  try {
                    e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                  } catch {}
                }}
              >
                {t || "All"}
                <sup>{count}</sup>
              </button>
            );
          })}
        </div>
        {lead ? card(lead, 0, true) : <p className="cgbl-empty">No notes in this topic yet.</p>}
        {rest.length > 0 && (
          <div className="cgbl-grid" style={{ "--n": Math.max(2, Math.min(3, rest.length)) } as CSSProperties}>
            {rest.map((p, i) => card(p, i + 1, false))}
          </div>
        )}
      </div>
    </section>
  );
}
