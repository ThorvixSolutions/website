"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { site } from "@/data/cms";
import { useClock, useMagnetic, useMounted, useReducedMotion, useReleased, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, rise, splitList, splitPairs } from "@/lib/text";
import { ArrowUpRight, Eyebrow, Heading } from "@/ui";

const S = site[0];
const EMAIL = S.f4 || "hello@Forrentech.dev";
const BUILD = splitList("Web app;Mobile app;AI feature;Design;Team");
const BUDGET = splitList("<$25k;$25–60k;$60–120k;$120k+");
const TIMELINE = splitList("As soon as possible;In the next month;In 1–3 months;Just exploring");
const NEXT = splitPairs(
  "We reply within one business day|A senior engineer reads your brief and asks the questions that matter.;A free 30-minute scoping call|We talk through the product, the risks and what to build first.;A fixed quote for the first release|Scope, timeline and price in writing, usually within three days.",
);
// ?service= slugs → the "What are you building?" chip they preselect
const SERVICE_CHIP: Record<string, string> = {
  "web-apps": "Web app",
  "mobile-apps": "Mobile app",
  "ai-features": "AI feature",
  "product-design": "Design",
  "dedicated-teams": "Team",
  "cloud-devops": "Team",
};

type Form = { name: string; email: string; company: string; build: string[]; budget: string; timeline: string; msg: string };

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const time = useClock(mounted, S.f7);
  const [entered, setEntered] = useState(false);
  const [form, setForm] = useState<Form>({ name: "", email: "", company: "", build: [], budget: "", timeline: TIMELINE[0] || "", msg: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  useMagnetic(ref, mounted);

  useEffect(() => {
    if (!mounted || !released) return;
    const t = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(t);
  }, [mounted, released]);

  // prefill from links elsewhere on the site (CTA email, pricing plan, service pages)
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const patch: Partial<Form> = {};
      const email = q.get("email");
      if (email) patch.email = email;
      const service = q.get("service");
      const plan = q.get("plan");
      const engineers = q.get("engineers");
      const designer = q.get("designer");
      const build: string[] = [];
      if (service && SERVICE_CHIP[service] && BUILD.includes(SERVICE_CHIP[service])) build.push(SERVICE_CHIP[service]);
      if (plan && /team/i.test(plan) && BUILD.includes("Team")) build.push("Team");
      if (build.length) patch.build = Array.from(new Set(build));
      const notes: string[] = [];
      if (plan) notes.push(`Plan: ${plan.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
      if (engineers) notes.push(`${engineers} engineer${engineers === "1" ? "" : "s"}`);
      if (designer === "yes") notes.push("with a designer");
      if (service) notes.push(`Service: ${service.replace(/-/g, " ")}`);
      if (notes.length) patch.msg = notes.join(", ") + ".\n\n";
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
      if (Object.keys(patch).length) setForm((f) => ({ ...f, ...patch }));
    } catch {}
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setError("Name and a valid email are required.");
      return;
    }
    setError("");
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company && `Company: ${form.company}`,
      form.build.length && `Building: ${form.build.join(", ")}`,
      form.budget && `Budget: ${form.budget}`,
      form.timeline && `Timeline: ${form.timeline}`,
      "",
      form.msg,
    ]
      .filter((x) => typeof x === "string")
      .join("\n");
    const subject = `New project${form.company ? " — " + form.company : ""}`;
    setSent(true);
    try {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch {}
  };

  const chips = (options: string[], key: "build" | "budget", multi: boolean, legend: string) => (
    <fieldset className="cgct-chips">
      <legend style={FONT.M}>{legend}</legend>
      <div>
        {options.map((o) => {
          const value = form[key];
          const active = multi ? (value as string[]).includes(o) : value === o;
          return (
            <button
              type="button"
              key={o}
              aria-pressed={active}
              className={active ? "is-on" : ""}
              onClick={() =>
                multi ? set("build", active ? form.build.filter((x) => x !== o) : [...form.build, o]) : set("budget", active ? "" : o)
              }
              style={FONT.M}
            >
              <i aria-hidden />
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  const on = entered || reduced;
  const phone = w < 810;
  return (
    <section ref={ref} className={cx("cg cg-dark cgct", phone ? "is-ph" : w < 1100 && "is-tab", on && "is-in")} data-cg-w={w} style={FONT.B} aria-label="Contact">
      <div className="cgct-w">
        <Eyebrow text="Contact" on={on} />
        <Heading
          text="Start a *project*"
          on={on}
          tag="h1"
          size={phone ? "clamp(40px,11.5vw,58px)" : "clamp(52px,6.6vw,112px)"}
          lh={0.92}
          delay={120}
          style={{ marginTop: 22 }}
        />
        <p className="cgct-intro" style={rise(on, 380)}>
          Tell us what you are building. A senior engineer reads every message and replies within one business day.
        </p>
        <div className="cgct-grid">
          <div className="cgct-formw" style={rise(on, 480, 30)}>
            {sent ? (
              <div className="cgct-done" role="status">
                <span className="cgct-ok" aria-hidden>
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} style={{ animationDelay: `${i * 60}ms` }} />
                  ))}
                </span>
                <b style={FONT.D}>Thanks — your email app is opening.</b>
                <p>If nothing opened, write to us directly and paste your brief. We reply within one business day.</p>
                <a href={`mailto:${EMAIL}`} style={FONT.M}>
                  {EMAIL}
                </a>
                <button type="button" style={FONT.M} onClick={() => setSent(false)}>
                  Edit and send again
                </button>
              </div>
            ) : (
              <form className="cgct-form" onSubmit={submit} noValidate>
                <div className="cgct-row">
                  <label className="cgct-f">
                    <span style={FONT.M}>Your name *</span>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required />
                  </label>
                  <label className="cgct-f">
                    <span style={FONT.M}>Work email *</span>
                    <input type="email" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" required />
                  </label>
                </div>
                <label className="cgct-f">
                  <span style={FONT.M}>Company</span>
                  <input value={form.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
                </label>
                {chips(BUILD, "build", true, "What are you building?")}
                {chips(BUDGET, "budget", false, "Budget")}
                <label className="cgct-f cgct-sel">
                  <span style={FONT.M}>Timeline</span>
                  <select value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                    {TIMELINE.map((t) => (
                      <option value={t} key={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <i aria-hidden />
                </label>
                <label className="cgct-f">
                  <span style={FONT.M}>Tell us about the project</span>
                  <textarea rows={5} value={form.msg} placeholder="What it does, who it is for, and what already exists." onChange={(e) => set("msg", e.target.value)} />
                </label>
                <div className="cgct-send">
                  <button type="submit" className="cg-btn cg-solid" data-mag="true">
                    <span className="cg-cap">
                      <span className="cg-lbl">
                        <span className="cg-l1">Send the brief</span>
                        <span className="cg-l2" aria-hidden>
                          Send the brief
                        </span>
                      </span>
                      <span className="cg-arr" aria-hidden>
                        <ArrowUpRight />
                      </span>
                    </span>
                  </button>
                  <p className="cgct-err" role="alert" style={FONT.M}>
                    {error}
                  </p>
                </div>
              </form>
            )}
          </div>
          <aside className="cgct-side" style={rise(on, 600, 30)}>
            <div className="cgct-blk">
              <span style={FONT.M}>Write directly</span>
              <a className="cgct-mail" href={`mailto:${EMAIL}`} style={FONT.D}>
                {EMAIL}
              </a>
            </div>
            <div className="cgct-two">
              {S.f5 && (
                <div className="cgct-blk">
                  <span style={FONT.M}>Call</span>
                  <a href={`tel:${S.f5.replace(/[^\d+]/g, "")}`}>{S.f5}</a>
                </div>
              )}
              <div className="cgct-blk">
                <span style={FONT.M}>Local time</span>
                <b style={FONT.D} className="cgct-clock">
                  {time || "--:--"}
                </b>
                <em style={FONT.M}>{S.f6}</em>
              </div>
              {S.f11 && (
                <div className="cgct-blk">
                  <span style={FONT.M}>Visit</span>
                  <p>{S.f11}</p>
                </div>
              )}
              {S.f12 && (
                <div className="cgct-blk">
                  <span style={FONT.M}>Hours</span>
                  <p>{S.f12}</p>
                </div>
              )}
            </div>
            <div className="cgct-next">
              <span style={FONT.M}>What happens next</span>
              <ol>
                {NEXT.map((n, i) => (
                  <li key={n.a}>
                    <em style={FONT.M}>{pad2(i + 1)}</em>
                    <b>{n.a}</b>
                    <p>{n.b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
