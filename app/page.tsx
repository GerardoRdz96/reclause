import Link from "next/link";
import { DATASET, COVERED_STATE_CODES } from "../lib/dataset";

const SERVICE_CTA = "https://penguinalley.com/en/services?ref=reclause-home#penny";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export default function Home() {
  const stateCount = COVERED_STATE_CODES.length;
  const jurisdictionCount = DATASET.length;

  return (
    <>
      {/* 1. HERO — left-aligned copy, real product mock on the right */}
      <section className="section section--hero">
        <div className="wrap">
          <div className="hero">
            <div className="hero__copy">
              <span className="eyebrow">FREE TOOL · {jurisdictionCount} JURISDICTIONS · CITED STATUTES</span>
              <h1 className="display" style={{ marginTop: 14 }}>
                Where might your subscription flow miss a US auto-renewal law?
              </h1>
              <p className="lead" style={{ marginTop: 20 }}>
                Check how your signup and cancellation flows line up with each state&apos;s
                auto-renewal rules. See the exact statute behind every flag. No account, no data
                leaves your browser.
              </p>
              <div className="hero__cta">
                <Link href="/scan" className="btn btn-primary btn-lg">
                  Run the free scan →
                </Link>
                <Link href="/states" className="btn btn-secondary btn-lg">
                  Browse the state laws
                </Link>
              </div>
              <span className="hero__reassure">
                <LockIcon /> No signup. Your answers stay in your browser.
              </span>
            </div>

            {/* Real product mock — static styled markup, not an image */}
            <div className="product-frame" aria-hidden="true">
              <div className="scorecard" style={{ textAlign: "left", padding: "6px 6px 2px" }}>
                <div className="scorecard__count" style={{ fontSize: "1.5rem" }}>
                  <b>2</b> potential gaps across <b>{stateCount}</b> states
                </div>
                <div className="scorecard__pills" style={{ justifyContent: "flex-start", marginTop: 12 }}>
                  <span className="pill pill--gap">2 potential gaps</span>
                  <span className="pill pill--review">3 worth review</span>
                  <span className="pill pill--ok">8 likely addressed</span>
                </div>
              </div>

              <div className="findings-list" style={{ marginTop: 16 }}>
                <div className="finding finding--gap">
                  <span className="pill pill--gap">Potential gap</span>
                  <p className="finding__req">
                    Let customers cancel online if they signed up online.
                  </p>
                  <p className="finding__why">
                    You said you do not offer online cancellation. Worth a look against the text below.
                  </p>
                  <div className="finding__cite">
                    <span className="cite">Cal. Bus. &amp; Prof. Code § 17602</span>
                    <span className="mono small muted">CA</span>
                  </div>
                </div>

                <div className="finding finding--ok">
                  <span className="pill pill--ok">Likely addressed</span>
                  <p className="finding__req">
                    Show clear auto-renewal terms before the charge.
                  </p>
                  <p className="finding__why">
                    You said you disclose renewal terms before purchase.
                  </p>
                  <div className="finding__cite">
                    <span className="cite">N.Y. Gen. Bus. Law § 527-a</span>
                    <span className="mono small muted">NY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BELT */}
      <section className="band section section--tight">
        <div className="wrap">
          <div className="trust-belt">
            <div>
              <div className="trust-stat__num">{jurisdictionCount}</div>
              <div className="trust-stat__label">jurisdictions</div>
            </div>
            <div>
              <div className="trust-stat__num">73</div>
              <div className="trust-stat__label">cited requirements</div>
            </div>
            <div>
              <div className="trust-stat__num">0</div>
              <div className="trust-stat__label">data sent to a server</div>
            </div>
            <div>
              <div className="trust-stat__num">MIT</div>
              <div className="trust-stat__label">open dataset</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS — asymmetric numbered flow */}
      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: "44rem" }}>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2 style={{ marginTop: 10 }}>Three steps, about two minutes, nothing to upload.</h2>
          </div>
          <div className="steps" style={{ marginTop: 36 }}>
            <div className="step">
              <span className="step__num">01</span>
              <h3>Describe your flow</h3>
              <p className="small muted">
                A short questionnaire about how you sign customers up and how they cancel. No
                documents, no terms-of-service upload.
              </p>
            </div>
            <div className="step">
              <span className="step__num">02</span>
              <h3>We map it to each state&apos;s rules</h3>
              <p className="small muted">
                A deterministic engine matches your answers against an open, cited dataset of each
                state&apos;s auto-renewal requirements. No AI decides anything.
              </p>
            </div>
            <div className="step">
              <span className="step__num">03</span>
              <h3>See gaps and the statute behind each</h3>
              <p className="small muted">
                A plain-English, state-by-state list of where your flow may not address a
                requirement, each linked to the statute itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EDUCATIONAL STAT CARDS — context, calm */}
      <section className="band section section--tight">
        <div className="wrap">
          <div style={{ maxWidth: "44rem" }}>
            <span className="eyebrow">CONTEXT</span>
            <h2 style={{ marginTop: 10 }}>Why this patchwork is worth understanding.</h2>
            <p className="small muted" style={{ marginTop: 8 }}>
              Background, not a warning. The point is clarity, not pressure.
            </p>
          </div>
          <div className="stat-cards" style={{ marginTop: 32 }}>
            <div className="stat-card">
              <div className="big mono">$2,500</div>
              <p className="small muted" style={{ marginTop: 8 }}>
                Per-violation penalties appear in several state auto-renewal statutes, and recent
                enforcement has reached large settlements.
              </p>
            </div>
            <div className="stat-card">
              <div className="big">No federal floor</div>
              <p className="small muted" style={{ marginTop: 8 }}>
                The FTC&apos;s federal click-to-cancel rule was vacated in 2025, so states are
                setting the rules and they do not all agree.
              </p>
            </div>
            <div className="stat-card">
              <div className="big mono">30+ states</div>
              <p className="small muted" style={{ marginTop: 8 }}>
                Distinct auto-renewal and negative-option laws now exist across more than thirty
                states, each with its own specifics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="section">
        <div className="wrap">
          <h2 style={{ textAlign: "center", marginBottom: 28 }}>Questions, answered plainly</h2>
          <div className="faq">
            <details>
              <summary>Do you store my data?</summary>
              <p>
                No. The scan runs entirely in your browser. Your answers are not sent to a server
                and nothing is saved on our end.
              </p>
            </details>
            <details>
              <summary>Do I need an account?</summary>
              <p>No. There is no signup and no email wall. You can run the scan and read your results without giving us anything.</p>
            </details>
            <details>
              <summary>Is this legal advice?</summary>
              <p>
                No. This is an educational tool. It compares the flow you describe against published
                statutes and cites each one, so you can have an informed conversation with a
                qualified attorney. It does not tell you whether you are compliant.
              </p>
            </details>
            <details>
              <summary>How current is the data?</summary>
              <p>
                The dataset is research-grade and last reviewed in June 2026. Every requirement is
                cited to its statute, and the data is open under an MIT license so you can check it
                yourself.
              </p>
            </details>
          </div>

          <div className="disclaimer-inset" style={{ maxWidth: "var(--maxw-prose)", margin: "32px auto 0" }}>
            <InfoIcon />
            <p style={{ margin: 0 }}>
              <strong>This is an educational tool, not legal advice.</strong> It compares the flow
              you describe against published statutes to surface areas worth a closer look. For
              decisions, talk to a lawyer.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BAND */}
      <section className="section band-dark">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: 12 }}>Start with the free scan. See where to look.</h2>
          <p style={{ maxWidth: "46rem", margin: "0 auto 24px" }}>
            Map your signup and cancellation flows against {jurisdictionCount} jurisdictions in about two
            minutes. If you find gaps you want fixed, Penguin Alley can implement the technical
            changes you or your attorney specify.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center" }}>
            <Link href="/scan" className="btn btn-warm btn-lg">
              Run the free scan →
            </Link>
            <a href={SERVICE_CTA} className="btn btn-ghost btn-lg" style={{ color: "#cdd8ea" }}>
              How Penguin Alley can help
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
