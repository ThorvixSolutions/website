import type { CSSProperties } from "react";

/** Font stacks. The --cg-font-* variables let a page swap fonts without touching components. */
export const FONT = {
  D: {
    fontFamily: "var(--cg-font-d, 'Archivo'), Inter, -apple-system, Arial, sans-serif",
    fontWeight: "var(--cg-font-dw, 500)",
    fontStyle: "normal",
  } as CSSProperties,
  B: {
    fontFamily: "var(--cg-font-b, 'Instrument Sans'), Inter, system-ui, -apple-system, Arial, sans-serif",
    fontWeight: "var(--cg-font-bw, 400)",
  } as CSSProperties,
  M: {
    fontFamily: "var(--cg-font-m, 'JetBrains Mono'), ui-monospace, SFMono-Regular, Menlo, monospace",
    fontWeight: "var(--cg-font-mw, 400)",
  } as CSSProperties,
};

/** Display type always runs at full width on the variable Archivo axis. */
export const WIDE: CSSProperties = { fontStretch: "125%" };

/** "a;b;c" → ["a","b","c"] */
export const splitList = (s: string) =>
  String(s || "")
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean);

/** "a|b;c|d" → [{a,b},{a,b}] */
export const splitPairs = (s: string) =>
  splitList(s)
    .map((x) => {
      const [a = "", b = ""] = x.split("|").map((y) => y.trim());
      return { a, b };
    })
    .filter((x) => x.a);

/** Strips the *accent* and | line-break markers used in headings. */
export const plain = (s: string) =>
  String(s || "")
    .replace(/\*/g, "")
    .replace(/\s*\|\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export type Word = { t: string; tail: string; acc: boolean };

/** Splits a heading line into words; `*word*` marks an accent word, trailing punctuation stays with it. */
export const words = (s: string): Word[] =>
  String(s || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const m = w.match(/^\*(.+?)\*([.,!?;:’']*)$/);
      return m ? { t: m[1], tail: m[2], acc: true } : { t: w.replace(/\*/g, ""), tail: "", acc: false };
    });

/** Fade-and-rise entrance used across sections. */
export const rise = (on: boolean, delay = 0, y = 22): CSSProperties => ({
  opacity: on ? 1 : 0,
  translate: on ? "0 0" : `0 ${y}px`,
  transition: `opacity .9s ease ${delay}ms, translate 1s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
});

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** "Label:/href, Label:/href" → [{l,h}] */
export const parseLinks = (s: string) =>
  String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const i = x.indexOf(":");
      return { l: i < 0 ? x : x.slice(0, i).trim(), h: i < 0 ? "/" : x.slice(i + 1).trim() };
    });

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");
