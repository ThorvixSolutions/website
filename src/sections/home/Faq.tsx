"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { faq } from "@/data/cms";
import { useMagnetic, useMounted, useReducedMotion, useReveal, useWidth } from "@/lib/hooks";
import { FONT, cx, pad2, plain, rise } from "@/lib/text";
import { Button, Eyebrow, Heading } from "@/ui";

const HEADING = "Questions, *answered*";
const COMMAND = "Thorvix faq --q";
const HELP = "Still stuck? Ask a real engineer.";

/** Types `text` three characters per tick whenever `key` changes; `skip` shows it all. */
function useTyped(text: string, key: string, active: boolean) {
  const [typed, setTyped] = useState({ key: "", n: 0 });
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + 3);
      // a skip already showed everything; don't rewind it
      setTyped((t) => (t.key === key && t.n >= text.length ? t : { key, n: i }));
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [key, active, text]);
  const n = !active ? text.length : typed.key === key ? typed.n : 0;
  return { shown: text.slice(0, n), done: n >= text.length, skip: () => setTyped({ key, n: text.length }) };
}

/** `page` picks the questions tagged for that page in the CMS. */
export function Faq({ page = "home" }: { page?: string }) {
  const ref = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const { w } = useWidth(ref);
  const on = useReveal(ref, mounted, reduced, 0.12);
  const phone = w < 810;
  const tablet = w >= 810 && w < 1100;
  useMagnetic(ref, mounted);

  const tag = page.trim().toLowerCase();
  const items = faq.filter((q) => !tag || String(q.f3 || "").toLowerCase().split(/[,;\s]+/).includes(tag)).filter((q) => q.f1);

  const [cur, setCur] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [open, setOpen] = useState(0);
  const q = items[Math.min(cur, Math.max(0, items.length - 1))] || items[0];
  const live = mounted && on && !reduced;
  const term = useTyped(String(q?.f2 || ""), `${cur}`, live);
  const mini = useTyped(String(items[open]?.f2 || ""), `p${open}`, live && phone);

  const pick = (i: number) => {
    if (i === cur) return;
    setHistory((h) => [...h.filter((x) => x !== cur), cur].slice(-2));
    setCur(i);
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    ref.current?.querySelectorAll<HTMLElement>(".cgfq-q")[next]?.focus();
    pick(next);
  };

  return (
    <section ref={ref} className={cx("cg cg-dark cgfq", phone ? "is-ph" : tablet && "is-tab", on && "is-on")} style={FONT.B} aria-label={plain(HEADING)}>
      <dl className="cg-sr">
        {items.map((it) => (
          <div key={it.slug}>
            <dt>{it.f1}</dt>
            <dd>{it.f2}</dd>
          </div>
        ))}
      </dl>
      <div className="cg-wrap">
        <div className="cgfq-head">
          <div>
            <Eyebrow text="FAQ" on={on} />
            <Heading text={HEADING} on={on} delay={100} style={{ marginTop: 22 }} />
          </div>
          <p className="cgfq-body" style={rise(on, 350)}>
            Pick a question. The answer runs in the terminal, like everything else we ship.
          </p>
        </div>
        {phone ? (
          <ol className="cgfq-acc">
            {items.map((it, i) => (
              <li className={i === open ? "is-open" : ""} key={it.slug}>
                <button type="button" className="cgfq-q" aria-expanded={i === open} onClick={() => setOpen(i === open ? -1 : i)}>
                  <span className="cgfq-n" style={FONT.M}>
                    {pad2(i + 1)}
                  </span>
                  <span className="cgfq-qt">{it.f1}</span>
                  <span className="cgfq-pl" aria-hidden />
                </button>
                <div className="cgfq-pn" aria-hidden>
                  <div className="cgfq-pi">
                    <div className="cgfq-mini" style={FONT.M} onClick={() => mini.skip()}>
                      <p className="cgfq-cmd">
                        <b>$</b> {COMMAND} {pad2(i + 1)}
                      </p>
                      <p className="cgfq-ans" style={FONT.B}>
                        {i === open ? mini.shown : it.f2}
                        {i === open && <span className="cgfq-caret" />}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <li className="cgfq-phfoot">
              <span style={FONT.M}>{HELP}</span>
              <Button href="/contact" label="Ask a question" kind="quiet" />
            </li>
          </ol>
        ) : (
          <div className="cgfq-grid">
            <ol className="cgfq-list" aria-hidden={false}>
              {items.map((it, i) => (
                <li style={rise(on, 250 + i * 70, 18)} key={it.slug}>
                  <button type="button" className={cx("cgfq-q", i === cur && "is-act")} aria-pressed={i === cur} onClick={() => pick(i)} onKeyDown={(e) => onKey(e, i)}>
                    <span className="cgfq-n" style={FONT.M}>
                      {pad2(i + 1)}
                    </span>
                    <span className="cgfq-qt">{it.f1}</span>
                    <span className="cgfq-ar" aria-hidden>
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="cgfq-term" style={rise(on, 400, 30)} aria-hidden onClick={() => term.skip()}>
              <div className="cgfq-bar" style={FONT.M}>
                <i />
                <i />
                <i />
                <span>Thorvix — zsh</span>
                {!term.done && <em>click to skip</em>}
              </div>
              <div className="cgfq-scr" style={FONT.M}>
                {history
                  .filter((h) => h !== cur && items[h])
                  .map((h) => (
                    <div className="cgfq-old" key={`h${h}`}>
                      <p>
                        <b>$</b> {COMMAND} {pad2(h + 1)}
                      </p>
                      <p className="cgfq-ok">✓ {items[h].f1}</p>
                    </div>
                  ))}
                <p className="cgfq-cmd">
                  <b>$</b> {COMMAND} {pad2(cur + 1)}
                </p>
                <p className="cgfq-qline">› {q?.f1}</p>
                <p className="cgfq-ans" style={FONT.B}>
                  {term.shown}
                  <span className="cgfq-caret" />
                </p>
              </div>
              <div className="cgfq-foot">
                <span style={FONT.M}>{HELP}</span>
                <Button href="/contact" label="Ask a question" kind="quiet" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
