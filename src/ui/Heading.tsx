import type { CSSProperties } from "react";
import { FONT, cx, plain, words } from "@/lib/text";
import { Spark } from "./Icons";

type Props = {
  /** `|` breaks a line, `*word*` paints a word orange. */
  text: string;
  on: boolean;
  tag?: "h1" | "h2" | "h3";
  size?: string;
  lh?: number;
  delay?: number;
  step?: number;
  style?: CSSProperties;
  className?: string;
};

/** Section heading whose words rise out of a mask one after another. */
export function Heading({ text, on, tag: Tag = "h2", size = "clamp(32px,3.7vw,56px)", lh = 0.96, delay = 0, step = 55, style, className }: Props) {
  let n = 0;
  return (
    <Tag className={cx("cg-hd", on && "is-on", className)} aria-label={plain(text)} style={{ ...FONT.D, fontSize: size, lineHeight: lh, ...style }}>
      {String(text)
        .split("|")
        .map((line, li) => (
          <span className="cg-hd-l" aria-hidden key={li}>
            {words(line).map((w, wi) => {
              const d = delay + n++ * step;
              return (
                <span className={cx("cg-hd-w", w.acc && "is-accw")} key={wi}>
                  <span
                    className={cx("cg-hd-i", w.acc && "is-acc")}
                    style={{ transitionDelay: `${d}ms`, ["--pd" as string]: `${d + 500}ms` }}
                  >
                    {w.acc ? (
                      <span className="cg-it">
                        {w.t}
                        {w.tail}
                        <Spark />
                      </span>
                    ) : (
                      <>
                        {w.t}
                        {w.tail}
                      </>
                    )}
                  </span>{" "}
                </span>
              );
            })}
          </span>
        ))}
    </Tag>
  );
}
