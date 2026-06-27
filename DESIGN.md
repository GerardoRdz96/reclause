# Reclause — Design System

> **PRODUCT NAME = Reclause** (tagline: "Fair sign-ups, easy cancellations — in every state."). The spec below was drafted before the rename and argues for keeping "ARL Radar" — IGNORE that naming section; everywhere it says "ARL Radar" the brand is **Reclause**. The color/type/layout system stands as written.

---

# ARL Radar — DESIGN-SYSTEM SPEC (build-from)

Working brand name decision: **Renewal Radar** is too generic; commit to **"ARL Radar"** as the product wordmark, with the descriptor line **"by Penguin Alley."** Reasoning: "ARL" (Auto-Renewal Law) reads precise and technical to the operator audience, "Radar" carries the existing PA radar family, and it sidesteps the fear-y "compliance scanner" register. Everywhere the product is named, render it `ARL Radar` (sans) — never stylize the "Radar" with a sweep/target glyph (that pushes toward the scare pole).

The current `arl-radar/app/globals.css` is the rebuild base, not a restart. It is already restrained-editorial. This spec replaces the four weak links (system font stack, generic Tailwind `blue-700` accent, CSS-gradient faux-penguin mark, no product visual) and tightens the rest. Keep: the `max-width:1080px` container, the amber-not-red status system, `border-left:4px` finding cards, the `--paper-2` section tint concept (warmed), 17px/1.55 body.

---

## 1. BRAND ATTRIBUTES + NORTH STAR

**Attributes:** Credible · Warm · Precise · Calm · Transparent · Confident.

**Design north star (one line):** *"A knowledgeable peer hands you a sourced, plain-English map of where your flows might miss a state's auto-renewal law — calm and cited, never a scare-funnel."*

Decision rule for any judgment call: authority comes from **specificity + citation + recency**, warmth comes from **plain language + soft geometry + one human accent**. If a design choice adds severity (red, locks, radar-sweeps, "AT RISK"), reject it.

---

## 2. COLOR — full palette (LIGHT primary; dark NOT default)

Decision: **Light-mode primary, single theme.** No dark hero, no dark default. Dark + legal + scanner = the fear pole. (A future dark "results console" view is out of scope for v1 — do not build it.) Never pure black, never pure white, never raw Tailwind `slate`/`zinc`.

The accent stays in the **PA blue family** (brand-true + the near-universal fintech/legal-adjacent trust signal) but is **deepened toward navy and pulled off generic Tailwind `blue-700` `#1d4ed8`** — that exact value is the AI-tell. We commit to a deep, slightly-warm navy as the dominant brand color and reserve a brighter blue only for links/hover. One warm secondary (PA yellow) used as a thin accent only. Status colors are the product's visual core and are amber-never-red.

```css
:root {
  /* Brand — deep warm navy dominant, brighter blue for links only */
  --brand:        #14365f;  /* deep warm navy — primary brand, headers, solid CTAs */
  --brand-deep:   #0e2747;  /* darker navy — CTA hover, dark bands */
  --link:         #2356c9;  /* brighter blue — inline links + hover ONLY (not fills) */
  --link-hover:   #14365f;

  /* Warm secondary — PA yellow, thin accent only (underlines, icon fills, one CTA on dark) */
  --warm:         #f5c518;

  /* Ink + neutrals — WARMED (navy-ink, steel body), not slate/zinc */
  --ink:          #0e1b2b;  /* warm deep navy-ink for headings (not #0f1115 near-black) */
  --ink-soft:     #41506a;  /* steel body text — softer than clinical grey */
  --muted:        #6b7280;  /* meta, captions */
  --faint:        #9aa3b2;  /* disabled, fine meta */

  /* Surfaces — warm off-white, NOT cool grey */
  --paper:        #fbfaf8;  /* warm paper canvas (NOT #ffffff) */
  --paper-2:      #f6f4f0;  /* warm section tint (NOT cool #f7f8fa) */
  --surface:      #ffffff;  /* card surface — true white reads as "lifted" against warm paper */
  --line:         #e7e2d9;  /* warm hairline border */
  --line-strong:  #d9d3c8;  /* warm border on interactive/active */

  /* Semantic status — caution not alarm (the product's core) */
  --gap:    #b45309;  --gap-bg:    #fdf3e3;  /* amber-700 — "potential gap" */
  --ok:     #15803d;  --ok-bg:     #eef6f0;  /* green-700 — "likely addressed" (soft bg) */
  --review: #4338ca;  --review-bg: #eef0fc;  /* indigo — "worth review" (most neutral) */
  --danger: #b91c1c;  /* TRUE errors only (failed scan/parse). NEVER for gaps. */

  /* Depth — 2 real elevation levels, not shadow-on-everything */
  --shadow-1: 0 1px 2px rgba(14, 27, 43, 0.05);                              /* resting cards */
  --shadow-2: 0 1px 2px rgba(14, 27, 43, 0.05), 0 10px 28px rgba(14, 27, 43, 0.07); /* active result / floating frame */

  --radius:    14px;  --radius-sm: 10px;  --radius-lg: 20px;  --radius-pill: 999px;
  --maxw: 1080px;  --maxw-prose: 70ch;
}
```

60/30/10 commitment: ~60% warm paper/surface, ~30% navy-ink/steel structure & text, ~10% the blue accent + the one yellow touch. Status colors live only inside results UI, kept desaturated so the page reads calm and authoritative, not alarmist.

---

## 3. TYPOGRAPHY

Decision: **all-sans for UI + body, ONE serif used sparingly for the hero headline and statute pull-quotes, mono for every citation/code/date.** Self-host all three via `next/font/google` (zero CLS, privacy/CWV win). The serif is the single differentiator that says "we actually read the statutes" without tipping into law-firm-serif-everywhere.

```ts
// app/layout.tsx
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
const inter   = Inter({ subsets:["latin"], variable:"--font-sans", display:"swap" });
const serif   = Newsreader({ subsets:["latin"], variable:"--font-serif", display:"swap", style:["normal","italic"] });
const mono    = JetBrains_Mono({ subsets:["latin"], variable:"--font-mono", display:"swap" });
```

```css
--font-sans: var(--font-sans), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-serif: var(--font-serif), Georgia, "Times New Roman", serif;
--font-mono: var(--font-mono), ui-monospace, "SF Mono", Menlo, monospace;
body { font-feature-settings: "ss01","cv05"; } /* friendlier single-story a/g on Inter */
```

**Pairing rules:**
1. Serif (Newsreader) is for: the H1 hero headline ONLY on the homepage, the per-state H1, and verbatim statute pull-quote blocks. Nowhere else. Weights 400–500, never bold-heavy.
2. Inter handles all other headings, all body, all UI. Display headings: weight 600, `letter-spacing:-0.02em`, line-height ~1.12.
3. Mono (JetBrains) is reserved for: statute citations (`Cal. Bus. & Prof. Code § 17602`), state codes, effective dates, numeric counts. Small mono labels: `text-transform:uppercase; letter-spacing:0.06em`. Use `font-variant-numeric: tabular-nums` on all counts/scores so columns align.

**Type scale:**
| Token | Font | Size | Weight | LH | Tracking |
|---|---|---|---|---|---|
| Display (hero H1) | Newsreader | `clamp(2.3rem, 5vw, 3.5rem)` | 500 | 1.08 | -0.02em |
| H1 (state page) | Newsreader | `clamp(2rem, 4vw, 2.8rem)` | 500 | 1.12 | -0.02em |
| H2 | Inter | `clamp(1.5rem, 3vw, 2.1rem)` | 600 | 1.15 | -0.02em |
| H3 | Inter | `1.2rem` | 600 | 1.25 | -0.01em |
| Lead | Inter | `1.2rem` | 400 | 1.5 | normal |
| Body | Inter | `1.0625rem` (17px) | 400 | 1.55 | normal |
| Small / meta | Inter | `0.875rem` | 500 | 1.45 | normal |
| Mono label | JetBrains | `0.8rem` | 500 | 1.4 | 0.06em, uppercase |
| Citation | JetBrains | `0.875rem` | 400 | 1.45 | normal |

Prose measure: body `max-width: 70ch`. Line length is itself an anti-intimidation move — dense small text reads "fine print / legalese."

---

## 4. LAYOUT & SPACING

**Grid:** 12-col, `--maxw:1080px` content, `--maxw-prose:70ch` for long-form. Gutters 24px (16px mobile). Spacing scale (use these only): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px`. **Vary vertical rhythm** — do not put every section on the same `py`. Hero ~72–96, dense info sections ~48, the results moment gets the most air.

**Homepage section sequence** (follows the proven dev-tool order; current page is missing the trust block, product shot, social proof, and FAQ — add them):
1. **Sticky header** — wordmark + nav + one pill CTA.
2. **Hero** — left-aligned eyebrow (mono, uppercase: `FREE TOOL · 11 JURISDICTIONS · CITED STATUTES`) → serif H1 (question framing: keep "Where might your subscription flow miss a US auto-renewal law?") → Inter lead → two distinct CTAs → privacy risk-reducer microcopy with a small lock icon. **Right/below: the product shot** — a real, slightly-faded results-screen mock in a soft floating frame (`--shadow-2` + faint top-edge highlight). This is the #1 conversion gap to close.
3. **Trust belt** — 4 big mono numbers, horizontal: `11 jurisdictions · 73 cited requirements · 0 data sent to a server · MIT open dataset`. (Provenance > logos for an unknown brand.)
4. **How it works** — 3 steps, but NOT three identical equal-height icon-cards. Use a numbered horizontal flow or asymmetric layout; vary the treatment.
5. **Educational stat cards** (keep the existing $2,500-penalty / no-federal-floor content) — below the trust belt, clearly "context" not "trust."
6. **Social proof** — one curated quote (from the 48h test or a founder). One honest review beats none; never fabricate.
7. **FAQ accordion** — "Do you store my data?", "Can I use it without an account?", "Is this legal advice?", "How current is the data?" Doubles as GEO content + pre-empts trust objections.
8. **Final CTA band** — dark navy band, the one yellow CTA. Low-pressure, value-first.
9. **Footer** — see §5.

**Scan-results layout** (the most load-bearing screen):
- **Focal scorecard header** (replace the flat blue bar): a single large honest summary — `N potential gaps across M states` (count, NOT a fake "73/100 compliance score" — that re-invites the liability `/roast` killed). Below it, three status-count pills (gap / worth-review / likely-addressed) in their semantic colors. The honesty IS the design: three colors, no verdict.
- **The calm disclaimer inset** sits directly above the results (see §5), styled in the neutral/review palette — never amber, never red.
- **Per-state blocks** → **per-requirement finding cards** (`border-left:4px` in the status color). Each card: status tag → requirement in plain English → "why this flagged" → mono statute citation → "Read the statute →" link. Show green "likely addressed" findings too, and indigo "worth review / we can't tell from a questionnaire" items — a tool that only finds problems reads as a sales funnel.
- **Results stay ungated** — no email wall. The lead capture is the optional contextual service CTA placed AFTER the gaps, framed as relief: "Found gaps you want fixed? Penguin Alley implements the technical changes you or your attorney specify." Add an "Export / print this report" secondary action (they can take it to a lawyer = more trust + return visits).

**Per-state page layout** (`/states/[code]` — the GEO/SEO engine):
- Breadcrumb (`← All states`) → serif H1 "[State] subscription auto-renewal law" → mono effective/last-reviewed date line → the calm educational-disclaimer inset → "The statute" with cited `source_url` link → requirements grouped by `CATEGORY_LABELS`, **answer-first** (one plain-English sentence under each requirement heading, THEN the mono citation — this is what AI engines quote) → "Check your flow against [State]'s law →" CTA deep-linked to the scanner prefilled to that state → internal-link mesh to 3–4 related states. Prose at 70ch. Keep FAQPage JSON-LD; add `dateModified`.

---

## 5. COMPONENTS

**Buttons (pill, `--radius-pill`):**
- `.btn-primary` — solid `--brand` navy, white text, `--shadow-1`; hover `--brand-deep` + `translateY(-1px)`.
- `.btn-secondary` — `--surface` bg, 1.5px `--line-strong` border, `--ink` text; hover `--paper-2`.
- `.btn-warm` — `--warm` yellow bg, `--ink` text. ONLY on the dark final-CTA band. Never on light surfaces.
- `.btn-ghost` — text + `--link`, underline-on-hover; for tertiary ("Export", "View data on GitHub").
- All buttons: real `:focus-visible` ring (`box-shadow: 0 0 0 3px rgba(35,86,201,0.35)`), product-specific verbs ("Run the free scan →"), never "Get started."

**Cards:** two elevation roles, not one uniform shadow. Resting cards (`.card`): `--surface`, 1px `--line`, `--shadow-1`, `--radius`. Active/floating result + the hero product frame: `--shadow-2` + a faint top-edge highlight (`border-top:1px solid rgba(255,255,255,0.8)` over the shadow). Finding cards: `border-left:4px` in status color, `--radius-sm`.

**Question wizard (the scanner):** one question per step, left-aligned, large readable radio/checkbox targets (min 44px), a slim top progress bar that count-up animates as steps complete. Plain-English questions ("After signup, can a customer cancel online in the same number of steps it took to subscribe?"). No multi-column dense forms. A persistent "Your answers stay in your browser — nothing is sent to a server" reassurance with a lock icon. Empty + in-progress + error states all designed.

**Results / findings list:** see §4. Status tag = a small outline pill (uppercase mono micro-label) in the status color — outline, NOT a filled alarm badge. Status icon = Lucide line icon, single stroke: gap = small triangle/dot (outline amber), addressed = check, review = eye/magnifier. Never emoji, never filled red alert triangles.

**Disclaimer treatment (an ASSET, not fine print):** a calm inset card, normal body size, in the neutral/review palette (`--review-bg` / `--paper-2` bg, `--ink-soft` text, small neutral info icon). Appears (a) inline directly above every results view and above each state page's content, and (b) a persistent quiet footer line, and (c) a full `/disclaimer` page. Copy: *"This is an educational tool, not legal advice. It compares the flow you describe against published statutes to surface areas worth a closer look. For decisions, talk to a lawyer."* Pair it with a "How this works / methodology / last updated [date]" link — that pairing flips it from CYA to transparency. NEVER red, NEVER all-caps, NEVER a full-screen modal gate.

**Nav:** sticky, `rgba(251,250,248,0.86)` warm-paper blur, 1px `--line` bottom. Left: real PA SVG mark (see §9 — NOT the CSS-gradient faux-penguin) + "ARL Radar" wordmark in Inter 700, `-0.03em`. Right: States · Methodology · GitHub + one `.btn-primary` pill ("Run the scan"). Mobile: collapse to a sheet.

**Footer:** warm-paper, multi-column: product links · "View the data on GitHub" + "Suggest a correction" + "MIT licensed" badge · the persistent disclaimer line · "Built by Penguin Alley" with the real mark · "Last updated [date]." Provenance + recency + a real company = the trust currency for a free tool from an unknown brand.

---

## 6. MOTION

Decision: **one orchestrated moment, everything else calm.** Respect `prefers-reduced-motion` globally (no exceptions).

DO: a single staggered reveal of the state result cards when the scan "runs" (~60ms stagger, fade + 8px rise); a subtle count-up on the scorecard number and the trust-belt numbers when they enter the viewport; a calm hover-lift on result/state rows (`translateY(-1px)` + shadow step, ~120ms); a slim progress bar in the wizard.

DO NOT: animate every element independently on scroll (the slop tell), autoplay carousels, parallax, gradient-mesh/aurora motion, glassmorphism beyond the single header blur, scale-bounce on buttons, or any literal radar-sweep / scanning-for-threats animation (it tips the product into the fear register the name already risks).

---

## 7. VOICE & MICROCOPY

Tone: a knowledgeable peer who respects your time and isn't trying to scare you into buying. Plain English, second person, calm, specific. Curiosity/clarity framing, never risk/fear framing. No hype verbs ("empower/unlock/seamlessly"), no "Jane Doe / Acme," no em dashes (use periods/commas — matches Gera's voice rule), no guru framing.

**Example copy:**
- Eyebrow: `FREE TOOL · 11 JURISDICTIONS · CITED STATUTES`
- H1: "Where might your subscription flow miss a US auto-renewal law?"
- Lead: "Check how your signup and cancellation flows line up with each state's auto-renewal rules. See the exact statute behind every flag. No account, no data leaves your browser."
- Primary CTA: "Run the free scan →" · Secondary: "Browse the state laws"
- Risk-reducer: "No signup. No account. Your answers stay in your browser. Nothing is sent to a server."
- Scorecard: "2 potential gaps across 11 states" (count, never a graded verdict)
- Gap card label: `POTENTIAL GAP` (amber outline) — with body "Worth a look, based on the text of [statute] as of [date]." Never "VIOLATION" / "AT RISK."
- Service CTA: "Found gaps you want fixed? Penguin Alley implements the technical changes you or your attorney specify. We do the engineering and UX work, not the legal opinion."
- Disclaimer: the §5 copy — honest, human, normal-sized.
- Empty state: "Answer a few questions about your flow and we'll map it against each state's rules. Takes about two minutes."
- Error state: "Something broke on our end loading the dataset. Refresh, or open an issue on GitHub." (true `--danger` red is allowed here only.)

---

## 8. ANTI-SLOP CHECKLIST (ship gate — any unchecked item = still reads AI-generated)

MUST AVOID:
- [ ] Primary accent NOT generic Tailwind `blue-700 #1d4ed8`, NOT the indigo/violet/purple band `#6366F1`–`#A855F7`.
- [ ] No diagonal blue→purple gradient hero, no aurora/mesh blobs, no gradient-text headlines.
- [ ] No pure `#000`/`#fff`; neutrals are warm, not raw `slate`/`zinc`; text is not `slate-900` on white.
- [ ] Fonts are self-hosted Inter + Newsreader + JetBrains Mono — NOT the system-ui default stack (the current biggest tell), NOT Inter-for-everything-one-weight.
- [ ] The CSS-gradient faux-penguin `.brand-mark` is replaced with the real PA SVG asset.
- [ ] Not everything centered (hero is left-aligned); no row of three identical equal-height icon-cards.
- [ ] No emoji as icons/bullets — one Lucide line set, uniform stroke.
- [ ] Not one uniform radius + one uniform shadow on every surface (2 elevation levels exist).
- [ ] Section vertical rhythm varies; not every section the same `py`.
- [ ] No em dashes, no hype verbs, no fabricated testimonials.
- [ ] "Gap" state is amber, NOT alarm-red; no red anywhere except true errors; no padlock/shield/gavel/radar-sweep imagery.

MUST HIT:
- [ ] One dominant navy + one decisive blue accent + one yellow touch (60/30/10).
- [ ] Real type hierarchy: serif display + Inter body + mono citations, obvious weight/size jumps.
- [ ] The hero shows the REAL product (results screen / per-state report), not an illustration.
- [ ] Every flagged requirement cites a linked statute; "last updated" date visible; concrete numbers ("11 jurisdictions, 73 requirements").
- [ ] Disclaimer is a designed calm inset paired with a methodology link, not a footnote or a modal.
- [ ] Results ungated; one orchestrated reveal; real empty/loading/error/focus states; `prefers-reduced-motion` honored.

---

## 9. README / SOCIAL ASSETS

Real PA SVG mark required everywhere (penguin-head silhouette over circle — NOT the CSS hack, NOT AI-generated; source the white lockup `penguinalley-landing/public/images/pa-logo-white.png` / the SVG mark). PA imagery, if any, = one warm collaborative illustrated penguin scene, never dark/ominous, never a pasted composite, used at most once (hero or empty-state), restraint reads as confidence.

**README needs:**
- **Banner** (`~1280×640`): warm-paper bg `#fbfaf8`, "ARL Radar" in Newsreader, tagline in Inter, the real PA mark, and a cropped real screenshot of a per-state finding card with a mono statute citation visible. No stock imagery, no gradient.
- **Screenshots** (2–3): the results scorecard + finding cards, a per-state page, the wizard. Real UI, framed in a soft `--shadow-2` floating frame with the faint top-edge highlight (Linear-style), on warm paper.
- **Badges:** MIT license, "11 jurisdictions · 73 cited requirements," last-updated date.
- A "Methodology" section styled like documentation (Plausible / securityheaders.com register): deterministic engine (no LLM decides compliance), open cited dataset, the curation process described in human terms.

**OG / social card** (`1200×630`): warm-paper bg, left-aligned serif headline "Check your subscription flows against US auto-renewal law," a mono sub-line "Free. Cited. 11 jurisdictions.", the real PA mark, and a faded real finding-card visual on the right in the floating frame. One blue accent + the yellow touch. NO purple gradient, NO stock people, NO law-firm columns/gavel, NO emoji.