"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { work } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReleased, useReveal, useWidth } from "@/lib/hooks";
import { FONT, WIDE, cx, pad2, rise, splitList } from "@/lib/text";
import { ArrowRight, Button, Heading } from "@/ui";

const STEPS = [72, 48, 32, 24, 16, 11, 7, 4];

/** "+38% bookings" → { v: "+38%", l: "bookings" }; keeps units like "1.1 s" with the number. */
const splitResult = (s: string) => {
  const m = String(s || "")
    .trim()
    .match(/^(\S*\d\S*(?:\s(?:s|ms|h|min|k|x|wk|weeks?|days?)\b)?)\s+(.*)$/i);
  return m ? { v: m[1], l: m[2] } : { v: String(s || "").trim(), l: "" };
};

/** Full-bleed cover that resolves from huge pixel blocks down to the photo, then calls onDone. */
function PixelHero({ src, alt, run, onDone }: { src: string; alt: string; run: boolean; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    if (!run) return;
    const host = ref.current;
    const cv = canvasRef.current;
    const img = host?.querySelector("img");
    if (!host || !cv || !img) {
      done.current();
      return;
    }
    let raf = 0;
    let stopped = false;
    // never hold the page longer than 2.6s, even if the image is slow
    const bail = window.setTimeout(() => !stopped && done.current(), 2600);
    const start = () => {
      if (stopped || !img.naturalWidth) {
        done.current();
        return;
      }
      const r = host.getBoundingClientRect();
      const dpr = Math.min(1.25, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr));
      const H = Math.max(1, Math.round(r.height * dpr));
      cv.width = W;
      cv.height = H;
      const ctx = cv.getContext("2d");
      if (!ctx) {
        done.current();
        return;
      }
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const iw = img.naturalWidth * scale;
      const ih = img.naturalHeight * scale;
      const ox = (W - iw) / 2;
      const oy = (H - ih) / 2;
      const small = document.createElement("canvas");
      const draw = (px: number) => {
        const sw = Math.max(1, Math.ceil(W / (px * dpr)));
        const sh = Math.max(1, Math.ceil(H / (px * dpr)));
        small.width = sw;
        small.height = sh;
        const sctx = small.getContext("2d")!;
        sctx.imageSmoothingEnabled = true;
        sctx.drawImage(img, (ox * sw) / W, (oy * sh) / H, (iw * sw) / W, (ih * sh) / H);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(small, 0, 0, sw, sh, 0, 0, sw * px * dpr, sh * px * dpr);
      };
      draw(STEPS[0]);
      host.classList.add("is-px");
      const t0 = performance.now();
      let step = -1;
      const frame = (now: number) => {
        if (stopped) return;
        const k = Math.floor((now - t0) / 95);
        if (k >= STEPS.length) {
          host.classList.remove("is-px");
          window.clearTimeout(bail);
          done.current();
          return;
        }
        if (k !== step) {
          step = k;
          draw(STEPS[k]);
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    if (img.complete && img.naturalWidth) start();
    else {
      img.addEventListener("load", start, { once: true });
      img.addEventListener("error", () => done.current(), { once: true });
    }
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(bail);
    };
  }, [run, src]);

  return (
    <div ref={ref} className="cgcs-pix">
      <img src={src} alt={alt} fetchPriority="high" decoding="async" />
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}

/** Result number; when `roll` is set each digit rolls up a 0–9 strip. */
function Result({ v, on, roll }: { v: string; on: boolean; roll: boolean }) {
  const style = { ...FONT.D, ...WIDE };
  if (!roll)
    return (
      <b className="cgcs-odo" style={style}>
        {v}
      </b>
    );
  return (
    <b className="cgcs-odo" style={style} aria-label={v}>
      {v.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span className="cgcs-dg" aria-hidden key={i}>
            <span style={{ transform: `translateY(${on ? -Number(ch) * 10 : 0}%)`, transitionDelay: `${i * 80}ms` }}>
              {"0123456789".split("").map((d) => (
                <i key={d}>{d}</i>
              ))}
            </span>
          </span>
        ) : (
          <span aria-hidden key={i}>
            {ch}
          </span>
        ),
      )}
    </b>
  );
}

export function Case({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [roll, setRoll] = useState(false);
  useMagnetic(ref, mounted);

  const c = work.find((x) => x.slug === slug) || work[0];
  const idx = work.findIndex((x) => x.slug === c.slug);
  const next = work.length > 1 ? work[(idx + 1) % work.length] : null;
  const results = splitList(c.f10)
    .map(splitResult)
    .filter((r) => r.v)
    .slice(0, 3);
  const stack = String(c.f14 || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const reviewer = String(c.f12 || "");
  const who = reviewer.split(",")[0].trim();
  const role = reviewer.split(",").slice(1).join(",").trim();
  const initials = who
    .split(/\s+/)
    .filter((x) => /^[A-Za-z]/.test(x))
    .slice(-2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
  const file = `reviews/${String(c.f1 || "client")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.md`;

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 60);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  // results only roll if they start below the fold (otherwise they'd animate before anyone looks)
  useEffect(() => {
    if (!mounted || reduced) return;
    const raf = requestAnimationFrame(() => {
      if (resRef.current && resRef.current.getBoundingClientRect().top > (window.innerHeight || 900)) setRoll(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduced]);

  const intro = entered || reduced;
  const animate = mounted && !reduced;
  const resOn = useReveal(resRef, mounted, reduced, 0.3);
  const quoteOn = useReveal(quoteRef, mounted, reduced, 0.25);
  const phone = w < 810;

  return (
    <div
      ref={ref}
      className={cx("cg cgcs", phone ? "is-ph" : w < 1100 && "is-tab", intro && "is-in", animate && !revealed && "is-wait")}
      data-cg-w={w}
      style={FONT.B}
    >
      <section className="cgcs-top cg-dark" aria-label={c.f3}>
        <PixelHero src={c.img} alt={`${c.f1}: ${c.f3}`} run={animate && intro} onDone={() => setRevealed(true)} />
        <div className="cgcs-shade" aria-hidden />
        <div className="cgcs-w cgcs-tin">
          <nav className="cgcs-cr" aria-label="Breadcrumb" style={{ ...FONT.M, ...rise(intro, 0) }}>
            <ol>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/work">Work</a>
              </li>
              <li>
                <span aria-current="page">{c.f1}</span>
              </li>
            </ol>
          </nav>
          <p className="cgcs-cl" style={{ ...FONT.M, ...rise(intro, 100) }}>
            <b>{c.f1}</b>
            <span>{c.f2}</span>
            <span>{c.f7}</span>
          </p>
          <div className="cgcs-trow">
            <Heading
              text={c.f3}
              on={intro}
              tag="h1"
              size={phone ? "clamp(34px,9.6vw,50px)" : "clamp(46px,5vw,88px)"}
              lh={0.94}
              delay={250}
              step={50}
              style={{ maxWidth: 1060 }}
            />
            <div className="cgcs-badge" style={rise(intro, 900, 30)}>
              <b style={{ ...FONT.D, ...WIDE }}>{c.f4}</b>
              <span style={FONT.M}>{c.f5}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="cgcs-body" aria-label="Results">
        <div className="cgcs-w">
          <div ref={resRef} className="cgcs-res">
            <p style={FONT.M}>Results</p>
            <div>
              {results.map((r, i) => (
                <div style={rise(resOn, i * 120, 24)} key={r.v}>
                  <span className="cgcs-rn" style={FONT.M}>
                    {pad2(i + 1)}
                  </span>
                  <Result v={r.v} on={!roll || resOn} roll={roll} />
                  <span className="cgcs-rl">{r.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cgcs-ch">
            <p className="cgcs-lab" style={FONT.M}>
              <em>01</em>The challenge
            </p>
            <p className="cgcs-txt">{c.f8}</p>
          </div>
          <div className="cgcs-ch">
            <p className="cgcs-lab" style={FONT.M}>
              <em>02</em>What we built
            </p>
            <div>
              <p className="cgcs-txt">{c.f9}</p>
              <dl className="cgcs-facts">
                <div>
                  <dt style={FONT.M}>Stack</dt>
                  <dd>
                    {stack.map((s) => (
                      <span style={FONT.M} key={s}>
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt style={FONT.M}>Timeline</dt>
                  <dd>
                    <span style={FONT.M}>{c.f13}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {c.f11 && (
            <figure ref={quoteRef} className={cx("cgcs-q cg-dark", quoteOn && "is-on")}>
              <div className="cgcs-qbar" style={FONT.M}>
                <i />
                <i />
                <i />
                <span>
                  <b>■</b> {file}
                </span>
              </div>
              <div className="cgcs-qin">
                <div className="cgcs-qhd">
                  <span className="cgcs-av" aria-hidden style={FONT.M}>
                    {initials || "✓"}
                  </span>
                  <span>
                    <b>{who}</b>
                    <span style={FONT.M}>{role}</span>
                  </span>
                </div>
                <blockquote>{c.f11}</blockquote>
                <figcaption className="cgcs-ok" style={FONT.M}>
                  <span aria-hidden>✓</span>
                  Approved these changes
                  <span className="cg-sr"> — {reviewer}</span>
                </figcaption>
              </div>
            </figure>
          )}
          <div className="cgcs-cta">
            <Button href="/contact" label="Start a project" kind="solid" />
          </div>
        </div>
      </section>
      {next && (
        <a className="cgcs-next cg-dark" href={`/work/${next.slug}`}>
          <span className="cgcs-nph">
            <img src={next.img} alt="" loading="lazy" decoding="async" />
          </span>
          <span className="cgcs-w cgcs-nin">
            <span className="cgcs-nl" style={FONT.M}>
              Next case · {next.f1}
            </span>
            <b style={{ ...FONT.D, ...WIDE } as CSSProperties}>{next.f3}</b>
            <span className="cgcs-na" aria-hidden>
              <ArrowRight size={18} />
            </span>
          </span>
        </a>
      )}
    </div>
  );
}
