import { describe, it, expect } from "vitest";
import { scan, BANNED_ASSERTIONS } from "../lib/scanner";
import { DATASET, COVERED_STATE_CODES } from "../lib/dataset";
import { emptyProfile } from "../lib/questions";
import type { BusinessProfile } from "../lib/types";

// End-to-end against the REAL shipped dataset (data/arl-states.json). Importing DATASET
// also runs the load-time validation, so this test fails loudly if the dataset is malformed.

describe("real dataset wiring", () => {
  it("loads, validates, and covers at least one real state", () => {
    expect(DATASET.length).toBeGreaterThan(0);
    expect(COVERED_STATE_CODES.length).toBeGreaterThan(0);
    for (const s of DATASET) {
      expect(s.requirements.length).toBeGreaterThan(0);
      for (const r of s.requirements) {
        expect(r.source_url).toMatch(/^https?:\/\//);
        expect(r.statute_ref.length).toBeGreaterThan(0);
      }
    }
  });

  it("a realistic DTC subscription owner gets an honest, cited, gap-flagged report", () => {
    // A real-ish owner: auto-renews, online, free trial, annual, consumer — does almost nothing.
    const owner: BusinessProfile = {
      ...emptyProfile(),
      statesServed: COVERED_STATE_CODES.slice(0, Math.min(3, COVERED_STATE_CODES.length)),
      autoRenews: true,
      consumerFacing: true,
      onlineSignup: true,
      freeTrial: true,
      longTermOrAnnual: true,
      disclosesTermsBeforeCharge: true, // does one thing
      getsAffirmativeConsent: false,
      sendsAcknowledgment: false,
      offersOnlineCancellation: false,
      sendsRenewalReminders: false,
      sendsTrialConversionNotice: "unsure",
      sendsPriceChangeNotice: false,
    };
    const r = scan(owner, DATASET);

    expect(r.notLegalAdvice).toBe(true);
    expect(r.disclaimer.toLowerCase()).toContain("not legal advice");
    expect(r.statesEvaluated.length).toBeGreaterThan(0);
    expect(r.findings.length).toBeGreaterThan(0);
    expect(r.summary.potentialGaps).toBeGreaterThan(0); // a do-little owner should see gaps

    // Every finding is cited and clean of advisory phrasing.
    for (const f of r.findings) {
      expect(f.source_url).toMatch(/^https?:\/\//);
      const low = `${f.why} ${f.requirement_text}`.toLowerCase();
      for (const banned of BANNED_ASSERTIONS) {
        expect(low.includes(banned), `"${banned}" leaked into a finding`).toBe(false);
      }
    }
  });

  it("a pure B2B business that does not auto-renew sees no applicable findings", () => {
    const b2b: BusinessProfile = {
      ...emptyProfile(),
      statesServed: COVERED_STATE_CODES,
      autoRenews: false,
      consumerFacing: false,
    };
    const r = scan(b2b, DATASET);
    expect(r.summary.potentialGaps).toBe(0);
  });
});
