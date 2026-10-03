import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { ArrowUpRight } from "./Icons";
import { cx } from "@/lib/text";

type Props = {
  href: string;
  label: string;
  kind?: "solid" | "ghost" | "quiet";
  arrow?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  ariaLabel?: string;
  cur?: string;
  icon?: ReactNode;
};

/**
 * The studio button: bracket corners that spring outward on hover, a fill that wipes up,
 * a label that rolls to its duplicate and an arrow chip that rotates.
 */
export function Button({ href, label, kind = "solid", arrow = true, className, style, onClick, ariaLabel, cur, icon }: Props) {
  // links that leave the site (the booking calendar) open in a new tab
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      className={cx("cg-btn", `cg-${kind}`, !arrow && "cg-noarr", className)}
      data-mag="true"
      data-cur={cur || "run"}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      style={style}
    >
      <span className="cg-cap">
        {icon}
        <span className="cg-lbl">
          <span className="cg-l1">{label}</span>
          <span className="cg-l2" aria-hidden>
            {label}
          </span>
        </span>
        {arrow && (
          <span className="cg-arr" aria-hidden>
            <ArrowUpRight />
          </span>
        )}
      </span>
    </a>
  );
}
