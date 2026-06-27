"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DATASET } from "../../lib/dataset";
import { scan } from "../../lib/scanner";
import {
  NATURE_QUESTIONS,
  PRACTICE_QUESTIONS,
  emptyProfile,
} from "../../lib/questions";
import type { BusinessProfile, Tri, Finding, GapReport } from "../../lib/types";

const COVERED = DATASET.filter((s) => s.code !== "FED").map((s) => ({
  code: s.code,
  state: s.state,
}));

type Step = 0 | 1 | 2 | 3; // states, nature, practices, results

/* --- small line icons (single stroke, no emoji) --- */
function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function InfoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}
function StatusIcon({ status, size = 13 }: { status: Finding["status"]; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (status === "likely_addressed") {
    return (<svg {...common}><path d="M20 6 9 17l-5-5" /></svg>);
  }
  if (status === "review") {
    return (<svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="2.5" /></svg>);
  }
  // potential_gap — outline triangle (caution, never a filled red alert)
  return (<svg {...common}><path d="M12 4 2.5 20h19L12 4Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>);
}

export default function ScanPage() {
  const [step, setStep] = useState<Step>(0);
  const [profile, setProfile] = useState<BusinessProfile>(emptyProfile());
  // Track which NATURE questions have an explicit answer (boolean alone can't distinguish
  // "answered No" from "untouched"), so we can force an answer before scoring.
  const [natureAnswered, setNatureAnswered] = useState<Record<string, boolean>>({});

  const report: GapReport | null = useMemo(
    () => (step === 3 ? scan(profile, DATASET) : null),
    [step, profile],
  );

  function toggleState(code: string) {
    setProfile((p) => {
      const has = p.statesServed.includes(code);
      return {
        ...p,
        statesServed: has
          ? p.statesServed.filter((c) => c !== code)
          : [...p.statesServed, code],
      };
    });
  }

  function setNature(key: keyof BusinessProfile, val: boolean) {
    setProfile((p) => ({ ...p, [key]: val }));
    setNatureAnswered((a) => ({ ...a, [key]: true }));
  }
  function setPractice(key: keyof BusinessProfile, val: Tri) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  const pct = [12, 40, 72, 100][step];
  const canAdvanceStates = profile.statesServed.length > 0;
  const allNatureAnswered = NATURE_QUESTIONS.every((q) => natureAnswered[q.key]);

  const reassure = (
    <p className="wizard__reassure">
      <LockIcon />
      Your answers stay in your browser. Nothing is sent to a server.
    </p>
  );

  return (
    <section className="section">
      <div className="wrap">
        {step < 3 && (
          <div className="wizard reveal">
            <div className="wizard__bar" aria-hidden="true">
              <span style={{ width: `${pct}%` }} />
            </div>
            <p className="wizard__step">Step {Math.min(step + 1, 4)} of 4</p>

            {step === 0 && (
              <div aria-labelledby="states-h">
                <h2 className="wizard__q" id="states-h">
                  Which states do you have customers in?
                </h2>
                <p className="small muted" style={{ marginTop: "-8px", marginBottom: 18 }}>
                  Pick the states where you sign up paying subscribers. We currently cover
                  these high-enforcement states. More are being added.
                </p>
                <div className="state-grid" role="group" aria-label="States served">
                  {COVERED.map((s) => {
                    const on = profile.statesServed.includes(s.code);
                    return (
                      <button
                        key={s.code}
                        type="button"
                        className="state-card"
                        aria-pressed={on}
                        onClick={() => toggleState(s.code)}
                        style={
                          on
                            ? {
                                textAlign: "left",
                                borderColor: "var(--brand)",
                                background: "#eef3fb",
                                boxShadow: "0 0 0 1px var(--brand) inset",
                              }
                            : { textAlign: "left" }
                        }
                      >
                        <span className="name">{s.state}</span>
                        <span className="code">{s.code}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="wizard__nav">
                  <Link href="/" className="btn btn-secondary">
                    Home
                  </Link>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!canAdvanceStates}
                    onClick={() => setStep(1)}
                  >
                    Next
                  </button>
                </div>
                {reassure}
              </div>
            )}

            {step === 1 && (
              <div aria-labelledby="nature-h">
                <p className="eyebrow" id="nature-h">How your subscription works</p>
                <p className="small muted" style={{ marginTop: 6, marginBottom: 4 }}>
                  These answers decide which rules apply to you.
                </p>
                {NATURE_QUESTIONS.map((q) => {
                  const val = profile[q.key] as boolean;
                  const answered = !!natureAnswered[q.key];
                  return (
                    <div key={q.key} style={{ marginTop: 26 }}>
                      <p className="wizard__q" style={{ margin: "0 0 6px" }}>{q.label}</p>
                      {q.help && (
                        <p className="small muted" style={{ marginBottom: 12 }}>{q.help}</p>
                      )}
                      <div
                        className="options"
                        role="group"
                        aria-label={q.label}
                        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
                      >
                        <button
                          type="button"
                          className={`option${answered && val === true ? " option--active" : ""}`}
                          aria-pressed={answered && val === true}
                          onClick={() => setNature(q.key, true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`option${answered && val === false ? " option--active" : ""}`}
                          aria-pressed={answered && val === false}
                          onClick={() => setNature(q.key, false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="wizard__nav">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(0)}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!allNatureAnswered}
                    onClick={() => setStep(2)}
                    title={allNatureAnswered ? "" : "Please answer each question"}
                  >
                    Next
                  </button>
                </div>
                {reassure}
              </div>
            )}

            {step === 2 && (
              <div aria-labelledby="practice-h">
                <p className="eyebrow" id="practice-h">What your flow already does</p>
                <p className="small muted" style={{ marginTop: 6, marginBottom: 4 }}>
                  Answer honestly. &ldquo;Not sure&rdquo; is a good answer. We flag it for
                  review rather than guess.
                </p>
                {PRACTICE_QUESTIONS.map((q) => {
                  const val = profile[q.key] as Tri;
                  return (
                    <div key={q.key} style={{ marginTop: 26 }}>
                      <p className="wizard__q" style={{ margin: "0 0 12px" }}>{q.label}</p>
                      <div
                        className="options"
                        role="group"
                        aria-label={q.label}
                        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                      >
                        <button
                          type="button"
                          className={`option${val === true ? " option--active" : ""}`}
                          aria-pressed={val === true}
                          onClick={() => setPractice(q.key, true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`option${val === false ? " option--active" : ""}`}
                          aria-pressed={val === false}
                          onClick={() => setPractice(q.key, false)}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className={`option${val === "unsure" ? " option--active" : ""}`}
                          aria-pressed={val === "unsure"}
                          onClick={() => setPractice(q.key, "unsure")}
                        >
                          Not sure
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="wizard__nav">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                    See my results
                  </button>
                </div>
                {reassure}
              </div>
            )}
          </div>
        )}

        {step === 3 && report && <Results report={report} onRestart={() => setStep(0)} />}
      </div>
    </section>
  );
}

function Results({ report, onRestart }: { report: GapReport; onRestart: () => void }) {
  const byState = useMemo(() => {
    const m = new Map<string, { name: string; findings: Finding[] }>();
    for (const f of report.findings) {
      const e = m.get(f.stateCode) ?? { name: f.stateName, findings: [] };
      e.findings.push(f);
      m.set(f.stateCode, e);
    }
    // gaps first within each state
    const order = { potential_gap: 0, review: 1, likely_addressed: 2, not_applicable: 3 } as const;
    for (const e of m.values()) {
      e.findings.sort((a, b) => order[a.status] - order[b.status]);
    }
    return [...m.entries()];
  }, [report]);

  const s = report.summary;
  const gapWord = s.potentialGaps === 1 ? "gap" : "gaps";
  const stateWord = s.statesWithPotentialGaps === 1 ? "state" : "states";

  // Cumulative index so the reveal staggers across every finding card in order.
  let running = 0;
  const blocks = byState.map(([code, e]) => {
    const base = running;
    running += e.findings.length;
    return { code, name: e.name, findings: e.findings, base };
  });

  return (
    <div aria-labelledby="results-h">
      <div className="scorecard reveal">
        <p className="eyebrow" id="results-h" style={{ display: "block", marginBottom: 12 }}>
          Your snapshot
        </p>
        <p className="scorecard__count">
          <b>{s.potentialGaps}</b> potential {gapWord} across <b>{s.statesWithPotentialGaps}</b> {stateWord}
        </p>
        <p className="small muted" style={{ marginTop: 8 }}>
          Based only on your answers across {report.statesEvaluated.length} state
          {report.statesEvaluated.length === 1 ? "" : "s"}. This is informational, not a
          legal conclusion.
        </p>
        <div className="scorecard__pills">
          <span className="pill pill--gap">
            <StatusIcon status="potential_gap" /> {s.potentialGaps} potential
          </span>
          <span className="pill pill--review">
            <StatusIcon status="review" /> {s.review} to review
          </span>
          <span className="pill pill--ok">
            <StatusIcon status="likely_addressed" /> {s.likelyAddressed} reported done
          </span>
        </div>
      </div>

      <div className="disclaimer-inset reveal" style={{ marginTop: 28 }}>
        <InfoIcon />
        <span>
          <strong>Read this first.</strong> {report.disclaimer}{" "}
          <Link href="/methodology" className="backlink">How this works</Link>.
        </span>
      </div>

      {report.statesNotCovered.length > 0 && (
        <p className="small muted" style={{ marginTop: 16 }}>
          Not yet in our dataset, so not evaluated: {report.statesNotCovered.join(", ")}.
        </p>
      )}

      {blocks.length === 0 && (
        <div className="card" style={{ marginTop: 28 }}>
          <p>
            There is nothing to evaluate from your answers. That usually means your
            business does not auto-renew, is not consumer-facing, or you did not select a
            covered state. If that is not right,{" "}
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={onRestart}>
              start over
            </button>
            .
          </p>
        </div>
      )}

      {blocks.map(({ code, name, findings, base }) => (
        <div className="state-block" key={code}>
          <div className="state-block__head">
            <h2 className="h3" style={{ margin: 0 }}>{name}</h2>
            <span className="mono small muted">{code}</span>
          </div>
          <div className="findings-list">
            {findings.map((f, i) => {
              const mod = statusMod(f.status);
              return (
                <div
                  className={`finding finding--${mod} reveal-row`}
                  key={`${code}-${f.category}-${i}`}
                  style={{ animationDelay: `${(base + i) * 60}ms` }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span className="mono small muted">{labelForCategory(f.category)}</span>
                    <span className={`pill pill--${mod}`}>
                      <StatusIcon status={f.status} /> {statusLabel(f.status)}
                    </span>
                  </div>
                  <p className="finding__req">{f.requirement_text}</p>
                  <p className="finding__why">{f.why}</p>
                  <div className="finding__cite">
                    <span className="cite">{f.statute_ref}</span>
                    <a className="cite" href={f.source_url} target="_blank" rel="noopener noreferrer">
                      Read the statute &rarr;
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="card card--float" style={{ marginTop: 40 }}>
        <h2 className="h3" style={{ margin: "0 0 0.5rem" }}>Found gaps you want fixed?</h2>
        <p style={{ marginBottom: "1.2rem" }}>
          Penguin Alley implements the technical changes you or your attorney specify. We
          do the signup, consent, and cancellation-flow engineering. We build to your spec.
          We do not give legal advice. Bring this snapshot to your counsel, then bring the
          requirements to us.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          <a
            href="https://penguinalley.com/en/services?ref=reclause-results#penny"
            className="btn btn-primary"
          >
            Talk to Penguin Alley
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
            Print this report
          </button>
          <button type="button" className="btn btn-ghost" onClick={onRestart}>
            Run it again
          </button>
        </div>
      </div>
    </div>
  );
}

function statusMod(s: Finding["status"]): "gap" | "ok" | "review" {
  if (s === "potential_gap") return "gap";
  if (s === "likely_addressed") return "ok";
  return "review";
}

function labelForCategory(c: Finding["category"]): string {
  const map: Record<Finding["category"], string> = {
    disclosure_before_purchase: "Disclosure before purchase",
    affirmative_consent: "Affirmative consent",
    acknowledgment_confirmation: "Acknowledgment / confirmation",
    cancellation_mechanism: "Cancellation mechanism",
    renewal_reminder_notice: "Renewal reminder",
    free_trial_conversion_notice: "Free-trial conversion notice",
    price_change_notice: "Price-change notice",
  };
  return map[c];
}

function statusLabel(s: Finding["status"]): string {
  const map: Record<Finding["status"], string> = {
    potential_gap: "Potential gap",
    likely_addressed: "You report doing this",
    review: "Worth review",
    not_applicable: "N/A",
  };
  return map[s];
}
