import { describe, it, expect } from "vitest";
import {
  scan,
  requirementApplies,
  DISCLAIMER,
  BANNED_ASSERTIONS,
} from "../lib/scanner";
import type { BusinessProfile, StateLaw, Requirement } from "../lib/types";

// ---- A tiny, self-contained seed dataset (real CA-shaped data, trimmed for tests) ----
const req = (
  id: string,
  category: Requirement["category"],
  applies: Partial<Requirement["applies_when"]>,
): Requirement => ({
  id,
  category,
  requirement_text: `California law addresses ${category.replace(/_/g, " ")}.`,
  applies_when: {
    always_if_auto_renew: true,
    online_signup: false,
    free_trial: false,
    long_term_or_annual: false,
    consumer_facing: true,
    ...applies,
  },
  statute_ref: "Cal. Bus. & Prof. Code §17600 et seq.",
  source_url: "https://leginfo.legislature.ca.gov/",
});

const CA: StateLaw = {
  state: "California",
  code: "CA",
  statutes: [
    {
      citation: "Cal. Bus. & Prof. Code §17600-17606 (ARL), as amended by AB 2863",
      effective: "2025-07-01",
      source_url: "https://leginfo.legislature.ca.gov/",
    },
  ],
  requirements: [
    req("ca-disclose", "disclosure_before_purchase", {}),
    req("ca-consent", "affirmative_consent", {}),
    req("ca-ack", "acknowledgment_confirmation", {}),
    req("ca-cancel", "cancellation_mechanism", { online_signup: true }),
    req("ca-reminder", "renewal_reminder_notice", { long_term_or_annual: true }),
    req("ca-trial", "free_trial_conversion_notice", { free_trial: true }),
  ],
  penalty: "Civil penalties; restitution. Treated as an unconditional gift in some cases.",
  enforcement_notes: "Active AG + class-action enforcement (e.g. negative-option suits).",
  caveats: "AB 2863 amendments phase in; verify current text.",
  last_reviewed: "2026-06-26",
};

const DATASET: StateLaw[] = [CA];

// A profile that auto-renews, sells to consumers in CA, online signup + free trial + annual.
const base = (overrides: Partial<BusinessProfile> = {}): BusinessProfile => ({
  statesServed: ["CA"],
  autoRenews: true,
  onlineSignup: true,
  freeTrial: true,
  longTermOrAnnual: true,
  consumerFacing: true,
  disclosesTermsBeforeCharge: false,
  getsAffirmativeConsent: false,
  sendsAcknowledgment: false,
  offersOnlineCancellation: false,
  sendsRenewalReminders: false,
  sendsTrialConversionNotice: false,
  sendsPriceChangeNotice: false,
  ...overrides,
});

describe("liability invariants (the council's #1 killer)", () => {
  it("every report carries a non-empty disclaimer and the notLegalAdvice marker", () => {
    const r = scan(base(), DATASET);
    expect(r.disclaimer.length).toBeGreaterThan(40);
    expect(r.notLegalAdvice).toBe(true);
    expect(r.disclaimer.toLowerCase()).toContain("not legal advice");
  });

  it("NO emitted finding ever asserts compliance or violation or gives a directive", () => {
    // Run across a spread of profiles to exercise every status branch.
    const profiles = [
      base(),
      base({ disclosesTermsBeforeCharge: true, getsAffirmativeConsent: true, sendsAcknowledgment: true, offersOnlineCancellation: true, sendsRenewalReminders: true, sendsTrialConversionNotice: true }),
      base({ disclosesTermsBeforeCharge: "unsure", getsAffirmativeConsent: "unsure" }),
    ];
    for (const p of profiles) {
      const r = scan(p, DATASET);
      const strings = [
        ...r.findings.map((f) => f.why),
        ...r.findings.map((f) => f.requirement_text),
        r.generatedNote,
      ];
      for (const s of strings) {
        for (const banned of BANNED_ASSERTIONS) {
          expect(
            s.toLowerCase().includes(banned),
            `Finding text must not contain "${banned}": "${s}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("the standing DISCLAIMER constant points the user to counsel", () => {
    expect(DISCLAIMER.toLowerCase()).toContain("not legal advice");
    expect(DISCLAIMER.toLowerCase()).toMatch(/attorney|lawyer|counsel/);
  });
});

describe("requirementApplies — precondition logic", () => {
  it("an auto-renew consumer requirement applies when the business auto-renews", () => {
    expect(requirementApplies(CA.requirements[0]!, base())).toBe(true);
  });

  it("does not apply when the business does not auto-renew at all", () => {
    expect(requirementApplies(CA.requirements[0]!, base({ autoRenews: false }))).toBe(false);
  });

  it("an online-cancel requirement does not apply to a business with no online signup", () => {
    const cancel = CA.requirements.find((r) => r.id === "ca-cancel")!;
    expect(requirementApplies(cancel, base({ onlineSignup: false }))).toBe(false);
    expect(requirementApplies(cancel, base({ onlineSignup: true }))).toBe(true);
  });

  it("a free-trial requirement does not apply when there is no free trial", () => {
    const trial = CA.requirements.find((r) => r.id === "ca-trial")!;
    expect(requirementApplies(trial, base({ freeTrial: false }))).toBe(false);
  });

  it("a B2B-only business escapes consumer-facing requirements", () => {
    expect(requirementApplies(CA.requirements[0]!, base({ consumerFacing: false }))).toBe(false);
  });
});

describe("scan — status assignment", () => {
  it("a do-nothing auto-renew business in CA gets potential_gap findings", () => {
    const r = scan(base(), DATASET);
    const gaps = r.findings.filter((f) => f.status === "potential_gap");
    expect(gaps.length).toBeGreaterThan(0);
    expect(r.summary.potentialGaps).toBe(gaps.length);
    expect(r.summary.statesWithPotentialGaps).toBe(1);
  });

  it("a business that does everything has zero potential gaps", () => {
    const r = scan(
      base({
        disclosesTermsBeforeCharge: true,
        getsAffirmativeConsent: true,
        sendsAcknowledgment: true,
        offersOnlineCancellation: true,
        sendsRenewalReminders: true,
        sendsTrialConversionNotice: true,
        sendsPriceChangeNotice: true,
      }),
      DATASET,
    );
    expect(r.summary.potentialGaps).toBe(0);
    expect(r.findings.every((f) => f.status === "likely_addressed")).toBe(true);
  });

  it('an "unsure" practice yields a review finding, not a gap', () => {
    const r = scan(base({ disclosesTermsBeforeCharge: "unsure" }), DATASET);
    const disclosure = r.findings.find((f) => f.category === "disclosure_before_purchase")!;
    expect(disclosure.status).toBe("review");
    expect(r.summary.review).toBeGreaterThanOrEqual(1);
  });

  it("only applicable requirements produce findings (no not_applicable noise)", () => {
    // No free trial → the free-trial requirement should not appear at all.
    const r = scan(base({ freeTrial: false }), DATASET);
    expect(r.findings.some((f) => f.category === "free_trial_conversion_notice")).toBe(false);
  });

  it("every finding carries a statute ref and a source url", () => {
    const r = scan(base(), DATASET);
    expect(r.findings.length).toBeGreaterThan(0);
    for (const f of r.findings) {
      expect(f.statute_ref.length).toBeGreaterThan(0);
      expect(f.source_url).toMatch(/^https?:\/\//);
    }
  });
});

describe("scan — coverage + states", () => {
  it("a state not in the dataset is reported as not-covered, not crashed", () => {
    const r = scan(base({ statesServed: ["CA", "TX"] }), DATASET);
    expect(r.statesNotCovered).toContain("TX");
    expect(r.statesEvaluated).toContain("CA");
    expect(r.statesEvaluated).not.toContain("TX");
  });

  it("handles an empty states list without throwing", () => {
    const r = scan(base({ statesServed: [] }), DATASET);
    expect(r.findings).toEqual([]);
    expect(r.summary.potentialGaps).toBe(0);
  });

  it("normalizes lower-case / whitespace state codes", () => {
    const r = scan(base({ statesServed: [" ca "] }), DATASET);
    expect(r.statesEvaluated).toContain("CA");
  });
});

describe("scan — determinism", () => {
  it("same input yields deeply-equal output", () => {
    const p = base();
    expect(scan(p, DATASET)).toEqual(scan(p, DATASET));
  });

  it("does not mutate the input profile or dataset", () => {
    const p = base();
    const snapshot = JSON.parse(JSON.stringify(p));
    const dsSnapshot = JSON.parse(JSON.stringify(DATASET));
    scan(p, DATASET);
    expect(p).toEqual(snapshot);
    expect(DATASET).toEqual(dsSnapshot);
  });
});
