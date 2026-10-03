"use client";

import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { site } from "@/data/cms";
import { legal } from "@/data/legal";
import { useMounted, useReducedMotion, useReleased, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, rise } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const EMAIL = site[0].f4 || "hello@Thorvix.dev";
const TITLES = { privacy: "Privacy policy", terms: "Terms of use" };

type Section = { h: string; id: string; lines: string[] };

/** "## Heading" lines start sections; everything until the next heading belongs to it. */
function parse(text: string) {
  const out: Section[] = [];
  text.split(/\n/).forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith("## ")) {
      const h = line.slice(3).trim();
      out.push({ h, id: "cglg-" + h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), lines: [] });
    } else {
      if (!out.length) out.push({ h: "", id: "cglg-intro", lines: [] });
      out[out.length - 1].lines.push(line);
    }
  });
  return out;
}

/** Paragraphs, with consecutive "- " lines grouped into a list. */
function render(lines: string[]) {
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
    out.push(<p key={out.length}>{l}</p>);
  });
  flush();
  return out;
}

export function Legal({ kind, updated = "September 1, 2026" }: { kind: "privacy" | "terms"; updated?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(0);
  const sections = parse(legal[kind]);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  // highlight the section sitting in the upper third of the viewport
  useEffect(() => {
    if (!mounted || !artRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    artRef.current.querySelectorAll("[data-i]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, kind]);

  const jump = (e: MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    try {
      history.replaceState(null, "", "#" + id);
    } catch {}
  };

  const on = entered || reduced;
  const phone = w < 810;
  return (
    <div ref={ref} className={cx("cg cglg", phone ? "is-ph" : w < 1100 && "is-tab")} data-cg-w={w} style={FONT.B}>
      <header className="cglg-w cglg-head">
        <Eyebrow text="Legal" on={on} />
        <Heading text={TITLES[kind]} on={on} tag="h1" size={phone ? "clamp(36px,10.5vw,54px)" : "clamp(48px,6vw,100px)"} lh={0.92} delay={120} style={{ marginTop: 22 }} />
        <p className="cglg-up" style={{ ...FONT.M, ...rise(on, 380) }}>
          <i aria-hidden />
          Last updated · {updated}
        </p>
      </header>
      <div className="cglg-w cglg-grid" style={rise(on, 480, 30)}>
        <nav className="cglg-toc" aria-label="On this page">
          <p style={FONT.M}>On this page</p>
          <ol>
            {sections
              .filter((s) => s.h)
              .map((s, n) => {
                const i = sections.indexOf(s);
                return (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={active === i ? "is-on" : ""} onClick={(e) => jump(e, s.id)}>
                      <em style={FONT.M}>{pad2(n + 1)}</em>
                      {s.h}
                    </a>
                  </li>
                );
              })}
          </ol>
        </nav>
        <div ref={artRef} className="cglg-art">
          {sections.map((s, i) => (
            <section id={s.id} data-i={i} className="cglg-sec" key={s.id}>
              {s.h && <h2 style={FONT.D}>{s.h}</h2>}
              {render(s.lines)}
            </section>
          ))}
          <p className="cglg-mail">
            Questions? Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
