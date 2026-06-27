import type { Metadata } from "next";
import Link from "next/link";
import { DATASET } from "../../lib/dataset";

export const metadata: Metadata = {
  title: "US auto-renewal laws by state",
  description:
    "Browse subscription auto-renewal (ARL / negative-option) law requirements by US state, with cited statutes. Educational reference by Penguin Alley. Not legal advice.",
};

export default function StatesIndex() {
  const states = DATASET.filter((s) => s.code !== "FED");
  const federal = DATASET.find((s) => s.code === "FED");

  return (
    <div className="section">
      <div className="wrap">
        <Link href="/" className="backlink">
          ← Home
        </Link>
        <h1 style={{ marginTop: 16 }}>US auto-renewal laws by state</h1>
        <p className="prose">
          A plain-language, cited reference to each state’s subscription auto-renewal / negative-option
          requirements. Open and free. This is educational information, not legal advice — every entry
          links to its statute so you can read the primary source.
        </p>

        <div className="states-list">
          {states.map((s) => (
            <Link href={`/states/${s.code.toLowerCase()}`} key={s.code} className="state-card">
              <div className="sc-name">
                {s.state} <span className="sc-code">{s.code}</span>
              </div>
              <div className="sc-meta">
                {s.requirements.length} requirement{s.requirements.length === 1 ? "" : "s"} · last
                reviewed {s.last_reviewed}
              </div>
            </Link>
          ))}
        </div>

        {federal && (
          <>
            <h2 style={{ marginTop: 48 }}>Federal context</h2>
            <Link href={`/states/${federal.code.toLowerCase()}`} className="state-card" style={{ maxWidth: 360 }}>
              <div className="sc-name">{federal.state}</div>
              <div className="sc-meta">{federal.caveats.slice(0, 90)}…</div>
            </Link>
          </>
        )}

        <div className="callout" style={{ marginTop: 40 }}>
          <strong>Want to know which of these apply to you?</strong>{" "}
          <Link href="/scan">Run the free scan →</Link>
        </div>
      </div>
    </div>
  );
}
