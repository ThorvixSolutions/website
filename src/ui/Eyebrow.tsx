import type { CSSProperties } from "react";
import { FONT, cx } from "@/lib/text";

/** Bracketed section label with an orange square: [ ■ SERVICES ] */
export function Eyebrow({ text, on, delay = 0, style }: { text: string; on: boolean; delay?: number; style?: CSSProperties }) {
  if (!text) return null;
  return (
    <p className={cx("cg-eb", on && "is-on")} style={{ ...FONT.M, transitionDelay: `${delay}ms`, ...style }}>
      <i aria-hidden />
      {text}
    </p>
  );
}
