import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Reclause is an educational tool, not legal advice and not a determination of compliance. Read how the tool and its dataset should and should not be used, and when to consult an attorney.",
};

export default function Disclaimer() {
  return (
    <div className="section">
      <div className="wrap-prose prose">
        <Link href="/" className="backlink">
          ← Home
        </Link>

        <p className="eyebrow" style={{ marginTop: 20 }}>
          FAIRLOOP · GOVERNING DISCLAIMER
        </p>
        <h1 style={{ marginTop: 10 }}>Disclaimer</h1>

        <div className="disclaimer-inset" style={{ marginTop: 20, marginBottom: 12 }}>
          <svg
            className="ico"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
          </svg>
          <span>
            <strong>Reclause is not legal advice and does not create an attorney-client
            relationship.</strong>{" "}
            It is an educational tool that compares the flow you describe against published
            statutes to surface areas worth a closer look. For decisions, talk to a lawyer.
          </span>
        </div>

        <p>
          Reclause is an automated, educational information tool. It describes what publicly
          available US state subscription auto-renewal ("ARL" / "negative-option") statutes
          address, based solely on the answers you provide and on an openly published, dated
          dataset of statutory requirements.
        </p>

        <h2>It is not a determination of compliance</h2>
        <p>
          Reclause never states that any business is, or is not, compliant with or in violation of
          any law. Its results identify potential points to review and link you to the underlying
          statute so you can read the text yourself. Every result is one of three honest things: a
          potential gap, an item worth review, or something you reported as likely addressed. None
          of those is a verdict.
        </p>

        <h2>It may be incomplete or out of date</h2>
        <p>
          Laws change frequently, vary by jurisdiction, and apply to facts that a short
          questionnaire and a static dataset cannot capture. Statutes are also subject to
          interpretation, enforcement discretion, and litigation. The dataset is research-grade. It
          is reviewed against sources and dated, and you should verify anything that matters against
          the primary source we link.
        </p>

        <h2>Use at your own risk</h2>
        <p>
          Penguin Alley and the authors make no warranty as to accuracy, completeness, or fitness
          for any purpose, and accept no liability for any decision made or action taken in reliance
          on the tool or the dataset.
        </p>

        <h2>Consult a qualified attorney</h2>
        <p>
          Before relying on anything here, consult a qualified attorney licensed in the relevant
          jurisdiction. Reclause is meant to make that conversation faster and cheaper, not to
          replace it.
        </p>

        <h2>About the optional implementation service</h2>
        <p>
          The optional Penguin Alley implementation service is technical work. It covers the
          engineering and UX changes to a website's signup, consent, and cancellation flow,
          performed to a specification provided by you or your legal counsel. It is not legal
          advice, legal representation, or a compliance guarantee.{" "}
          <a href="https://penguinalley.com/en/services?ref=reclause-disclaimer#penny">
            Talk to us →
          </a>
        </p>

        <p>
          By using Reclause or the dataset, you acknowledge and accept this disclaimer.
        </p>

        <p className="muted small" style={{ marginTop: 32 }}>
          Want the detail on how the engine and dataset work? Read the{" "}
          <Link href="/about">methodology</Link>, or head back{" "}
          <Link href="/">home</Link>.
        </p>
      </div>
    </div>
  );
}
