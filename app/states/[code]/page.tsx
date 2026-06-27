import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASET, getState } from "../../../lib/dataset";

export function generateStaticParams() {
  return DATASET.map((s) => ({ code: s.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const s = getState(code);
  if (!s) return { title: "State not found" };
  const isFed = s.code === "FED";
  const title = isFed
    ? "Federal (FTC) subscription auto-renewal rules"
    : `${s.state} subscription auto-renewal law (ARL)`;
  return {
    title,
    description: `What ${s.state}'s subscription auto-renewal / negative-option law addresses — disclosure, consent, cancellation, and renewal notices — with cited statutes. Educational, not legal advice.`,
    alternates: { canonical: `/states/${s.code.toLowerCase()}` },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  disclosure_before_purchase: "Disclosure before purchase",
  affirmative_consent: "Affirmative consent",
  acknowledgment_confirmation: "Acknowledgment / confirmation",
  cancellation_mechanism: "Cancellation mechanism",
  renewal_reminder_notice: "Renewal reminder",
  free_trial_conversion_notice: "Free-trial conversion notice",
  price_change_notice: "Price-change notice",
};

export default async function StatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const s = getState(code);
  if (!s) notFound();
  const isFed = s.code === "FED";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.requirements.map((r) => ({
      "@type": "Question",
      name: `What does ${s.state}'s auto-renewal law say about ${CATEGORY_LABELS[r.category] ?? r.category}?`,
      acceptedAnswer: { "@type": "Answer", text: r.requirement_text },
    })),
  };

  return (
    <div className="section">
      <div className="wrap prose">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <Link href="/states" className="backlink">
          ← All states
        </Link>
        <h1 style={{ marginTop: 16 }}>
          {isFed
            ? "Federal (FTC) subscription auto-renewal rules"
            : `${s.state} subscription auto-renewal law`}
        </h1>

        <div className="callout" style={{ marginBottom: 24 }}>
          <strong>Educational summary, not legal advice.</strong> This page describes what publicly
          available statutes address. It is not a determination of anyone’s compliance. Read the
          linked primary sources and consult a qualified attorney before relying on it.
        </div>

        <h2>The statute</h2>
        {s.statutes.map((st, i) => (
          <p key={i}>
            <strong>{st.citation}</strong>
            <br />
            <span className="muted small">Effective: {st.effective}</span>
            <br />
            <a href={st.source_url} target="_blank" rel="noopener noreferrer">
              Read the source →
            </a>
          </p>
        ))}

        <h2>What it addresses</h2>
        {s.requirements.map((r) => (
          <div className="req-row" key={r.id}>
            <div className="cat">{CATEGORY_LABELS[r.category] ?? r.category}</div>
            <p style={{ margin: "6px 0" }}>{r.requirement_text}</p>
            <span className="cite small muted">
              {r.statute_ref} ·{" "}
              <a href={r.source_url} target="_blank" rel="noopener noreferrer">
                source
              </a>
            </span>
          </div>
        ))}

        <h2>Penalties &amp; enforcement</h2>
        <p>{s.penalty}</p>
        <p className="muted">{s.enforcement_notes}</p>

        <h2>Caveats</h2>
        <p className="muted">{s.caveats}</p>
        <p className="muted small">Last reviewed: {s.last_reviewed}</p>

        <div className="cta-band" style={{ marginTop: 40 }}>
          <h2>Does this apply to your business?</h2>
          <p>
            Answer a few questions and ARL Radar will show you where your flow may have gaps across
            every state you serve — free.
          </p>
          <Link href="/scan" className="btn btn-primary">
            Run the free scan →
          </Link>
        </div>
      </div>
    </div>
  );
}
