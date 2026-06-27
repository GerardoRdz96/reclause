import type { Metadata } from "next";
import Link from "next/link";
import { DATASET } from "../../lib/dataset";

export const metadata: Metadata = {
  title: "US auto-renewal laws by state",
  description:
    "Browse subscription auto-renewal (ARL / negative-option) law requirements by US state, with cited statutes. Educational reference by Penguin Alley. Not legal advice.",
};

export default function StatesIndex() {
  const states = DATASET.filter((s) => s.code !== "FED").sort((a, b) =>
    a.state.localeCompare(b.state),
  );
  const federal = DATASET.find((s) => s.code === "FED");

  return (
    <div className="section">
      <div className="wrap">
        <Link href="/" className="backlink">
          ← Home
        </Link>

        <h1 className="h1-serif" style={{ marginTop: 16, maxWidth: "20ch" }}>
          US auto-renewal laws, state by state
        </h1>
        <p className="lead prose" style={{ marginTop: 16 }}>
          A plain-English, cited reference to each state&rsquo;s subscription auto-renewal rules.
          Open the entry you care about to read what the law requires, with a link to the statute so
          you can check the source yourself. This is educational information, not legal advice.
        </p>

        <div className="state-grid" style={{ marginTop: 40 }}>
          {states.map((s) => (
            <Link
              href={`/states/${s.code.toLowerCase()}`}
              key={s.code}
              className="state-card"
            >
              <div className="code mono">{s.code}</div>
              <div className="name">{s.state}</div>
              <div className="meta mono">
                {s.requirements.length} requirement{s.requirements.length === 1 ? "" : "s"}
              </div>
            </Link>
          ))}

          {federal && (
            <Link
              href={`/states/${federal.code.toLowerCase()}`}
              key={federal.code}
              className="state-card"
            >
              <div className="code mono">FED</div>
              <div className="name">{federal.state}</div>
              <div className="meta mono">federal context</div>
            </Link>
          )}
        </div>

        <p className="small muted" style={{ marginTop: 28, maxWidth: "62ch" }}>
          Two more states, <span className="mono">IL</span> and <span className="mono">MD</span>, are
          intentionally held back while we verify their requirements against the primary sources.
          We&rsquo;d rather leave them out than publish something we haven&rsquo;t confirmed.
        </p>

        <div style={{ marginTop: 40 }}>
          <Link href="/scan" className="btn btn-primary">
            Run the free scan →
          </Link>
        </div>
      </div>
    </div>
  );
}
