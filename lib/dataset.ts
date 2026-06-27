// Loads the open, cited ARL requirements dataset and validates its shape at load time.
// The data file (data/arl-states.json) is the durable, machine-readable asset — the moat.

import raw from "../data/arl-states.json" with { type: "json" };
import { ALL_CATEGORIES } from "./types";
import type { StateLaw, Category, AppliesWhen } from "./types";
import { containsBannedAssertion } from "./scanner";

function isCategory(c: string): c is Category {
  return (ALL_CATEGORIES as string[]).includes(c);
}

const APPLIES_WHEN_KEYS: (keyof AppliesWhen)[] = [
  "always_if_auto_renew",
  "online_signup",
  "free_trial",
  "long_term_or_annual",
  "consumer_facing",
];

/** A source_url must be a real, resolvable deep-link. The product's entire moat is
 *  "every requirement links to a primary source so anyone can check our work," so a
 *  garbled citation link is a credibility defect that must fail the BUILD, not ship.
 *  A literal non-ASCII char in a URL is almost always an HTML-entity decode artifact
 *  (e.g. "&sect" -> "§"), which silently breaks the deep-link. */
function assertUsableSourceUrl(url: string, ctx: string): void {
  if (!url || !/^https?:\/\//.test(url)) {
    throw new Error(`ARL ${ctx} has no usable source_url`);
  }
  if (/[^\x00-\x7F]/.test(url)) {
    throw new Error(`ARL ${ctx} source_url has non-ASCII (likely a broken &entity): ${url}`);
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`ARL ${ctx} source_url is not a valid URL: ${url}`);
  }
  // California leginfo deep-links degrade to a table-of-contents/error page without the
  // sectionNum query param — the exact failure the "&sect" artifact caused.
  if (
    parsed.hostname.endsWith("leginfo.legislature.ca.gov") &&
    parsed.pathname.includes("displaySection") &&
    !parsed.searchParams.has("sectionNum")
  ) {
    throw new Error(`ARL ${ctx} leginfo source_url missing sectionNum (dead deep-link): ${url}`);
  }
}

/** Every free-text state-level field that reaches the UI, flattened to strings. Guarded so a
 *  future dataset edit can't leak advisory/compliance language into a rendered state page —
 *  these prose fields are displayed verbatim but were not covered by the per-requirement guard. */
function stateProse(s: StateLaw): string[] {
  const flat = (v: unknown): string[] =>
    Array.isArray(v) ? v.flatMap(flat) : v == null ? [] : [String(v)];
  return [...flat(s.penalty), ...flat(s.enforcement_notes), ...flat(s.caveats)];
}

/** Strict load-time validation — a malformed or unsafe dataset must fail the BUILD, never
 *  silently ship a wrong scan or leak advisory language to a user. */
function validate(data: unknown): StateLaw[] {
  if (!Array.isArray(data)) throw new Error("ARL dataset must be an array");
  for (const s of data as StateLaw[]) {
    if (!s.code || !s.state) throw new Error("ARL dataset entry missing code/state");
    if (!Array.isArray(s.requirements)) throw new Error(`ARL ${s.code}: requirements missing`);
    // No advisory/compliance language may live in any rendered state-level prose field.
    for (const text of stateProse(s)) {
      const banned = containsBannedAssertion(text);
      if (banned) {
        throw new Error(`ARL ${s.code}: state field contains banned advisory phrase "${banned}"`);
      }
    }
    // Statute citation links are rendered on the state page too — validate them.
    for (const cite of s.statutes ?? []) {
      assertUsableSourceUrl(cite.source_url, `${s.code} statute "${cite.citation}"`);
    }
    for (const r of s.requirements) {
      if (!isCategory(r.category)) {
        throw new Error(`ARL ${s.code}: requirement ${r.id} has unknown category "${r.category}"`);
      }
      assertUsableSourceUrl(r.source_url, `${s.code}: requirement ${r.id}`);
      // applies_when must have every key present AND a real boolean (a string like "false"
      // is truthy and would silently corrupt the applicability logic).
      const aw = r.applies_when as unknown as Record<string, unknown> | undefined;
      if (!aw || typeof aw !== "object") {
        throw new Error(`ARL ${s.code}: requirement ${r.id} missing applies_when`);
      }
      for (const k of APPLIES_WHEN_KEYS) {
        if (typeof aw[k] !== "boolean") {
          throw new Error(`ARL ${s.code}: requirement ${r.id} applies_when.${k} must be a boolean`);
        }
      }
      // No advisory/compliance language may live in dataset text that reaches the UI.
      const banned =
        containsBannedAssertion(r.requirement_text ?? "") ||
        containsBannedAssertion(r.statute_ref ?? "");
      if (banned) {
        throw new Error(
          `ARL ${s.code}: requirement ${r.id} contains banned advisory phrase "${banned}"`,
        );
      }
    }
  }
  return data as StateLaw[];
}

export const DATASET: StateLaw[] = validate(raw);

export const COVERED_STATE_CODES: string[] = DATASET.map((s) => s.code).filter(
  (c) => c !== "FED",
);

export function getState(code: string): StateLaw | undefined {
  const want = code.trim().toUpperCase();
  return DATASET.find((s) => s.code.toUpperCase() === want);
}
