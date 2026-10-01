import gsap from "gsap";

type FrameFn = (time: number) => void;

/*
 * One frame loop for the whole site, driven by gsap.ticker.
 * Each frame runs three phases in order so layout reads never interleave with writes:
 *   pre   – things that move the page (Lenis)
 *   reads – measure the DOM (getBoundingClientRect, scrollY)
 *   subs  – write styles / CSS variables
 * `time` is a performance.now() timestamp, same as a requestAnimationFrame callback.
 */
const pre = new Set<FrameFn>();
const reads = new Set<FrameFn>();
const subs = new Set<FrameFn>();
let started = false;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(() => {
    const t = performance.now();
    pre.forEach((f) => f(t));
    reads.forEach((f) => f(t));
    subs.forEach((f) => f(t));
  });
}

export function onFrame(write: FrameFn, read?: FrameFn, before?: FrameFn) {
  if (typeof window === "undefined") return () => {};
  start();
  subs.add(write);
  if (read) reads.add(read);
  if (before) pre.add(before);
  return () => {
    subs.delete(write);
    if (read) reads.delete(read);
    if (before) pre.delete(before);
  };
}
