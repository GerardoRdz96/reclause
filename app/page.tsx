import Link from "next/link";
import { DATASET, COVERED_STATE_CODES } from "../lib/dataset";

export default function Home() {
  const stateCount = COVERED_STATE_CODES.length;
  const hasFederal = DATASET.some((s) => s.code === "FED");

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">
            <span aria-hidden="true">●</span> Free · educational · not legal advice
          </span>
          <h1>
            Where might your subscription flow
            <br />
            miss a US auto-renewal law?
          </h1>
          <p className="lead">
            Subscription auto-renewal (ARL / “negative-option”) rules are now a {stateCount}+ state
            patchwork, and enforcement is heating up. Answer a few questions about how you sign
            customers up and let them cancel — ARL Radar shows you, state by state, where your flow
            may have gaps and which statute addresses each one.
          </p>
          <div className="hero-actions">
            <Link href="/scan" className="btn btn-primary">
              Run the free scan →
            </Link>
            <Link href="/states" className="btn btn-ghost">
              Browse the state laws
            </Link>
          </div>
          <p className="small muted" style={{ marginTop: 18 }}>
            No signup. No account. Your answers stay in your browser — nothing is sent to a server.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            <div className="card">
              <div className="stat">{stateCount}+</div>
              <p className="muted small">
                US states with distinct auto-renewal / negative-option laws{" "}
                {hasFederal ? "covered here, plus the federal (FTC) picture" : "covered here"}, each
                with cited statute text.
              </p>
            </div>
            <div className="card">
              <div className="stat">$2,500</div>
              <p className="muted small">
                Per-violation penalties appear in several state ARL statutes, and recent
                negative-option enforcement has reached eight- and nine-figure settlements.
              </p>
            </div>
            <div className="card">
              <div className="stat">No federal floor</div>
              <p className="muted small">
                The FTC’s federal “click-to-cancel” rule was vacated in 2025, so states are setting
                the rules — and they don’t all agree.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <h2>How it works</h2>
          <div className="grid-3">
            <div className="card">
              <h3>1 · Tell us about your flow</h3>
              <p className="muted small">
                A short questionnaire: do you auto-renew, sign people up online, offer free trials,
                let them cancel online, send reminders. No documents, no ToS upload.
              </p>
            </div>
            <div className="card">
              <h3>2 · We map it to the law</h3>
              <p className="muted small">
                A deterministic engine — no guesswork, no AI deciding your compliance — matches your
                answers against an open, cited dataset of each state’s requirements.
              </p>
            </div>
            <div className="card">
              <h3>3 · You see the gaps</h3>
              <p className="muted small">
                A plain-English, state-by-state list of where your flow may not address a
                requirement, each linked to the statute. Educational only — bring it to your
                attorney.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="callout">
            <strong>Why “potential” and not “you’re compliant”?</strong> Because compliance turns on
            facts and judgment a questionnaire can’t capture — and because honest information, not a
            false guarantee, is what actually helps. ARL Radar never tells you that you are
            compliant or in violation. It shows you what the statutes address and where to look, so
            you can have an informed conversation with a qualified attorney.
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="cta-band">
            <h2>Found gaps you want fixed?</h2>
            <p>
              Penguin Alley offers a fixed-scope <strong>technical</strong> engagement: we implement
              the signup, disclosure, and cancellation-flow changes <em>you or your attorney</em>{" "}
              specify — the engineering and UX work, not the legal opinion. You bring the
              requirements; we make your site match them. The scan above is free forever; the build
              help is optional.
            </p>
            <div className="hero-actions">
              <a href="https://penguinalley.com/en/services?ref=arl-radar#penny" className="btn btn-primary">
                Talk to Penguin Alley →
              </a>
              <Link href="/about" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                How the scan is built
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
