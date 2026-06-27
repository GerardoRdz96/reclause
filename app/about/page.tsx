import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Reclause works",
  description:
    "How Reclause checks the subscription flow you describe against US state auto-renewal laws. A deterministic engine over an open, cited dataset. Educational, not legal advice.",
};

export default function About() {
  return (
    <div className="section">
      <div className="wrap-prose prose">
        <Link href="/" className="backlink">
          ← Home
        </Link>

        <h1 style={{ marginTop: 16 }}>How Reclause works</h1>

        <p className="lead">
          Reclause is a free, educational tool that helps subscription businesses see where their
          sign-up and cancellation flows might miss a US auto-renewal (ARL, also called
          &ldquo;negative-option&rdquo;) law. It is built on two commitments: be honest, and be
          deterministic.
        </p>

        <div className="disclaimer-inset" style={{ marginTop: 24 }}>
          <svg
            className="ico"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="11" x2="12" y2="16" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
          <div>
            <strong>This is an educational tool, not legal advice.</strong> It compares the flow you
            describe against published statutes to surface areas worth a closer look. For decisions,
            talk to a lawyer. More on this below, and on the{" "}
            <Link href="/disclaimer">disclaimer page</Link>.
          </div>
        </div>

        <h2>A deterministic engine, not an AI verdict</h2>
        <p>
          Your answers are matched against the dataset by plain, inspectable rules. No language model
          decides whether you have a gap. That is deliberate. A tool like this should never hand you a
          confident, possibly-wrong legal conclusion. The matching is the same every time you run it,
          and you can read exactly why each result came out the way it did.
        </p>
        <p>Every result is one of three honest things:</p>
        <ul>
          <li>
            <span className="pill pill--gap">POTENTIAL GAP</span> &mdash; you said you don&rsquo;t do
            something a statute that applies to you addresses. Worth a look, with the statute cited so
            you can check it yourself.
          </li>
          <li>
            <span className="pill pill--review">WORTH REVIEW</span> &mdash; the question is a judgment
            call (like whether a disclosure is &ldquo;clear and conspicuous&rdquo;), or you
            weren&rsquo;t sure. A questionnaire cannot settle these, so we flag them for you or your
            counsel.
          </li>
          <li>
            <span className="pill pill--ok">LIKELY ADDRESSED</span> &mdash; you said you already do
            it. That is good signal, but it is not the same as &ldquo;verified compliant.&rdquo;
          </li>
        </ul>

        <h2>An open, cited dataset</h2>
        <p>
          Underneath the scanner is a machine-readable dataset of each covered jurisdiction&rsquo;s
          auto-renewal requirements. Disclosure before purchase, affirmative consent, post-purchase
          acknowledgment, easy cancellation, renewal reminders, free-trial conversion notices, and
          price-change notices. Every requirement is tied to a statute citation and a link to the
          primary source, so anyone can check our work.
        </p>
        <p>
          The current dataset covers <span className="mono">11 jurisdictions</span> and{" "}
          <span className="mono">73 requirements</span>, every item cited to its statute. Two states,{" "}
          <span className="mono">IL</span> and <span className="mono">MD</span>, are held back pending
          primary-source verification rather than shipped half-checked. The dataset is research-grade
          as of <span className="mono">June 2026</span>. Laws change and citations move, so the right
          move is always to open the linked statute and confirm it against the current text yourself.
        </p>
        <p>
          The dataset is public. If you spot something stale or wrong, we want to hear it.{" "}
          <a href="https://github.com/GerardoRdz96/reclause">View the data on GitHub →</a>
        </p>

        <h2>The disclaimer is transparency, not fine print</h2>
        <p>
          Reclause never tells you that you are compliant or in violation. It is not a compliance
          certification and not a substitute for an attorney. Surfacing that plainly, next to a clear
          description of how the engine works, is the honest version of this tool. It points you at
          the right questions and the right statutes so your conversation with counsel is a faster,
          cheaper one. The full version lives on the{" "}
          <Link href="/disclaimer">disclaimer page</Link>.
        </p>

        <h2>If you want the gaps fixed</h2>
        <p>
          Penguin Alley offers an optional, fixed-scope <strong>technical</strong> engagement. The
          engineering and UX work to make your sign-up, consent, and cancellation flow match the
          requirements you or your attorney specify. We build to your spec. We do not provide legal
          advice or decide your compliance. The scan is free forever, and the build help is optional.
        </p>
        <p style={{ marginTop: 20 }}>
          <a
            className="btn btn-primary"
            href="https://penguinalley.com/en/services?ref=reclause-about#penny"
          >
            Talk to Penguin Alley →
          </a>
        </p>

        <p className="muted small" style={{ marginTop: 40 }}>
          Reclause is a Penguin Alley project. Questions, or a correction to the dataset? We want to
          hear it.
        </p>
      </div>
    </div>
  );
}
