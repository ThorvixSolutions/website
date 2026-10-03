"use client";

import { useEffect, useRef, useState } from "react";
import { useMagnetic, useMounted, useReducedMotion, useReleased, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, rise, splitList } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const PHOTO = "/images/about/studio.webp";
const CAPTION = "The Austin studio, Friday demo day";
/** "a|b|c;…" → [[a,b,c],…], padded to `n` fields */
const rows = (s: string, n: number) =>
  splitList(s).map((r) => {
    const f = r.split("|").map((x) => x.trim());
    while (f.length < n) f.push("");
    return f;
  });
const STATS = rows("2016|founded in Austin;38|engineers and designers;140+|products shipped;9|countries our clients ship in", 2);
const PRINCIPLES = rows(
  "Senior people only|Every project is run by engineers with at least eight years of shipping. No juniors learning on your budget.;Working software every two weeks|You click through something real at every demo. Progress is a build, never a slide.;Scope moves, dates do not|When something takes longer, we cut scope with you and keep the release on time.;You own everything|Code, cloud, accounts and designs live in your name from the first commit.",
  2,
);
const TIMELINE = rows(
  "2016|Four engineers, one room|Thorvix opens in Austin with its first startup client.;2018|First million users|A fintech app we built passes one million sign-ups.;2019|Mobile practice|React Native and native iOS and Android join the web team.;2021|Remote across 6 time zones|The team grows to 20 and starts working with clients in Europe.;2023|AI features in production|Our first retrieval and assistant features go live for clients.;2024|100th product shipped|A milestone release, and a bigger studio on South Congress.;2026|38 people, 140+ products|Still demoing working software every two weeks.",
  3,
);

const noise = (n: number) => {
  const t = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return t - Math.floor(t);
};

/** 8×10 grid of squares over the photo that blink away in a scattered order. */
function PixelCover({ on }: { on: boolean }) {
  return (
    <div className={cx("cgab-px", on && "is-on")} aria-hidden style={{ gridTemplateColumns: "repeat(8,1fr)", gridTemplateRows: "repeat(10,1fr)" }}>
      {Array.from({ length: 80 }, (_, i) => {
        const d = Math.round(noise(i) * 900);
        return <i key={i} className={noise(i + 7) < 0.14 ? "is-hot" : ""} style={{ transitionDelay: `${d}ms`, animationDelay: `${d}ms` }} />;
      })}
    </div>
  );
}

/** Odometer: each digit rolls up a 0–9 strip. */
function Odometer({ text, on, delay = 0 }: { text: string; on: boolean; delay?: number }) {
  return (
    <span className="cgab-odo" style={FONT.D} aria-label={text}>
      {text.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span className="cgab-od" aria-hidden key={i}>
            <span style={{ translate: `0 ${on ? -Number(ch) * 10 : 0}%`, transitionDelay: `${delay + i * 70}ms` }}>
              {"0123456789".split("").map((d) => (
                <b key={d}>{d}</b>
              ))}
            </span>
          </span>
        ) : (
          <span aria-hidden key={i}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const numsRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [flip, setFlip] = useState(-1);
  const [progress, setProgress] = useState(0);
  useMagnetic(ref, mounted);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  // keyboard users get everything shown at once
  useEffect(() => {
    const el = ref.current;
    if (!mounted || !el) return;
    const show = () => setFocused(true);
    el.addEventListener("focusin", show);
    return () => el.removeEventListener("focusin", show);
  }, [mounted]);

  const intro = entered || reduced;
  const numsOn = useReveal(numsRef, mounted, reduced) || focused;
  const rulesOn = useReveal(rulesRef, mounted, reduced) || focused;
  const tlOn = useReveal(tlRef, mounted, reduced) || focused;

  // timeline: drag with the mouse, progress bar follows the horizontal scroll
  useEffect(() => {
    const strip = stripRef.current;
    if (!mounted || !strip) return;
    let down = false, startX = 0, startLeft = 0, moved = false;
    const press = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = strip.scrollLeft;
      strip.classList.add("is-drag");
    };
    const drag = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startLeft - dx;
    };
    const release = () => {
      down = false;
      strip.classList.remove("is-drag");
    };
    // a drag shouldn't also count as a click on whatever is under the pointer
    const swallow = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const track = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      setProgress(max > 0 ? strip.scrollLeft / max : 1);
    };
    strip.addEventListener("pointerdown", press);
    window.addEventListener("pointermove", drag);
    window.addEventListener("pointerup", release);
    strip.addEventListener("click", swallow, true);
    strip.addEventListener("scroll", track, { passive: true });
    const raf = requestAnimationFrame(track);
    return () => {
      cancelAnimationFrame(raf);
      strip.removeEventListener("pointerdown", press);
      window.removeEventListener("pointermove", drag);
      window.removeEventListener("pointerup", release);
      strip.removeEventListener("click", swallow, true);
      strip.removeEventListener("scroll", track);
    };
  }, [mounted]);

  const phone = w < 810;
  return (
    <div ref={ref} className={cx("cg cgab", phone ? "is-ph" : w < 1100 && "is-tab", intro && "is-in", reduced && "is-still")} data-cg-w={w} style={FONT.B}>
      <section className="cg-dark cgab-open" aria-label="About the studio">
        <div className="cgab-w">
          <Eyebrow text="About the studio" on={intro} />
          <Heading
            text="We build software|startups can *bet on.*"
            on={intro}
            tag="h1"
            size={phone ? "clamp(34px,10vw,52px)" : "clamp(46px,5.4vw,92px)"}
            lh={0.93}
            delay={120}
            style={{ marginTop: 22 }}
          />
          <div className="cgab-grid">
            <div className="cgab-story" style={rise(intro, 420)}>
              <p>
                Thorvix started in Austin in 2016 with four engineers who were tired of watching good ideas die in slow agencies. We wanted a studio
                where the people who scope the work are the people who write the code.
              </p>
              <p>
                Today we are 38 engineers, designers and product leads. We have shipped more than 140 products for startups and growing companies, from
                first MVPs to platforms that serve millions of users, and we still demo working software every two weeks.
              </p>
            </div>
            <figure className="cgab-fig" style={rise(intro, 300, 30)}>
              <div className="cgab-ph">
                <img src={PHOTO} alt={CAPTION} decoding="async" fetchPriority="high" />
                {!reduced && <PixelCover on={intro} />}
              </div>
              <figcaption style={FONT.M}>
                <i aria-hidden />
                {CAPTION}
              </figcaption>
            </figure>
          </div>
          <div ref={numsRef} className="cgab-nums">
            {STATS.map(([v, l], i) => (
              <div className="cgab-num" style={rise(numsOn, i * 90)} key={l}>
                <Odometer text={v} on={numsOn} delay={i * 120} />
                <span style={FONT.M}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="cgab-light" aria-label="How we work">
        <div className="cgab-w">
          <div ref={rulesRef} className="cgab-ph2">
            <Eyebrow text="How we work" on={rulesOn} />
            <Heading text="Four rules we|*do not* bend" on={rulesOn} delay={100} style={{ marginTop: 18 }} />
            <p className="cgab-hint" style={{ ...FONT.M, ...rise(rulesOn, 300) }}>
              Hover or tap to turn
            </p>
          </div>
          <div className="cgab-cards">
            {PRINCIPLES.map(([title, body], i) => (
              <button
                type="button"
                key={title}
                className={cx("cgab-card", flip === i && "is-flip")}
                style={rise(rulesOn, 200 + i * 110, 40)}
                aria-pressed={flip === i}
                aria-label={`${pad2(i + 1)} ${title}: ${body}`}
                onClick={() => setFlip(flip === i ? -1 : i)}
                onMouseEnter={() => setFlip(i)}
                onMouseLeave={() => setFlip(-1)}
              >
                <span className="cgab-cube" aria-hidden>
                  <span className="cgab-f cgab-front">
                    <em style={FONT.M}>{pad2(i + 1)}</em>
                    <b style={FONT.D}>{title}</b>
                    <i />
                  </span>
                  <span className="cgab-f cgab-back">
                    <em style={FONT.M}>
                      {pad2(i + 1)} · {title}
                    </em>
                    <span>{body}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div ref={tlRef} className="cgab-tlh">
            <div>
              <Eyebrow text="The studio so far" on={tlOn} />
              <Heading text="Ten years of *shipping*" on={tlOn} delay={100} style={{ marginTop: 18 }} />
            </div>
            <p className="cgab-hint" style={{ ...FONT.M, ...rise(tlOn, 300) }}>
              Drag to explore
            </p>
          </div>
        </div>
        <div ref={stripRef} className="cgab-strip" tabIndex={0} role="region" aria-label="The studio so far">
          <ol className="cgab-tl">
            {TIMELINE.map(([year, title, body], i) => (
              <li className="cgab-yr" style={rise(tlOn, 150 + i * 80, 30)} key={year}>
                <b style={FONT.D}>{year}</b>
                <i aria-hidden />
                <strong>{title}</strong>
                <span>{body}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="cgab-w">
          <span className="cgab-prog" aria-hidden>
            <i style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
          </span>
        </div>
      </section>
    </div>
  );
}
