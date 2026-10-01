"use client";

import { RefObject, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { onFrame } from "./ticker";

export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const noop = () => () => {};

/** True after hydration. Animations and listeners wait for this. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

const RM = "(prefers-reduced-motion: reduce)";
function subscribeRm(notify: () => void) {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeRm,
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

/** Element width (drives the desktop / tablet / phone class switches) and viewport height. */
export function useWidth(ref: RefObject<HTMLElement | null>) {
  const [w, setW] = useState(1440);
  const [vh, setVh] = useState(900);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize && entry.borderBoxSize[0] ? entry.borderBoxSize[0].inlineSize : 0;
      const next = Math.round(box || el.offsetWidth);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    const onResize = () => setVh(window.innerHeight);
    onResize();
    const measure = () => {
      const next = Math.round(el.offsetWidth);
      if (next > 0) setW(next);
    };
    const t1 = window.setTimeout(measure, 150);
    const t2 = window.setTimeout(measure, 700);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
    };
  }, []);
  return { w, vh };
}

/** Watches the classes on <html> (the loader and page transition toggle them). */
function subscribeHtmlClass(notify: () => void) {
  const mo = new MutationObserver(notify);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

export function useHtmlClass(name: string) {
  return useSyncExternalStore(
    subscribeHtmlClass,
    () => document.documentElement.classList.contains(name),
    () => false,
  );
}

// safety net: never hold entrance animations for more than 9s
let holdExpired = false;
function subscribeHold(notify: () => void) {
  const stop = subscribeHtmlClass(notify);
  const t = window.setTimeout(() => {
    holdExpired = true;
    notify();
  }, 9000);
  return () => {
    stop();
    window.clearTimeout(t);
  };
}

/**
 * The loader and page transition put `cg-hold-*` classes on <html> while they cover the page.
 * Entrance animations wait until those are gone.
 */
export function useReleased(enabled: boolean) {
  const free = useSyncExternalStore(
    subscribeHold,
    () => holdExpired || !/(^|\s)cg-hold/.test(document.documentElement.className),
    () => false,
  );
  return enabled && free;
}

/**
 * Turns a section "on" (adds `is-on`) the first time it scrolls into view.
 * Keyboard focus inside the section turns it on immediately, without transitions.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, mounted: boolean, reduced: boolean, threshold = 0.16) {
  const [on, setOn] = useState(false);
  const released = useReleased(mounted);
  useEffect(() => {
    if (!mounted || reduced || !released) return;
    const el = ref.current;
    if (!el) return;
    let stopFrame = () => {};
    const onFocusIn = (e: FocusEvent) => {
      try {
        if ((e.target as Element).matches(":focus-visible")) {
          el.setAttribute("data-kb", "");
          void el.offsetWidth;
        }
      } catch {}
      setOn(true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) el.removeAttribute("data-kb");
    };
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          stopFrame = onFrame(() => {
            const rev = el.closest<HTMLElement>(".cg-rev.is-act");
            const progress = rev ? parseFloat(rev.style.getPropertyValue("--rv") || "0") : 1;
            if (progress > 0.24) {
              setOn(true);
              stopFrame();
            }
          });
        }
      },
      {
        threshold: Math.min(threshold, Math.max(0.005, (window.innerHeight * 0.3) / Math.max(1, el.offsetHeight))),
        rootMargin: "0px 0px -6% 0px",
      },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stopFrame();
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [ref, mounted, reduced, released, threshold]);
  // reduced motion: everything is simply shown
  return on || (mounted && reduced);
}

/** Buttons marked `data-mag` lean toward the pointer when it comes within 150px. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !ref.current || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const root = ref.current;
    const targets = () => Array.from(root.querySelectorAll<HTMLElement>("[data-mag]"));
    const move = (e: PointerEvent) => {
      for (const t of targets()) {
        const r = t.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        const pull = d < 150 ? (1 - d / 150) * 9 : 0;
        t.style.setProperty("--mx", `${(dx / (d || 1)) * pull}px`);
        t.style.setProperty("--my", `${(dy / (d || 1)) * pull}px`);
      }
    };
    const leave = () => {
      for (const t of targets()) {
        t.style.setProperty("--mx", "0px");
        t.style.setProperty("--my", "0px");
      }
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
    };
  }, [ref, enabled]);
}

/**
 * Scroll progress of a section, written to CSS as two eased variables:
 *   --sp  0 when the section's top meets the viewport bottom → 1 when its bottom leaves the top
 *   --pp  0 → 1 while a section taller than the viewport is pinned (equals --sp otherwise)
 * Images inside switch to eager loading once the section is within 1.5 viewports.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  mounted: boolean,
  reduced: boolean,
  onChange?: (sp: number, pp: number) => void,
) {
  // always call the latest callback without restarting the frame loop
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });
  useEffect(() => {
    if (!mounted || reduced || !ref.current) return;
    const el = ref.current;
    preloadImages(el);
    let near = true, last = -9, sp = -1, pp = -1, settled = false;
    const io = new IntersectionObserver((e) => (near = e[0].isIntersecting), { rootMargin: "25% 0px 25% 0px" });
    io.observe(el);
    let top = 0, height = 0, vh = 1, ready = false;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const stop = onFrame(
      () => {
        if (!ready) return;
        const tSp = clamp((vh - top) / (vh + height));
        const tPp = height > vh * 1.05 ? clamp(-top / (height - vh)) : tSp;
        if (sp < 0) {
          sp = tSp;
          pp = tPp;
        } else {
          sp += (tSp - sp) * 0.18;
          pp += (tPp - pp) * 0.18;
          if (Math.abs(tSp - sp) < 5e-4) sp = tSp;
          if (Math.abs(tPp - pp) < 5e-4) pp = tPp;
        }
        settled = sp === tSp && pp === tPp;
        if (Math.abs(sp + pp - last) < 3e-4) return;
        last = sp + pp;
        el.style.setProperty("--sp", sp.toFixed(4));
        el.style.setProperty("--pp", pp.toFixed(4));
        cb.current?.(sp, pp);
      },
      () => {
        if (!near && settled) {
          ready = false;
          return;
        }
        const r = el.getBoundingClientRect();
        top = r.top;
        height = r.height;
        vh = window.innerHeight || 1;
        ready = true;
      },
    );
    return () => {
      stop();
      io.disconnect();
    };
  }, [ref, mounted, reduced]);
}

function preloadImages(el: HTMLElement) {
  try {
    const io = new IntersectionObserver(
      (e) => {
        if (!e[0].isIntersecting) return;
        io.disconnect();
        el.querySelectorAll("img").forEach((img) => {
          try {
            img.loading = "eager";
            img.decode().catch(() => {});
          } catch {}
        });
      },
      { rootMargin: "150% 0px 150% 0px" },
    );
    io.observe(el);
  } catch {}
}

/** Live clock for the site's city, refreshed every 15s. */
export function useClock(mounted: boolean, timeZone = "America/Chicago") {
  const [time, setTime] = useState("");
  useEffect(() => {
    if (!mounted) return;
    const tick = () => {
      try {
        setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }));
      } catch {}
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [mounted, timeZone]);
  return time;
}
