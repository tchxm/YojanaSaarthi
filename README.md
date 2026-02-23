# YoojanaSaarthi 2.0

YoojanaSaarthi 2.0 is a full-stack Next.js application that helps citizens discover relevant government schemes using deterministic eligibility rules, explainable scoring, and optional AI-generated guidance.

## Why This Project

Many eligible citizens miss benefits because scheme information is fragmented, criteria are hard to interpret, and there is no personalized eligibility view.

YoojanaSaarthi 2.0 addresses this by:

- Converting scheme policies into deterministic eligibility rules
- Ranking matches with transparent score breakdowns
- Showing disqualification reasons clearly
- Estimating annual value from likely eligible schemes
- Providing document and application guidance in one place

## What Changed in v2

- End-to-end flow polished (`/` -> `/discover` -> `/results`)
- Enhanced scoring transparency with per-criterion breakdown
- Improved hard-disqualification logic for strict eligibility constraints
- Added support for special gating (for example: pregnancy and street-vendor constraints)
- Expanded scenario validation suite to **50** test scenarios
- Scheme registry expanded to **23** schemes in `lib/schemes.ts`

## Features

- Multi-step profile intake (personal, location, occupation, goals)
- Deterministic rule engine with weighted relevance scoring
- Eligibility grouped into:
  - Highly Eligible (`>= 80`)
  - Also Eligible (`60-79`)
  - May Be Eligible (`1-59`)
- Rich scheme cards with:
  - Benefits
  - Required documents
  - Application process
  - Official portal links
  - Criterion-by-criterion score explanation
- Optional AI explanation endpoint (`app/api/explain/route.ts`)

## Architecture Overview

1. Profile Intake Layer: Structured user inputs via `components/profile-form.tsx`
2. Rule Engine Layer: Hard checks + weighted scoring in `lib/schemes.ts`
3. Ranking Layer: Sorted recommendations with grouped eligibility in `components/results-dashboard.tsx`
4. Explanation Layer: User-triggered AI explanation in `components/ai-explanation.tsx` + `/api/explain`
5. Validation Layer: Scenario regression checks in `scripts/test-scenarios.js`

AI does not determine eligibility. Eligibility is computed by deterministic rule logic.

## Scoring Model (v2)

Total score is capped at 100 and uses these weights:

- Occupation: 20
- Income: 15
- Category: 10
- Age: 10
- Gender: 10
- BPL/Rural: 10
- State: 5
- Goals: 15
- Specificity bonus: 5

Schemes that fail hard checks (age, gender, state, BPL/rural, income cap, occupation, category, pregnancy/street-vendor constraints) are disqualified and excluded from results.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- AI SDK (`ai`)
- Vercel Analytics

## Local Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` for AI explanation generation:

```bash
OPENAI_API_KEY=your_key_here
```

If the key is missing or model calls fail, the UI shows an explanation error state with retry support.

## Scripts

- `pnpm dev` - Run development server
- `pnpm build` - Create production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint
- `pnpm test:scenarios` - Run scenario-based eligibility tests
- `pnpm check` - Run build + scenario tests

## Project Structure

```text
app/
  api/explain/route.ts        # AI explanation API endpoint
  discover/page.tsx           # profile intake route
  results/page.tsx            # match results route
components/
  profile-form.tsx            # multi-step intake form
  results-dashboard.tsx       # grouping, metrics, and rendered matches
  scheme-card.tsx             # scheme detail card + score breakdown
  ai-explanation.tsx          # client trigger for AI explanation
lib/
  schemes.ts                  # scheme registry + matching engine
scripts/
  test-scenarios.js           # scenario regression suite
```

## Validation

Run:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm test:scenarios
```

Scenario suite currently contains **50** coverage cases, including boundary and overflow checks for age, income, pregnancy-gated schemes, street-vendor constraints, and Stand Up India special logic.

## Notes

- This app is for guidance and discovery, not legal entitlement determination.
- Final eligibility must be confirmed on official government portals.
