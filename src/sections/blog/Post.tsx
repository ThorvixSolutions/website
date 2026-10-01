"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { posts, team } from "@/data/cms";
import { useMounted, useReducedMotion, useReleased, useReveal, useWidth } from "@/lib/hooks";
import { onFrame } from "@/lib/ticker";
import { FONT, clamp01, cx, rise } from "@/lib/text";
import { ArrowRight, Heading } from "@/ui";

const noise = (n: number) => {
  const t = Math.sin(n * 57.3 + 11.1) * 43758.5453;
  return t - Math.floor(t);
};

/** Minimal markdown: "## " headings, "> " quotes, "- " bullets, everything else paragraphs. */
function Markdown({ text }: { text: string }) {
  const lines = String(text || "")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    out.push(
      <ul key={`u${out.length}`}>
        {list.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  lines.forEach((l) => {
    if (l.startsWith("- ")) {
      list.push(l.slice(2));
      return;
    }
    flush();
    if (l.startsWith("## "))
      out.push(
        <h2 style={FONT.D} key={out.length}>
          {l.slice(3)}
        </h2>,
      );
    else if (l.startsWith("> "))
      out.push(
        <blockquote style={FONT.D} key={out.length}>
          {l.slice(2)}
        </blockquote>,
      );
    else out.push(<p key={out.length}>{l}</p>);
  });
  flush();
  return <div className="cg-md">{out}</div>;
}

export function Post({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  const p = posts.find((x) => x.slug === slug) || posts[0];
  const author = team.find((t) => String(t.f1 || "").trim() === String(p.f6 || "").trim());
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 2);
  const phone = w < 810;
  const cols = phone ? 8 : 16;
  const rowsN = phone ? 6 : 7;

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  useEffect(() => {
    const el = ref.current;
    if (!mounted || !el) return;
    const show = () => setFocused(true);
    el.addEventListener("focusin", show);
    return () => el.removeEventListener("focusin", show);
  }, [mounted]);

  // reading progress bar across the top, driven by the article body
  useEffect(() => {
    if (!mounted || !artRef.current) return;
    const art = artRef.current;
    let top = 0, height = 1, vh = 1;
    return onFrame(
      () => {
        if (barRef.current) barRef.current.style.clipPath = `inset(0 ${(100 - clamp01((vh * 0.3 - top) / Math.max(1, height - vh * 0.5)) * 100).toFixed(2)}% 0 0)`;
      },
      () => {
        const r = art.getBoundingClientRect();
        top = r.top;
        height = r.height;
        vh = window.innerHeight;
      },
    );
  }, [mounted]);

  const intro = entered || reduced;
  const moreOn = useReveal(moreRef, mounted, reduced) || focused;
  const shareUrl = mounted ? encodeURIComponent(window.location.href) : "";

  const copy = () => {
    try {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      });
    } catch {}
  };

  return (
    <div ref={ref} className={cx("cg cgpo", phone ? "is-ph" : w < 1100 && "is-tab", intro && "is-in", reduced && "is-still")} data-cg-w={w} style={FONT.B}>
      <span className="cgpo-prog" aria-hidden>
        <span ref={barRef} />
      </span>
      <header className="cgpo-w cgpo-head">
        <nav className="cgpo-cr" aria-label="Breadcrumb" style={{ ...FONT.M, ...rise(intro, 0) }}>
          <ol>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <span aria-current="page">{p.f2}</span>
            </li>
          </ol>
        </nav>
        <Heading
          text={p.f1}
          on={intro}
          tag="h1"
          size={phone ? "clamp(30px,8.6vw,44px)" : "clamp(40px,4.4vw,72px)"}
          lh={0.98}
          delay={150}
          step={40}
          style={{ maxWidth: 1180, marginTop: 22 }}
        />
        <div className="cgpo-meta" style={{ ...FONT.M, ...rise(intro, 420) }}>
          <em>{p.f2}</em>
          <span>{p.f7}</span>
          <span>{p.f3}</span>
          {p.f6 && (
            <span className="cgpo-by">
              {author && <img src={author.img} alt="" loading="lazy" decoding="async" />}
              {p.f6}
              {author?.f2 ? ` · ${author.f2}` : ""}
            </span>
          )}
        </div>
        <p className="cgpo-sum" style={rise(intro, 520)}>
          {p.f4}
        </p>
      </header>
      <div className="cgpo-w">
        <div className="cgpo-cover">
          <img src={p.img} alt="" fetchPriority="high" decoding="async" />
          {!reduced && (
            <div className={cx("cgpo-px", intro && "is-on")} aria-hidden style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rowsN},1fr)` }}>
              {Array.from({ length: cols * rowsN }, (_, i) => (
                <i key={i} className={noise(i + 3) < 0.12 ? "is-hot" : ""} style={{ animationDelay: `${250 + Math.round(noise(i) * 1000)}ms` }} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="cgpo-w cgpo-grid">
        <div ref={artRef} className="cgpo-art">
          <Markdown text={p.f5} />
        </div>
        <aside className="cgpo-side">
          <div className="cgpo-card">
            <p style={FONT.M}>Written by</p>
            <div className="cgpo-au">
              {author && <img src={author.img} alt="" loading="lazy" decoding="async" />}
              <span>
                <b>{p.f6}</b>
                {author && <em style={FONT.M}>{author.f2}</em>}
              </span>
            </div>
            {author?.f3 && <p className="cgpo-bio">{author.f3}</p>}
            <p style={FONT.M}>Share</p>
            <div className="cgpo-share" style={FONT.M}>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={`https://x.com/intent/post?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                X
              </a>
              <button type="button" onClick={copy}>
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        </aside>
      </div>
      {more.length > 0 && (
        <div ref={moreRef} className="cgpo-w cgpo-more">
          <div className="cgpo-mh">
            <h2 style={FONT.D}>More notes</h2>
            <a href="/blog" style={FONT.M}>
              All notes
              <i aria-hidden>
                <ArrowRight size={13} />
              </i>
            </a>
          </div>
          <div className="cgpo-mg">
            {more.map((m, i) => (
              <a href={`/blog/${m.slug}`} className="cgpo-mc" style={rise(moreOn, 100 + i * 100, 30)} key={m.slug}>
                <span className="cgpo-mi">
                  <img src={m.img} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="cgpo-mt">
                  <em style={FONT.M}>
                    {m.f2} · {m.f3}
                  </em>
                  <b style={FONT.D}>{m.f1}</b>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
