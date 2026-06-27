// Reclause — core types.
// Design rule (liability-critical): the SCORING path is 100% deterministic rule-matching.
// No LLM ever decides a finding's status. An LLM may only phrase an *already-decided*
// finding into plainer English downstream — never determine compliance.

/** The fixed requirement categories every state's law maps onto. The bridge between
 *  the business questionnaire and the per-state dataset. */
export type Category =
  | "disclosure_before_purchase" // clear & conspicuous auto-renewal terms shown before charge
  | "affirmative_consent" // separate affirmative consent to the auto-renew / continuous service
  | "acknowledgment_confirmation" // post-purchase acknowledgment incl. cancellation info / retainable record
  | "cancellation_mechanism" // easy cancellation; online cancel if signed up online ("click to cancel")
  | "renewal_reminder_notice" // advance notice before a renewal (esp. long terms / auto-renew)
  | "free_trial_conversion_notice" // notice before a free / discounted trial converts to paid
  | "price_change_notice"; // notice before a material price / term change takes effect

export const ALL_CATEGORIES: Category[] = [
  "disclosure_before_purchase",
  "affirmative_consent",
  "acknowledgment_confirmation",
  "cancellation_mechanism",
  "renewal_reminder_notice",
  "free_trial_conversion_notice",
  "price_change_notice",
];

/** Preconditions for a requirement. A `true` flag is a precondition that must be
 *  satisfied by the profile for the requirement to apply; a `false` flag is ignored. */
export interface AppliesWhen {
  always_if_auto_renew: boolean;
  online_signup: boolean;
  free_trial: boolean;
  long_term_or_annual: boolean;
  consumer_facing: boolean;
}

export interface Requirement {
  id: string;
  category: Category;
  /** FACTUAL description of what the statute requires. Never reader-directed advice. */
  requirement_text: string;
  applies_when: AppliesWhen;
  statute_ref: string;
  source_url: string;
}

export interface StatuteCitation {
  citation: string;
  effective: string;
  source_url: string;
}

export interface StateLaw {
  state: string;
  /** 2-letter code, or "FED" for the federal (FTC) context entry. */
  code: string;
  statutes: StatuteCitation[];
  requirements: Requirement[];
  penalty: string;
  enforcement_notes: string;
  caveats: string;
  /** ISO date the entry was last reviewed against sources. */
  last_reviewed: string;
}

/** A practice the owner may not be sure about. "unsure" → the finding is flagged for review. */
export type Tri = true | false | "unsure";

/** What the business tells us about itself + what it already does. Deterministic + inspectable.
 *  Nature fields are booleans (the owner knows their model); practice fields are tri-state
 *  (the owner often does not know whether a practice meets the statute's spec). */
export interface BusinessProfile {
  /** 2-letter state codes the business serves / has customers in. */
  statesServed: string[];
  // Nature of the offering (drives which requirements apply):
  autoRenews: boolean;
  onlineSignup: boolean;
  freeTrial: boolean;
  longTermOrAnnual: boolean;
  consumerFacing: boolean;
  // Current practices (what they say they already do):
  disclosesTermsBeforeCharge: Tri;
  getsAffirmativeConsent: Tri;
  sendsAcknowledgment: Tri;
  offersOnlineCancellation: Tri;
  sendsRenewalReminders: Tri;
  sendsTrialConversionNotice: Tri;
  sendsPriceChangeNotice: Tri;
}

/** Maps each requirement category to the profile practice field that answers it. */
export const CATEGORY_TO_PRACTICE: Record<Category, keyof BusinessProfile> = {
  disclosure_before_purchase: "disclosesTermsBeforeCharge",
  affirmative_consent: "getsAffirmativeConsent",
  acknowledgment_confirmation: "sendsAcknowledgment",
  cancellation_mechanism: "offersOnlineCancellation",
  renewal_reminder_notice: "sendsRenewalReminders",
  free_trial_conversion_notice: "sendsTrialConversionNotice",
  price_change_notice: "sendsPriceChangeNotice",
};

export type FindingStatus =
  | "potential_gap" // an applicable requirement the business says it does NOT currently do
  | "likely_addressed" // an applicable requirement the business says it already does
  | "not_applicable" // the requirement's preconditions are not met
  | "review"; // inherently a judgment call (e.g. "clear & conspicuous") — always flagged for human/counsel review

export interface Finding {
  stateCode: string;
  stateName: string;
  category: Category;
  status: FindingStatus;
  requirement_text: string;
  /** Conservative, educational explanation. Never asserts compliance/violation. */
  why: string;
  statute_ref: string;
  source_url: string;
}

export interface GapReport {
  /** Always present and prominent. The product never ships without it. */
  disclaimer: string;
  /** Structural marker — this is informational, not a legal conclusion. */
  notLegalAdvice: true;
  generatedNote: string;
  profileEcho: BusinessProfile;
  statesEvaluated: string[];
  /** State codes the business named that aren't in the dataset (so the UI can say "not yet covered"). */
  statesNotCovered: string[];
  findings: Finding[];
  summary: {
    potentialGaps: number;
    likelyAddressed: number;
    review: number;
    statesWithPotentialGaps: number;
  };
}
