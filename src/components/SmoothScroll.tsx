"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onFrame } from "@/lib/ticker";
import "@/lib/scroll";

const ANCHOR_OFFSET = 72;

/**
 * Lenis smooth scrolling on desktop pointers (touch keeps native scrolling), stepped from the
 * shared gsap ticker so scroll position and every scroll-driven section update in the same frame.
 * In-page #anchors scroll smoothly with room for the fixed header.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.__lenis) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, autoRaf: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const stop = onFrame(
      () => {},
      undefined,
      (t) => lenis.raf(t),
    );
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.<HTMLAnchorElement>("a[href*='#']");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const i = href.indexOf("#");
      const path = href.slice(0, i);
      if (path && path !== location.pathname) return;
      const id = href.slice(i + 1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -ANCHOR_OFFSET });
      history.pushState(null, "", "#" + id);
    };
    document.addEventListener("click", onClick);
    document.documentElement.classList.add("lenis");
    return () => {
      stop();
      document.removeEventListener("click", onClick);
      lenis.destroy();
      window.__lenis = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);
  return null;
}
