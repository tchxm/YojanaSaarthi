# YojanaSaarthi 2.0

YojanaSaarthi 2.0 is a Next.js app for deterministic government scheme discovery with explainable scoring, policy-aware ranking, and optional AI explanation.

## What It Solves

- Converts policy rules into explicit eligibility checks.
- Avoids naive "sum everything" benefit estimates.
- Prioritizes targeted welfare intent over broad generic schemes.
- Shows why each scheme matched or was disqualified.

## Product Surfaces

- `/discover`: multi-step profile intake and eligibility matching.
- `/results`: profile summary, 4 benefit cards, state-first + central-by-alignment results.
- `/schemes`: policy library for browsing all schemes with filters (category/level/state).
- Home page includes an "Explore Popular Schemes" section with quick actions.

## Current Matching Model

The engine in `lib/schemes.ts` is split into layers:

1. Hard Eligibility Layer
- Binary disqualification checks only.
- Examples: age, gender, state, income cap, BPL/rural, pregnancy, street vendor, artisan, head-of-household, occupation/category restrictions.

2. Policy Targeting Metadata
- Per-scheme metadata:
  - `targetType`: `welfare | universal | financial`
  - `incomeSensitivity`: `high | medium | low`
  - `benefitType`: `cash | insurance | loan | subsidy`
  - `isAdditive`: `boolean`
  - `targetStrength`: `primary | secondary | general`

3. Weighted Relevance Scoring
- Per-criterion weighted score with explanation breakdown.
- Income-range-aware scoring (not exact-income input).
- Policy-fit multiplier for targeting relevance.
- Tunings include:
  - Generic insurance schemes (e.g. PMJJBY/PMSBY) capped to avoid outranking targeted welfare.
  - Broad pension-style financial products dampened for high welfare-need profiles without pension intent.

4. Benefit Interpretation
- Benefits are shown in four separate buckets:
  - `Direct Support`
  - `Insurance Cover`
  - `Loan Access`
  - `Conditional`
- Mutually exclusive scholarship-like schemes are treated as alternatives (best one counted, not stacked).

## Results Ordering

`/results` renders in this sequence:

1. Benefit cards (Direct/Insurance/Loan/Conditional)
2. State schemes (matching selected state)
3. Central schemes grouped by alignment:
  - High Alignment
  - Moderate Alignment
  - Limited Alignment

## Validation Model

Profile intake uses Zod schemas in `lib/profile-schema.ts`.

Current key validations:

- Age: integer, 15-100
- Income: range select (`<1L`, `1-3L`, `3-5L`, `5-10L`, `10L+`)
- Required: gender, state, district, occupation, income range, category, goals
- Logical conflict checks (e.g. non-female + pregnant blocked)

## AI Explanation

- Endpoint: `app/api/explain/route.ts`
- Uses `@ai-sdk/openai` with `OPENAI_API_KEY`
- AI does not affect deterministic eligibility/scoring

## Setup

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_key
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint checks
- `npm run test:scenarios` - scenario-based engine checks
- `npm run check` - build + scenario checks

## Key Files

```text
app/api/explain/route.ts          AI explanation route
components/profile-form.tsx       Multi-step profile intake
components/results-dashboard.tsx  Results grouping and metrics
components/schemes-library.tsx    Explore schemes library page
lib/profile-schema.ts             Shared Zod schemas
lib/schemes.ts                    Scheme data + rules + scoring + benefit math
scripts/test-scenarios.js         Scenario regression suite
```

## Notes

- This tool is guidance-first, not a legal entitlement determination.
- Final eligibility should always be verified on official portals.

