"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMounted } from "@/lib/hooks";
import { FONT, WIDE } from "@/lib/text";

const DURATION = 0.85; // seconds
const COLS = 10;
const ROWS = 7;
const GLYPHS = "{}[]<>/=*#01";
const HOME = "Home";


const orangeRow = (col: number) => Math.floor(((((Math.sin(col * 3.7 + 1.3) * 43758.5) % 1) + 1) % 1) * 7);

/** "/services/web-apps" → "web apps" */
const nameFor = (a: HTMLAnchorElement, url: URL) => {
  const n = a.getAttribute("data-pt-name");
  if (n) return n;
  const p = url.pathname.replace(/\/+$/, "");
  return p ? decodeURIComponent(p.split("/").pop() || "").replace(/[-_]+/g, " ") : HOME;
};

/**
 * Block wipe between pages. On an internal link click, dark blocks stack up column by column
 * and the destination name decodes in the middle; once the next route renders, the blocks fall away.
 * `cg-hold-pt` on <html> holds section entrance animations until the page is uncovered.
 */
export function PageTransition() {
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [shown, setShown] = useState("");
  const leaving = useRef(false);
  const timers = useRef<number[]>([]);
  const first = useRef(true);

  const clearTimers = () => {
    timers.current.forEach((t) => {
      window.clearTimeout(t);
      window.clearInterval(t);
    });
    timers.current = [];
  };

  // uncover: on first load (covered by the server HTML) and after each route change
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const el = ref.current;
    const delay = first.current ? Math.max(0, 60 + DURATION * 420 - performance.now()) : DURATION * 420;
    if (!first.current && el) {
      el.classList.remove("cgpt-leave", "cgpt-on");
      el.style.pointerEvents = "none";
      void el.offsetWidth;
      el.classList.add("cgpt-enter");
    }
    first.current = false;
    leaving.current = false;
    const t = window.setTimeout(() => html.classList.remove("cg-hold-pt"), delay);
    return () => window.clearTimeout(t);
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("cg-hold-pt");
      return;
    }
    const decode = (target: string) => {
      let k = 0;
      const id = window.setInterval(() => {
        k++;
        const p = k / 12;
        if (p >= 1) {
          setShown(target);
          window.clearInterval(id);
          return;
        }
        const keep = Math.floor(p * target.length);
        setShown(target.slice(0, keep) + target.slice(keep).replace(/\S/g, () => GLYPHS[(Math.random() * 12) | 0]));
      }, 32);
      timers.current.push(id);
    };
    const onClick = (e: MouseEvent) => {
      if (leaving.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.closest("[data-pt-skip]")) return;
      const href = a.getAttribute("href") || "";
      if (/^(mailto|tel|javascript):/i.test(href) || href.startsWith("#")) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      e.preventDefault();
      leaving.current = true;
      const label = nameFor(a, url);
      setName(label);
      setShown(label.replace(/\S/g, "0"));
      const el = ref.current;
      document.documentElement.classList.add("cg-hold-pt");
      if (el) {
        el.classList.remove("cgpt-enter", "cgpt-on");
        el.classList.add("cgpt-leave");
        el.style.pointerEvents = "auto";
        void el.offsetWidth;
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("cgpt-on")));
      }
      router.prefetch(url.pathname + url.search);
      timers.current.push(window.setTimeout(() => decode(label), DURATION * 1000 * 0.62));
      timers.current.push(
        window.setTimeout(() => {
          window.__lenis?.scrollTo(0, { immediate: true, force: true });
          window.scrollTo(0, 0);
          router.push(url.pathname + url.search + url.hash, { scroll: false });
        }, DURATION * 1000 + 420),
      );
    };
    document.addEventListener("click", onClick);
    return () => {
      clearTimers();
      document.removeEventListener("click", onClick);
    };
  }, [mounted, router]);

  return (
    <div ref={ref} className="cgpt cgpt-enter" aria-hidden style={{ "--d": `${DURATION}s`, "--cols": COLS, "--rows": ROWS } as CSSProperties}>
      <div className="cgpt-cols">
        {Array.from({ length: COLS }, (_, c) => {
          const o = orangeRow(c);
          return (
            <div className="cgpt-col" key={c} style={{ "--cx": c, "--st": ((((Math.sin(c * 12.1) * 9871) % 1) + 1) % 1).toFixed(3) } as CSSProperties}>
              {Array.from({ length: ROWS }, (_, r) => (
                <i key={r} className={r === o ? "is-o" : ""} style={{ "--y": 6 - r } as CSSProperties} />
              ))}
            </div>
          );
        })}
      </div>
      <div className="cgpt-mid">
        <p className="cgpt-lbl" style={FONT.M}>
          <i />
          Loading
        </p>
        <p className="cgpt-name" style={{ ...FONT.D, ...WIDE }}>
          <span>{shown || name || HOME}</span>
          <b>→</b>
        </p>
      </div>
    </div>
  );
}
