// ARL Radar — the deterministic scoring engine.
//
// LIABILITY-CRITICAL DESIGN: every status here is decided by pure rule-matching against
// the business's own self-reported answers. No LLM, no probability, no "compliance"
// conclusion. Output is informational and always disclaimed. This is the single most
// important design choice in the product (it neutralizes the council's #1 killer:
// a solo, unlicensed builder shipping automated legal conclusions).

import type {
  BusinessProfile,
  Finding,
  GapReport,
  Requirement,
  StateLaw,
  Tri,
} from "./types";
import { CATEGORY_TO_PRACTICE } from "./types";

/** The standing disclaimer. The product never emits a report without it. */
export const DISCLAIMER =
  "This is an automated, educational information tool — NOT legal advice, and not a " +
  "determination of your legal compliance. It describes what publicly available state " +
  "auto-renewal statutes address, based only on the answers you provided. Laws change " +
  "and apply to facts a questionnaire cannot capture. Before relying on any of this, " +
  "consult a qualified attorney licensed in the relevant state.";

/** Substrings that must NEVER appear in an engine-emitted finding. Enforced by a unit
 *  test AND asserted at runtime in development. The guard against advisory phrasing. */
export const BANNED_ASSERTIONS: string[] = [
  "you are compliant",
  "you are not compliant",
  "you are violating",
  "you are in violation",
  "is compliant",
  "are in compliance",
  "you must ",
  "you need to ",
  "you have to ",
  "we guarantee",
  "guaranteed compliant",
  "fully compliant",
  "this is legal advice",
];

function norm(code: string): string {
  return code.trim().toUpperCase();
}

/** True if a string contains any banned advisory/compliance assertion (case-insensitive).
 *  Shared by the runtime finding guard AND the dataset loader so bad data fails loudly. */
export function containsBannedAssertion(text: string): string | null {
  const low = text.toLowerCase();
  for (const banned of BANNED_ASSERTIONS) {
    if (low.includes(banned)) return banned;
  }
  return null;
}

/** A requirement applies when every precondition it marks `true` is satisfied by the profile. */
export function requirementApplies(
  req: Requirement,
  profile: BusinessProfile,
): boolean {
  const aw = req.applies_when;
  if (aw.always_if_auto_renew && !profile.autoRenews) return false;
  if (aw.online_signup && !profile.onlineSignup) return false;
  if (aw.free_trial && !profile.freeTrial) return false;
  if (aw.long_term_or_annual && !profile.longTermOrAnnual) return false;
  if (aw.consumer_facing && !profile.consumerFacing) return false;
  return true;
}

function practiceValue(profile: BusinessProfile, req: Requirement): Tri {
  const key = CATEGORY_TO_PRACTICE[req.category];
  // Practice fields are the only Tri fields; this access is always a Tri.
  return profile[key] as Tri;
}

function whyFor(
  status: Finding["status"],
  stateName: string,
  statuteRef: string,
): string {
  switch (status) {
    case "potential_gap":
      return (
        `You indicated this is not currently part of your flow. ${stateName}'s law ` +
        `(${statuteRef}) addresses this point — it may be worth reviewing with qualified ` +
        `counsel whether it applies to your business.`
      );
    case "likely_addressed":
      return (
        `You indicated you already do this. That is not a determination that your ` +
        `implementation meets ${stateName}'s standard (${statuteRef}) — only your own ` +
        `review or counsel can confirm that.`
      );
    case "review":
      return (
        `You were not sure about this. ${stateName}'s law (${statuteRef}) addresses it, ` +
        `so it is worth confirming with qualified counsel.`
      );
    default:
      return "";
  }
}

function statusFor(practice: Tri): Finding["status"] {
  if (practice === "unsure") return "review";
  return practice ? "likely_addressed" : "potential_gap";
}

function assertClean(findings: Finding[], extra: string[]): void {
  // Defensive runtime guard (no-op cost in prod; catches a future dataset/why regression).
  // Covers BOTH engine-generated `why` AND dataset-sourced `requirement_text`, so a bad
  // dataset entry can never leak advisory/compliance language into the UI.
  const strings = [
    ...findings.map((f) => f.why),
    ...findings.map((f) => f.requirement_text),
    ...extra,
  ];
  for (const s of strings) {
    const banned = containsBannedAssertion(s);
    if (banned) {
      throw new Error(
        `ARL Radar invariant violated: emitted text contains banned assertion "${banned}"`,
      );
    }
  }
}

export function scan(profile: BusinessProfile, dataset: StateLaw[]): GapReport {
  const byCode = new Map(dataset.map((s) => [norm(s.code), s]));
  const requested = profile.statesServed.map(norm).filter((c) => c.length > 0);
  const uniqueRequested = [...new Set(requested)];

  const statesEvaluated: string[] = [];
  const statesNotCovered: string[] = [];
  const findings: Finding[] = [];

  for (const code of uniqueRequested) {
    const law = byCode.get(code);
    if (!law) {
      statesNotCovered.push(code);
      continue;
    }
    statesEvaluated.push(code);
    for (const req of law.requirements) {
      if (!requirementApplies(req, profile)) continue; // not_applicable → omitted (no noise)
      const status = statusFor(practiceValue(profile, req));
      findings.push({
        stateCode: law.code,
        stateName: law.state,
        category: req.category,
        status,
        requirement_text: req.requirement_text,
        why: whyFor(status, law.state, req.statute_ref),
        statute_ref: req.statute_ref,
        source_url: req.source_url,
      });
    }
  }

  const generatedNote =
    "Informational snapshot based on the answers you provided. " +
    "It is not a legal conclusion. See the disclaimer.";

  assertClean(findings, [generatedNote]);

  const potentialGaps = findings.filter((f) => f.status === "potential_gap");
  const likelyAddressed = findings.filter((f) => f.status === "likely_addressed");
  const review = findings.filter((f) => f.status === "review");
  const statesWithPotentialGaps = new Set(potentialGaps.map((f) => f.stateCode)).size;

  return {
    disclaimer: DISCLAIMER,
    notLegalAdvice: true,
    generatedNote,
    // Snapshot by value — a later mutation of the caller's profile must not change this report.
    profileEcho: structuredClone(profile),
    statesEvaluated,
    statesNotCovered,
    findings,
    summary: {
      potentialGaps: potentialGaps.length,
      likelyAddressed: likelyAddressed.length,
      review: review.length,
      statesWithPotentialGaps,
    },
  };
}
