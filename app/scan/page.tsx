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

  return (
    <div className="scan-shell">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <p className="small muted" style={{ marginBottom: 4 }}>
          Step {Math.min(step + 1, 4)} of 4
        </p>
        <div className="progress" aria-hidden="true">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>

        {step === 0 && (
          <section aria-labelledby="states-h">
            <h2 id="states-h">Which states do you have customers in?</h2>
            <p className="muted">
              Pick the states where you sign up paying subscribers. We currently cover these
              high-enforcement states; more are being added.
            </p>
            <div className="state-grid" role="group" aria-label="States served">
              {COVERED.map((s) => {
                const on = profile.statesServed.includes(s.code);
                return (
                  <button
                    key={s.code}
                    type="button"
                    className="state-chip"
                    aria-pressed={on}
                    onClick={() => toggleState(s.code)}
                  >
                    {s.state}
                    <span className="code">{s.code}</span>
                  </button>
                );
              })}
            </div>
            <div className="wizard-nav">
              <Link href="/" className="btn btn-ghost">
                ← Home
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canAdvanceStates}
                onClick={() => setStep(1)}
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section aria-labelledby="nature-h">
            <h2 id="nature-h">How does your subscription work?</h2>
            <p className="muted">These answers decide which rules apply to you.</p>
            {NATURE_QUESTIONS.map((q) => {
              const val = profile[q.key] as boolean;
              const answered = !!natureAnswered[q.key];
              return (
                <div className="q-block" key={q.key}>
                  <div className="q-label">{q.label}</div>
                  {q.help && <div className="q-help">{q.help}</div>}
                  <div className="choices" role="group" aria-label={q.label}>
                    <button
                      type="button"
                      className="choice"
                      aria-pressed={answered && val === true}
                      onClick={() => setNature(q.key, true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="choice choice-no"
                      aria-pressed={answered && val === false}
                      onClick={() => setNature(q.key, false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="wizard-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!allNatureAnswered}
                onClick={() => setStep(2)}
                title={allNatureAnswered ? "" : "Please answer each question"}
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="practice-h">
            <h2 id="practice-h">What does your flow already do?</h2>
            <p className="muted">
              Answer honestly — “Not sure” is a perfectly good answer and we’ll flag it for review
              rather than guess.
            </p>
            {PRACTICE_QUESTIONS.map((q) => {
              const val = profile[q.key] as Tri;
              return (
                <div className="q-block" key={q.key}>
                  <div className="q-label">{q.label}</div>
                  <div className="choices" role="group" aria-label={q.label}>
                    <button
                      type="button"
                      className="choice"
                      aria-pressed={val === true}
                      onClick={() => setPractice(q.key, true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="choice choice-no"
                      aria-pressed={val === false}
                      onClick={() => setPractice(q.key, false)}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="choice choice-unsure"
                      aria-pressed={val === "unsure"}
                      onClick={() => setPractice(q.key, "unsure")}
                    >
                      Not sure
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="wizard-nav">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                See my results →
              </button>
            </div>
          </section>
        )}

        {step === 3 && report && <Results report={report} onRestart={() => setStep(0)} />}
      </div>
    </div>
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

  return (
    <section aria-labelledby="results-h">
      <div className="result-head">
        <h2 id="results-h">Your ARL Radar snapshot</h2>
        <p style={{ color: "#dbe2f0", marginBottom: 0 }}>
          Based only on your answers across {report.statesEvaluated.length} state
          {report.statesEvaluated.length === 1 ? "" : "s"}. This is informational, not a legal
          conclusion.
        </p>
        <div className="score-row">
          <div className="score-pill">
            <span className="n">{s.potentialGaps}</span>
            <span className="l">potential gaps</span>
          </div>
          <div className="score-pill">
            <span className="n">{s.review}</span>
            <span className="l">to review</span>
          </div>
          <div className="score-pill">
            <span className="n">{s.likelyAddressed}</span>
            <span className="l">self-reported as done</span>
          </div>
          <div className="score-pill">
            <span className="n">{s.statesWithPotentialGaps}</span>
            <span className="l">states with gaps</span>
          </div>
        </div>
      </div>

      <div className="callout" style={{ marginBottom: 24 }}>
        <strong>Read this first.</strong> {report.disclaimer}
      </div>

      {report.statesNotCovered.length > 0 && (
        <p className="small muted">
          Not yet in our dataset (so not evaluated): {report.statesNotCovered.join(", ")}.
        </p>
      )}

      {byState.length === 0 && (
        <div className="card">
          <p>
            Nothing to evaluate from your answers — most likely because your business doesn’t
            auto-renew, isn’t consumer-facing, or you didn’t select a covered state. If that’s
            wrong, <button className="linklike" onClick={onRestart}>start over</button>.
          </p>
        </div>
      )}

      {byState.map(([code, e]) => (
        <div className="state-block" key={code}>
          <h3>
            {e.name} <span className="muted small">({code})</span>
          </h3>
          {e.findings.map((f, i) => (
            <div className={`finding ${f.status}`} key={`${code}-${f.category}-${i}`}>
              <div className="finding-top">
                <span className="muted small">{labelForCategory(f.category)}</span>
                <span className={`status-tag ${f.status}`}>{statusLabel(f.status)}</span>
              </div>
              <p className="req">{f.requirement_text}</p>
              <p className="why">{f.why}</p>
              <span className="cite">
                {f.statute_ref} ·{" "}
                <a href={f.source_url} target="_blank" rel="noopener noreferrer">
                  source
                </a>
              </span>
            </div>
          ))}
        </div>
      ))}

      <div className="cta-band">
        <h2>Want help fixing your flow?</h2>
        <p>
          Penguin Alley offers a fixed-scope <strong>technical</strong> engagement: once you (or
          your attorney) decide what your flow needs, we implement it — the signup, consent, and
          cancellation-flow engineering. We build to your spec; we don’t give legal advice. Bring
          this snapshot to your counsel, then bring the requirements to us.
        </p>
        <div className="hero-actions">
          <a
            href="https://penguinalley.com/en/services?ref=arl-radar-results#penny"
            className="btn btn-primary"
          >
            Get a fixed-scope quote →
          </a>
          <button type="button" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }} onClick={onRestart}>
            Run it again
          </button>
        </div>
      </div>
    </section>
  );
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
