"use client";

import { CSSProperties, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { services, site, work } from "@/data/cms";
import { useMounted } from "@/lib/hooks";
import { FONT, WIDE, cx, pad2, parseLinks } from "@/lib/text";
import { ArrowRight, Button } from "@/ui";

const S = site[0];
const LINKS = parseLinks("Services:/services, Work:/work, Process:/process, Pricing:/pricing, About:/about, Blog:/blog").slice(0, 7);
const SERVICES = services.filter((s) => s.f1).slice(0, 6);
const CASES = work.filter((w) => w.f1);
const CTA_HREF = S.f8 || "/contact";
const NAME = S.f1 || "Codeforge";

/** Three stacked isometric slabs; the one for this row's layer is lit. */
function Slab({ i }: { i: number }) {
  return (
    <svg className="cghd-slab" viewBox="0 0 44 40" width="40" height="36" aria-hidden>
      {[0, 1, 2].map((k) => {
        const y = 24 - k * 8;
        return (
          <g key={k} className={k === i % 3 ? "is-a" : ""}>
            <path d={`M22 ${y - 7} L38 ${y} L22 ${y + 7} L6 ${y} Z`} className="t" />
            <path d={`M6 ${y} L22 ${y + 7} L22 ${y + 11} L6 ${y + 4} Z`} className="l" />
            <path d={`M38 ${y} L22 ${y + 7} L22 ${y + 11} L38 ${y + 4} Z`} className="r" />
          </g>
        );
      })}
    </svg>
  );
}

function Logo() {
  return (
    <a className="cghd-logo" href="/" style={{ ...FONT.D, ...WIDE }} aria-label={`${NAME}, home`}>
      <span className="cghd-mark" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      {NAME}
    </a>
  );
}

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const pathname = usePathname() || "/";
  const path = pathname.replace(/\/$/, "") || "/";

  const [dark, setDark] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [mega, setMega] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [feat, setFeat] = useState(0);
  const st = useRef({ lastY: 0, ranges: [] as [number, number][], dark: true, hide: false, solid: false });

  // invert over dark sections, hide while scrolling down, go solid once scrolled
  useEffect(() => {
    if (!mounted) return;
    const s = st.current;
    s.lastY = window.scrollY;
    let raf = 0;
    const measure = () => {
      const head = ref.current;
      const ranges: [number, number][] = [];
      document.querySelectorAll(".cg-dark").forEach((el) => {
        if ((head && head.contains(el)) || el.closest(".cghd-sheet") || (el.parentElement && el.parentElement.closest(".cg-dark"))) return;
        const r = el.getBoundingClientRect();
        if (r.height >= 60) ranges.push([r.top + window.scrollY, r.bottom + window.scrollY]);
      });
      s.ranges = ranges;
    };
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const probe = y + 36;
      const isDark = s.ranges.some(([a, b]) => probe >= a && probe < b);
      const isSolid = y > 40;
      let hide = s.hide;
      if (!mega && !sheet) {
        if (y > s.lastY + 6 && y > 320) hide = true;
        else if (y < s.lastY - 6 || y < 320) hide = false;
      } else hide = false;
      s.lastY = y;
      if (isDark !== s.dark) setDark((s.dark = isDark));
      if (hide !== s.hide) setHidden((s.hide = hide));
      if (isSolid !== s.solid) setSolid((s.solid = isSolid));
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(update);
    };
    measure();
    update();
    const id = window.setInterval(measure, 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted, mega, sheet, pathname]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setSheet(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  // the sheet locks page scroll and takes focus
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (sheet) {
      html.style.overflow = "hidden";
      window.__lenis?.stop();
      window.setTimeout(() => sheetRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 60);
    } else {
      html.style.overflow = "";
      window.__lenis?.start();
    }
  }, [sheet, mounted]);

  // close the mega menu when focus leaves the header
  useEffect(() => {
    if (!mega) return;
    const onFocus = (e: FocusEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, [mega]);

  // close menus when the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSheet(false);
    setMega(false);
  }

  const skip = (e: MouseEvent) => {
    e.preventDefault();
    const main = document.querySelector<HTMLElement>("main, section.cg:not(.cghd)");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
      main.scrollIntoView();
    }
  };
  const trapTab = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const els = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a,button"));
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  const isCurrent = (h: string) => path !== "" && h !== "/" && (path === h || path.startsWith(h + "/"));

  const featured = CASES[feat % Math.max(1, CASES.length)] || CASES[0];

  const sheetEl = sheet ? (
    <div ref={sheetRef} className="cg cg-dark cghd-sheet" style={FONT.B} role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapTab}>
      <div className="cghd-wipe" aria-hidden>
        {Array.from({ length: 112 }, (_, i) => (
          <i key={i} style={{ "--d": `${((i % 8) + Math.floor(i / 8)) * 16}ms` } as CSSProperties} />
        ))}
      </div>
      <div className="cghd-sin">
        <div className="cghd-shtop">
          <Logo />
          <button type="button" className="cghd-x" onClick={() => setSheet(false)} style={FONT.M}>
            Close
            <i aria-hidden />
          </button>
        </div>
        <ol className="cghd-tiles">
          {[{ l: "Home", h: "/" }, ...LINKS].map((l, i) => {
            const cur = isCurrent(l.h) || (l.h === "/" && path === "/");
            return (
              <li key={l.h} style={{ "--i": i } as CSSProperties}>
                <a href={l.h} onClick={() => setSheet(false)} aria-current={cur ? "page" : undefined}>
                  <em style={FONT.M}>{pad2(i + 1)}</em>
                  <b style={{ ...FONT.D, ...WIDE }}>{l.l}</b>
                </a>
              </li>
            );
          })}
        </ol>
        {SERVICES.length > 0 && (
          <div className="cghd-schips" style={FONT.M}>
            {SERVICES.map((s) => (
              <a href={`/services/${s.slug}`} onClick={() => setSheet(false)} key={s.slug}>
                {s.f1}
              </a>
            ))}
          </div>
        )}
        <div className="cghd-sfoot">
          {S.f4 && (
            <a href={`mailto:${S.f4}`} style={FONT.M}>
              {S.f4}
            </a>
          )}
          <Button href={CTA_HREF} label="Start a project" kind="solid" />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <header
      ref={ref}
      className={cx("cg cghd", dark && "is-dark", hidden && "is-hide", solid && "is-solid", mega && "is-mega")}
      style={FONT.B}
      onMouseLeave={() => setMega(false)}
    >
      <a className="cghd-skip" href="#" onClick={skip}>
        Skip to content
      </a>
      <div className="cghd-bar">
        <div className="cghd-in">
          <Logo />
          <nav className="cghd-nav" aria-label="Primary">
            <ul style={FONT.M}>
              {LINKS.map((l, i) => {
                const hasMega = l.l.toLowerCase() === "services" && SERVICES.length > 0;
                const cur = isCurrent(l.h);
                return (
                  <li key={l.h} onMouseEnter={() => setMega(hasMega)}>
                    <a
                      href={l.h}
                      className={cur ? "is-cur" : ""}
                      aria-current={cur ? "page" : undefined}
                      aria-expanded={hasMega ? mega : undefined}
                      onFocus={() => setMega(hasMega)}
                      onKeyDown={(e) => {
                        if (hasMega && e.key === "ArrowDown") {
                          e.preventDefault();
                          setMega(true);
                          const first = ref.current?.querySelector<HTMLElement>(".cghd-drawer a");
                          if (first) window.setTimeout(() => first.focus(), 30);
                        }
                      }}
                    >
                      <span className="cghd-n">{pad2(i + 1)}</span>
                      {l.l}
                      {hasMega && <span className="cghd-car" aria-hidden />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Button href={CTA_HREF} label="Start a project" kind="quiet" className="cghd-cta" />
          <button type="button" className="cghd-burger" aria-label="Menu" aria-expanded={sheet} onClick={() => setSheet(true)} style={FONT.M}>
            <span>Menu</span>
            <span className="cghd-bk" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
      <div className="cghd-drawer cg-dark" aria-hidden={!mega} onMouseEnter={() => setMega(true)}>
        <div className="cghd-dgrid">
          <div className="cghd-list">
            <p className="cghd-dt" style={FONT.M}>
              <i />
              What we build
            </p>
            <ul>
              {SERVICES.map((s, i) => (
                <li key={s.slug} style={{ "--i": i } as CSSProperties}>
                  <a
                    href={`/services/${s.slug}`}
                    tabIndex={mega ? 0 : -1}
                    onMouseEnter={() => setFeat(i)}
                    onFocus={() => setFeat(i)}
                    className={feat === i ? "is-hv" : ""}
                  >
                    <span className="cghd-idx" style={FONT.M}>
                      {pad2(i + 1)}
                    </span>
                    <Slab i={i} />
                    <span className="cghd-tx">
                      <b style={{ ...FONT.D, ...WIDE }}>{s.f1}</b>
                      <em>{s.f2}</em>
                    </span>
                    <span className="cghd-out" style={FONT.M}>
                      <b>{s.f3}</b>
                      <small>{s.f4}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a className="cghd-all" href="/services" tabIndex={mega ? 0 : -1} style={FONT.M}>
              All services <ArrowRight size={13} />
            </a>
          </div>
          {featured && (
            <a className="cghd-feat" href={`/work/${featured.slug}`} tabIndex={mega ? 0 : -1}>
              <span className="cghd-fph">
                <img src={featured.img} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="cghd-fl" style={FONT.M}>
                <i />
                Featured case · {featured.f1}
              </span>
              <b style={{ ...FONT.D, ...WIDE }}>{featured.f4}</b>
              <span className="cghd-ft">{featured.f3}</span>
            </a>
          )}
        </div>
      </div>
      {mounted && sheetEl ? createPortal(sheetEl, document.body) : null}
    </header>
  );
}
