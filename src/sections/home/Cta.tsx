"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveRgb, startCube } from "@/lib/cube";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, rise, splitList } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const FACTS = splitList("Reply within 1 business day;Free 30-minute scoping call;Fixed quote for the first release");

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef(0);
  const router = useRouter();
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.16);
  const [hasGl, setHasGl] = useState(false);
  const [email, setEmail] = useState("");
  useMagnetic(ref, mounted);

  useEffect(() => {
    if (!mounted || !canvasRef.current || !objRef.current || !ref.current) return;
    return startCube({
      canvas: canvasRef.current,
      host: objRef.current,
      accent: resolveRgb(ref.current, "var(--cg-brass)", "255,90,31"),
      reduced,
      phone: window.innerWidth < 810,
      mode: "cta",
      focus: () => focusRef.current,
      onReady: () => setHasGl(true),
    });
  }, [mounted, reduced]);

  const href = `/contact${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`;

  return (
    <section
      ref={ref}
      className={cx("cg cg-dark cgc", on && "is-on", w < 810 ? "is-ph" : w < 1100 && "is-tab", hasGl && "has-gl")}
      data-cg-w={w}
      style={FONT.B}
    >
      <div className="cgc-glow" aria-hidden />
      <div className="cgc-in">
        <div className="cgc-copy">
          <Eyebrow text="Start a project" on={on} />
          <Heading text="Let's build|your *product.*" on={on} size="clamp(38px,4.9vw,76px)" lh={0.94} delay={120} style={{ marginTop: 22 }} />
          <p className="cgc-sub" style={rise(on, 380)}>
            Tell us what you are building. You get a reply within one business day, a free scoping call and a fixed quote for the first release.
          </p>
          <form
            className="cgc-form"
            style={rise(on, 480)}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(href);
            }}
            onMouseEnter={() => (focusRef.current = 1)}
            onMouseLeave={() => (focusRef.current = 0)}
            onFocus={() => (focusRef.current = 1)}
            onBlur={() => (focusRef.current = 0)}
          >
            <label className="cg-sr" htmlFor="cgc-email">
              Work email
            </label>
            <input
              id="cgc-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={FONT.M}
            />
            <Button href={href} label="Get a quote" kind="solid" />
          </form>
          <ul className="cgc-facts" style={{ ...FONT.M, ...rise(on, 580) }}>
            {FACTS.map((f) => (
              <li key={f}>
                <i aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div ref={objRef} className="cgc-obj" data-cur="Drag" role="img" aria-label="The Forrentech cube assembling from its modules">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </section>
  );
}
