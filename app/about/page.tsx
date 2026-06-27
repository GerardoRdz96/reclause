import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How ARL Radar works",
  description:
    "How ARL Radar checks your subscription flow against US state auto-renewal laws — a deterministic engine over an open, cited dataset. Educational, not legal advice.",
};

export default function About() {
  return (
    <div className="section">
      <div className="wrap prose">
        <Link href="/" className="backlink">
          ← Home
        </Link>
        <h1 style={{ marginTop: 16 }}>How ARL Radar works</h1>

        <p>
          ARL Radar is a free, educational tool that helps subscription businesses understand US
          auto-renewal (ARL / “negative-option”) laws. It is built on two ideas: be honest, and be
          deterministic.
        </p>

        <h2>An open, cited dataset</h2>
        <p>
          Underneath the scanner is a machine-readable dataset of each covered state’s auto-renewal
          requirements — disclosure, consent, acknowledgment, cancellation, renewal and trial
          notices — every one tied to a statute citation and a link to the primary source. We
          publish it openly so anyone can check our work. It is reviewed against sources and dated;
          laws change, so we re-check.
        </p>

        <h2>A deterministic engine — no AI deciding your compliance</h2>
        <p>
          Your answers are matched against that dataset by plain, inspectable rules. No language
          model decides whether you have a gap. That is deliberate: a tool like this should never
          hand you a confident, possibly-wrong legal conclusion. Every result is one of three
          honest things — <strong>potential gap</strong> (you said you don’t do something a statute
          addresses), <strong>worth review</strong> (you weren’t sure), or{" "}
          <strong>likely addressed</strong> (you said you already do it, which is not the same as
          “verified compliant”).
        </p>

        <h2>What it is not</h2>
        <p>
          It is not legal advice, not a compliance certification, and not a substitute for an
          attorney. It never tells you that you are compliant or in violation. It points you at the
          right questions and the right statutes so your conversation with counsel is a faster,
          cheaper one.
        </p>

        <h2>If you want the gaps fixed</h2>
        <p>
          Penguin Alley offers an optional, fixed-scope <strong>technical</strong> engagement — the
          engineering and UX work to make your signup, consent, and cancellation flow match the
          requirements you or your attorney specify. We implement to spec; we don’t provide legal
          advice or decide your compliance. The scan is free forever; the build help is optional.{" "}
          <a href="https://penguinalley.com/en/services?ref=arl-radar-about#penny">Talk to us →</a>
        </p>

        <p className="muted small" style={{ marginTop: 32 }}>
          ARL Radar is a Penguin Alley project. Questions or a correction to the dataset? We want to
          hear it.
        </p>
      </div>
    </div>
  );
}
