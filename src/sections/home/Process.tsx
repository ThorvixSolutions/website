"use client";

import { useRef, useState } from "react";
import { useMounted, useReducedMotion, useReveal, useScrollProgress, useWidth } from "@/lib/hooks";
import { easeInOutCubic } from "@/lib/scroll";
import { FONT, clamp01, cx, pad2, plain, rise } from "@/lib/text";
import { Eyebrow, Heading } from "@/ui";

const HEADING = "Bottleneck to *breakthrough.*";
// PENDING (PENDING_FEATURES.md): the board intro and the 8-week timeline are not on thorvix.com
// const INTRO = "Every project runs on the same board you can see: one ticket for your product, moving a column every sprint.";
const WEEKS = 8;
const TICKET = "Your bottleneck";
const TICKET_META = "Roadmap · v1.0";

const COLUMNS = [
  {
    name: "Discovery & Strategy",
    when: "Step 1",
    desc: "We map every bottleneck and architect a custom technical roadmap. We analyze your operations, identify automation opportunities, and scope exact resources needed.",
    tickets: ["Bottleneck mapping", "Technical roadmap", "Resource scoping"],
  },
  {
    name: "Deploy Team or Solution",
    when: "Step 2",
    desc: "Whether deploying a RAG-based AI agent or embedding a React/Node team into your Slack, we integrate into your existing systems with zero operational disruption.",
    tickets: ["RAG-based AI agent", "Embedded React/Node team", "Zero-disruption integration"],
  },
  {
    name: "Scale & Optimize",
    when: "Step 3",
    desc: "We don’t just hand over code. We monitor AI performance, maintain system health, and scale the solution continuously as your traffic and demands evolve.",
    tickets: ["AI performance monitoring", "System health", "Continuous scaling"],
  },
];
// PENDING (PENDING_FEATURES.md): the template's four week-based columns
// const COLUMNS = [
//   {
//     name: "Discover",
//     when: "Week 1–2",
//     desc: "We meet your users, map the goals and cut the idea down to the one flow that proves it.",
//     tickets: ["Kickoff workshop", "User interviews", "Scope and fixed quote"],
//   },
//   {
//     name: "Design",
//     when: "Week 2–3",
//     desc: "Flows, wireframes and high-fidelity screens you click through on your own phone.",
//     tickets: ["User flows", "Clickable prototype", "Design system"],
//   },
//   {
//     name: "Build",
//     when: "Week 3–7",
//     desc: "Two-week sprints with a demo of working software at the end of each one.",
//     tickets: ["Sprint 1 · core flow", "Sprint 2 · payments", "QA and code review"],
//   },
//   {
//     name: "Ship",
//     when: "Week 8",
//     desc: "Launch to the stores and the web, with monitoring on and our team on call.",
//     tickets: ["Store submission", "Launch checklist", "Monitoring and support"],
//   },
// ];
const N = COLUMNS.length;

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.05);
  const stack = w < 810 || reduced;
  const [col, setCol] = useState(stack ? N - 1 : 0);
  const [week, setWeek] = useState(stack ? WEEKS : 1);

  // the ticket rests in a column, then tilts and slides to the next one
  useScrollProgress(ref, mounted, reduced || stack, (_, pp) => {
    const el = ref.current;
    if (!el) return;
    const pos = clamp01((pp - 0.06) / 0.86) * (N - 1);
    const base = Math.min(N - 2, Math.floor(pos));
    const frac = pos - base;
    const move = easeInOutCubic(clamp01((frac - 0.3) / 0.4));
    const t = N < 2 ? 0 : Math.min(N - 1, base + move);
    const tilt = Math.sin(Math.PI * clamp01((frac - 0.3) / 0.4)) * (frac < 1 ? 5 : 0);
    el.style.setProperty("--t", t.toFixed(4));
    el.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
    el.style.setProperty("--prog", (t / Math.max(1, N - 1)).toFixed(4));
    const c = Math.round(t);
    setCol((v) => (v === c ? v : c));
    const wk = 1 + Math.round((t / Math.max(1, N - 1)) * (WEEKS - 1));
    setWeek((v) => (v === wk ? v : wk));
  });

  const ticket = (
    <div className="cgps-tk is-lift">
      <span className="cgps-tk-top" style={FONT.M}>
        <i />
        CF-{String(100 + week * 7).padStart(3, "0")}
        <em>{String(COLUMNS[col]?.name || "").toUpperCase()}</em>
      </span>
      <b style={FONT.D}>{TICKET}</b>
      <span className="cgps-tk-bot" style={FONT.M}>
        {TICKET_META}
        <span className="cgps-av" />
      </span>
    </div>
  );

  return (
    <div ref={ref} className={cx("cg cgps", stack && "is-stack", on && "is-on", w < 1100 && "is-tab")} style={{ ...FONT.B, ["--n" as string]: N }}>
      <section className="cgps-stage" aria-label={plain(HEADING)}>
        <div className="cg-wrap">
          <div className="cgps-head">
            <div>
              <Eyebrow text="Process" on={on} />
              <Heading text={HEADING} on={on} delay={80} style={{ marginTop: 16 }} />
              {/* PENDING (PENDING_FEATURES.md): board intro copy
              <p className="cgps-intro" style={rise(on, 260)}>
                {INTRO}
              </p>
              */}
            </div>
            {/* PENDING (PENDING_FEATURES.md): week counter, thorvix.com gives no timeline
            {!stack && (
              <div className="cgps-week" style={rise(on, 360)} aria-live="polite">
                <span style={FONT.M}>Week</span>
                <b style={FONT.D}>{pad2(week)}</b>
                <span style={FONT.M}>/ {pad2(WEEKS)}</span>
                <div className="cgps-rail" aria-hidden>
                  {Array.from({ length: WEEKS }, (_, i) => (
                    <i key={i} className={i < week ? "is-on" : ""} />
                  ))}
                </div>
              </div>
            )}
            */}
          </div>
          {stack ? (
            <ol className="cgps-steps">
              {COLUMNS.map((c, i) => (
                <li className="cgps-step" style={rise(on, 200 + i * 90)} key={c.name}>
                  <span className="cgps-sico" aria-hidden>
                    <i />
                  </span>
                  <div>
                    <p className="cgps-sh" style={FONT.M}>
                      <b>{pad2(i + 1)}</b> {c.when}
                    </p>
                    <h3 style={FONT.D}>{c.name}</h3>
                    <p className="cgps-sd">{c.desc}</p>
                    <ul className="cgps-sl">
                      {c.tickets.map((t) => (
                        <li style={FONT.M} key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="cgps-board" role="list">
              {COLUMNS.map((c, i) => (
                <div role="listitem" className={cx("cgps-col", i === col && "is-cur", i < col && "is-done")} style={rise(on, 300 + i * 90, 30)} key={c.name}>
                  <div className="cgps-ch" style={FONT.M}>
                    <span>
                      <b>{pad2(i + 1)}</b>
                      {c.name}
                    </span>
                    <em>{c.when}</em>
                  </div>
                  <div className="cgps-slot" aria-hidden />
                  <p className="cgps-desc">{c.desc}</p>
                  {c.tickets.map((t, r) => (
                    <div className="cgps-card" key={t}>
                      <span style={FONT.M}>{`${c.name.slice(0, 2).toUpperCase()}-${i + 1}${r + 1}`}</span>
                      <b>{t}</b>
                      <i className={`cgps-dot d${(i + r) % 3}`} />
                    </div>
                  ))}
                </div>
              ))}
              <div className="cgps-trav">{ticket}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
