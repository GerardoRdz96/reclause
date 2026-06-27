// The questionnaire — one source of truth for the scan wizard.
// "nature" questions decide which requirements apply (boolean: the owner knows their model).
// "practice" questions are tri-state (yes / no / not sure) because owners often don't know.

import type { BusinessProfile } from "./types";

export interface NatureQuestion {
  kind: "nature";
  key: keyof Pick<
    BusinessProfile,
    "autoRenews" | "consumerFacing" | "onlineSignup" | "freeTrial" | "longTermOrAnnual"
  >;
  label: string;
  help?: string;
}

export interface PracticeQuestion {
  kind: "practice";
  key: keyof Pick<
    BusinessProfile,
    | "disclosesTermsBeforeCharge"
    | "getsAffirmativeConsent"
    | "sendsAcknowledgment"
    | "offersOnlineCancellation"
    | "sendsRenewalReminders"
    | "sendsTrialConversionNotice"
    | "sendsPriceChangeNotice"
  >;
  label: string;
  help?: string;
}

export const NATURE_QUESTIONS: NatureQuestion[] = [
  {
    kind: "nature",
    key: "autoRenews",
    label: "Do your subscriptions or memberships renew automatically?",
    help: "If nothing auto-renews, most auto-renewal laws simply don't apply to you.",
  },
  {
    kind: "nature",
    key: "consumerFacing",
    label: "Do you sell to consumers (not only to other businesses)?",
    help: "Most state auto-renewal laws protect consumers; pure B2B is often outside their scope.",
  },
  {
    kind: "nature",
    key: "onlineSignup",
    label: "Can customers sign up online?",
    help: "Online signup triggers rules about online (\"click to cancel\") cancellation in several states.",
  },
  {
    kind: "nature",
    key: "freeTrial",
    label: "Do you offer a free or discounted trial that converts to paid?",
  },
  {
    kind: "nature",
    key: "longTermOrAnnual",
    label: "Do you offer terms of a month or longer (for example, annual plans)?",
  },
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    kind: "practice",
    key: "disclosesTermsBeforeCharge",
    label: "Before charging, do you clearly show the auto-renewal terms (price, how often it renews, that it renews)?",
  },
  {
    kind: "practice",
    key: "getsAffirmativeConsent",
    label: "Do customers give separate, explicit consent to the automatic renewal (for example, a dedicated checkbox or step)?",
  },
  {
    kind: "practice",
    key: "sendsAcknowledgment",
    label: "After signup, do you send a confirmation that includes the renewal terms and how to cancel?",
  },
  {
    kind: "practice",
    key: "offersOnlineCancellation",
    label: "Can a customer who signed up online also cancel online easily, without having to call?",
  },
  {
    kind: "practice",
    key: "sendsRenewalReminders",
    label: "Do you send a reminder before a renewal charge (especially for annual or long terms)?",
  },
  {
    kind: "practice",
    key: "sendsTrialConversionNotice",
    label: "Before a free or discounted trial converts to paid, do you notify the customer?",
  },
  {
    kind: "practice",
    key: "sendsPriceChangeNotice",
    label: "Before a price or material term change, do you notify the customer?",
  },
];

/** A blank profile — nature defaults to false (the wizard FORCES an explicit answer before
 *  advancing), and every practice defaults to "unsure" so an unanswered practice is flagged
 *  for review rather than silently counted as a gap. */
export function emptyProfile(): BusinessProfile {
  return {
    statesServed: [],
    autoRenews: false,
    consumerFacing: false,
    onlineSignup: false,
    freeTrial: false,
    longTermOrAnnual: false,
    disclosesTermsBeforeCharge: "unsure",
    getsAffirmativeConsent: "unsure",
    sendsAcknowledgment: "unsure",
    offersOnlineCancellation: "unsure",
    sendsRenewalReminders: "unsure",
    sendsTrialConversionNotice: "unsure",
    sendsPriceChangeNotice: "unsure",
  };
}

/** The nature-question keys the wizard must collect explicit answers for. */
export const NATURE_KEYS = NATURE_QUESTIONS.map((q) => q.key);
