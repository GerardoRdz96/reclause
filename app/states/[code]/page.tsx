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

function InfoIcon() {
  return (
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
  );
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const s = getState(code);
  if (!s) notFound();
  const isFed = s.code === "FED";
  const heading = isFed
    ? "Federal (FTC) subscription auto-renewal rules"
    : `${s.state} subscription auto-renewal law`;

  // Group requirements by category, preserving first-appearance order.
  const order: string[] = [];
  const byCategory = new Map<string, typeof s.requirements>();
  for (const r of s.requirements) {
    if (!byCategory.has(r.category)) {
      byCategory.set(r.category, []);
      order.push(r.category);
    }
    byCategory.get(r.category)!.push(r);
  }

  // Deterministic internal-link mesh — 4 sibling states, rotated per code for variety.
  const pool = DATASET.filter((x) => x.code !== s.code && x.code !== "FED");
  const offset = pool.length
    ? (s.code.charCodeAt(0) + (s.code.charCodeAt(1) || 0)) % pool.length
    : 0;
  const related = [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 4);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: s.last_reviewed,
    mainEntity: s.requirements.map((r) => ({
      "@type": "Question",
      name: `What does ${s.state}'s auto-renewal law say about ${CATEGORY_LABELS[r.category] ?? r.category}?`,
      acceptedAnswer: { "@type": "Answer", text: r.requirement_text },
    })),
  };

  return (
    <article className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="wrap-prose">
        <Link href="/states" className="backlink">
          ← All states
        </Link>

        <h1 className="h1-serif" style={{ marginTop: 16 }}>
          {heading}
        </h1>

        <p className="mono small muted" style={{ marginTop: 10 }}>
          {s.statutes[0] ? <>Effective {s.statutes[0].effective} · </> : null}
          Last reviewed {s.last_reviewed}
        </p>

        <div className="disclaimer-inset" style={{ marginTop: 20 }}>
          <InfoIcon />
          <div>
            <strong>Educational summary, not legal advice.</strong> This page describes what
            publicly available statutes address. It is not a determination of anyone&rsquo;s
            compliance. Read the linked primary sources and talk to a qualified attorney before you
            rely on it.
          </div>
        </div>
      </div>

      {/* The statute */}
      <div className="wrap-prose" style={{ marginTop: 48 }}>
        <h2>The statute</h2>
        <div className="prose" style={{ marginTop: 12 }}>
          {s.statutes.map((st, i) => (
            <p key={i} style={{ marginBottom: i === s.statutes.length - 1 ? 0 : 18 }}>
              <span className="mono" style={{ color: "var(--ink)", fontWeight: 500 }}>
                {st.citation}
              </span>
              <br />
              <span className="cite muted">Effective {st.effective}</span>
              <br />
              <a href={st.source_url} target="_blank" rel="noopener noreferrer">
                Read the source →
              </a>
            </p>
          ))}
        </div>
      </div>

      {/* What it addresses — grouped by category, answer-first */}
      <div className="wrap-prose" style={{ marginTop: 48 }}>
        <h2>What it addresses</h2>
        <p className="prose" style={{ marginTop: 12 }}>
          Each requirement below is stated in plain English first, then cited to the statute so you
          can read the primary source.
        </p>

        {order.map((cat) => {
          const items = byCategory.get(cat)!;
          return (
            <div className="req-group" key={cat}>
              <h3 className="req-group__title">{CATEGORY_LABELS[cat] ?? cat}</h3>
              {items.map((r) => (
                <div className="req" key={r.id}>
                  <p style={{ color: "var(--ink)", margin: 0 }}>{r.requirement_text}</p>
                  <p className="finding__cite" style={{ marginTop: 10, marginBottom: 0 }}>
                    <span className="cite mono">{r.statute_ref}</span>
                    <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="cite">
                      Read the statute →
                    </a>
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Penalties & caveats */}
      <div className="wrap-prose" style={{ marginTop: 48 }}>
        <h2>Penalties and enforcement</h2>
        <div className="prose" style={{ marginTop: 12 }}>
          <p>{s.penalty}</p>
          <p className="muted">{s.enforcement_notes}</p>
        </div>

        <h2 style={{ marginTop: 36 }}>Caveats</h2>
        <div className="prose" style={{ marginTop: 12 }}>
          <p className="muted">{s.caveats}</p>
          <p className="mono small muted">Last reviewed {s.last_reviewed}</p>
        </div>
      </div>

      {/* Scan CTA */}
      <div className="wrap-prose" style={{ marginTop: 48 }}>
        <div className="card card--float">
          <h3 style={{ marginBottom: 8 }}>
            {isFed
              ? "See how your flow lines up with the FTC rules"
              : `Check your flow against ${s.state}'s law`}
          </h3>
          <p style={{ marginBottom: 18 }}>
            Answer a few plain questions about your signup and cancellation flows. Reclause maps them
            against {isFed ? "the federal" : `${s.state}'s`} requirements and every other state you
            serve. Free, and nothing leaves your browser.
          </p>
          <Link href="/scan" className="btn btn-primary">
            {isFed ? "Run the free scan →" : `Check your flow against ${s.state}'s law →`}
          </Link>
        </div>
      </div>

      {/* Internal-link mesh */}
      {related.length > 0 && (
        <div className="wrap-prose" style={{ marginTop: 48 }}>
          <h3 className="req-group__title" style={{ marginBottom: 16 }}>
            Other states
          </h3>
          <div className="state-grid">
            {related.map((r) => (
              <Link href={`/states/${r.code.toLowerCase()}`} key={r.code} className="state-card">
                <div className="code">{r.code}</div>
                <div className="name">{r.state}</div>
                <div className="meta">
                  {r.requirements.length} requirement{r.requirements.length === 1 ? "" : "s"} cited
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
