import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/** Jumps a pinned section to a point of its own scroll progress (0–1). Desktop only. */
export function scrollToProgress(el: HTMLElement | null, progress: number) {
  if (!el || window.innerWidth < 810) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.height <= vh * 1.05) return;
  const target = r.top + window.scrollY + (r.height - vh) * Math.min(1, Math.max(0, progress));
  if (Math.abs(window.scrollY - target) < 8) return;
  if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true, force: true });
  else window.scrollTo(0, target);
}

export function scrollToTop(reduced: boolean) {
  if (window.__lenis && !reduced) window.__lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export const easeInOutCubic = (n: number) => {
  const t = Math.min(1, Math.max(0, n));
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};
