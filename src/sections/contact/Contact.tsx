"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { services, site } from "@/data/cms";
import { useClock, useMagnetic, useMounted, useReducedMotion, useReleased, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, rise, splitList, splitPairs } from "@/lib/text";
import { ArrowUpRight, Eyebrow, Heading } from "@/ui";

const S = site[0];
const EMAIL = S.f4 || "hello@thorvix.com";
// Web3Forms access keys are public by design: they only allow sending to the inbox they are tied to
const WEB3FORMS_KEY = "52e36329-a0fc-4fcc-91ca-a9a5bc2bbbbd";
const BUILD = services.map((s) => s.f1);
// PENDING (PENDING_FEATURES.md): thorvix.com's booking form has no budget or timeline fields
const BUDGET = splitList("<$25k;$25–60k;$60–120k;$120k+");
const TIMELINE = splitList("As soon as possible;In the next month;In 1–3 months;Just exploring");
const NEXT = splitPairs(
  "One call|No commitment, 30 minutes, and we come prepared.;A custom roadmap|We map every bottleneck and scope the exact resources needed.;Results in weeks|From strategy session to production deployment in weeks, not quarters.",
);
// ?service= slugs → the "Primary interest" chip they preselect
const SERVICE_CHIP: Record<string, string> = Object.fromEntries(services.map((s) => [s.slug, s.f1]));

type Form = { name: string; email: string; company: string; build: string[]; budget: string; timeline: string; msg: string };

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const released = useReleased(mounted);
  const { w } = useWidth(ref);
  const time = useClock(mounted, S.f7);
  const [entered, setEntered] = useState(false);
  const [form, setForm] = useState<Form>({ name: "", email: "", company: "", build: [], budget: "", timeline: "", msg: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setError("Name and a valid email are required.");
      return;
    }
    setError("");
    // honeypot: real visitors never see or fill this field, so a value means a bot. Pretend it worked.
    if (new FormData(e.currentTarget).get("botcheck")) {
      setSent(true);
      return;
    }
    const subject = `New booking request from ${form.name.trim()}${form.company ? " — " + form.company : ""}`;
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: "Thorvix Website",
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          interest: form.build.join(", "),
          message: form.msg.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || `Web3Forms request failed (${res.status})`);
      setSent(true);
    } catch {
      setError(`Could not send your request. Please email ${EMAIL} instead.`);
    } finally {
      setSending(false);
    }
    // The template's mailto: delivery, replaced by Web3Forms
    // const body = [
    //   `Name: ${form.name}`,
    //   `Email: ${form.email}`,
    //   form.company && `Company: ${form.company}`,
    //   form.build.length && `Building: ${form.build.join(", ")}`,
    //   form.budget && `Budget: ${form.budget}`,
    //   form.timeline && `Timeline: ${form.timeline}`,
    //   "",
    //   form.msg,
    // ]
    //   .filter((x) => typeof x === "string")
    //   .join("\n");
    // setSent(true);
    // try {
    //   window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // } catch {}
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
          text="Book a strategy *call*"
          on={on}
          tag="h1"
          size={phone ? "clamp(40px,11.5vw,58px)" : "clamp(52px,6.6vw,112px)"}
          lh={0.92}
          delay={120}
          style={{ marginTop: 22 }}
        />
        <p className="cgct-intro" style={rise(on, 380)}>
          Let&apos;s discuss how we can break your bottlenecks. No commitment, 30 minutes, fully prepared.
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
                <b style={FONT.D}>Thanks — your request is in.</b>
                <p>We will be in touch to schedule your call. You can also write to us directly.</p>
                <a href={`mailto:${EMAIL}`} style={FONT.M}>
                  {EMAIL}
                </a>
                <button type="button" style={FONT.M} onClick={() => setSent(false)}>
                  Edit and send again
                </button>
              </div>
            ) : (
              <form className="cgct-form" onSubmit={submit} noValidate>
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />
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
                {chips(BUILD, "build", true, "Primary interest")}
                {/* PENDING (PENDING_FEATURES.md): budget and timeline fields
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
                */}
                <label className="cgct-f">
                  <span style={FONT.M}>Message (optional)</span>
                  <textarea rows={5} value={form.msg} placeholder="Tell us about your challenge..." onChange={(e) => set("msg", e.target.value)} />
                </label>
                <div className="cgct-send">
                  <button type="submit" className="cg-btn cg-solid" data-mag="true" disabled={sending} aria-busy={sending}>
                    <span className="cg-cap">
                      <span className="cg-lbl">
                        <span className="cg-l1">{sending ? "Sending…" : "Book call"}</span>
                        <span className="cg-l2" aria-hidden>
                          Book call
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
            {/^https?:/.test(S.f8) && (
              <div className="cgct-blk">
                <span style={FONT.M}>Book directly</span>
                <a href={S.f8} target="_blank" rel="noopener noreferrer">
                  Pick a slot on our calendar ↗
                </a>
              </div>
            )}
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
