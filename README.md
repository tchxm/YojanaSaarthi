# YoojanaSaarthi 2.0

YoojanaSaarthi 2.0 is a Next.js application for deterministic government-scheme discovery with explainable scoring, policy-aware prioritization, and optional AI explanation.

## What It Solves

- Converts scheme policies into explicit eligibility checks.
- Prevents generic “sum everything” outputs by separating benefit types.
- Ranks by policy intent, not only raw score.
- Shows why a scheme matched or was disqualified.

## Current System Design

The engine is split into four layers:

1. Legal Eligibility Layer
- Hard disqualifiers only (binary pass/fail).
- Examples: age, gender, state, max income, BPL/rural, pregnancy, street-vendor, artisan, head-of-household, occupation/category restrictions.

2. Policy Targeting Layer
- Per scheme metadata:
  - `targetType`: `welfare | universal | financial`
  - `incomeSensitivity`: `high | medium | low`
  - `benefitType`: `cash | insurance | loan | subsidy`
  - `isAdditive`: `boolean`
  - `targetStrength`: `primary | secondary | general`

3. Relevance Scoring Layer
- Weighted scoring with per-criterion breakdown.
- Income scoring is sensitivity-aware (not a single generic curve).
- Policy-fit multiplier dampens welfare relevance for high-income profiles.
- Includes dynamic tier elevation/demotion for profile-aware priority.

4. Benefit Interpretation Layer
- No blind annual-value summation.
- Results are shown as four separate cards:
  - `Direct Support Total`
  - `Insurance Coverage Potential`
  - `Loan Access Potential`
  - `Conditional Support`

## Ranking Model

Results are sorted by:

1. `effectiveTargetStrength` (dynamic profile-aware tier)
2. `score`
3. `confidence`

This ensures policy intent can outrank generic high scores.

## Validation Model

Profile intake uses Zod schemas (`lib/profile-schema.ts`) and step-wise gating.

Validated constraints include:

- Name: letters/spaces/apostrophe, 2-50 chars
- Age: integer, 15-100
- Annual Income: integer, 0 to 10 crore
- Required: gender, state, occupation, category
- Logical conflict checks (example: non-female + pregnant is blocked)

## AI Explanation

- Endpoint: `app/api/explain/route.ts`
- Uses `@ai-sdk/openai` with `OPENAI_API_KEY`
- AI is optional and does not affect deterministic eligibility results
- UI surfaces actionable error messages from API failures

## Environment

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_key
```

If AI explanation fails:

1. Check key is present in `.env.local`
2. Restart dev server after env changes
3. Verify OpenAI account quota/billing

## Local Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - lint checks
- `pnpm test:scenarios` - scenario-based engine checks
- `pnpm check` - build + scenario checks

## Key Files

```text
app/api/explain/route.ts       AI explanation route
components/profile-form.tsx    Multi-step profile intake + Zod gating
components/results-dashboard.tsx
                               Results grouping + 4 benefit cards
components/ai-explanation.tsx  AI trigger + error handling
lib/profile-schema.ts          Shared Zod schemas
lib/schemes.ts                 Scheme registry + rule engine + ranking
scripts/test-scenarios.js      Scenario regression suite
```

## Notes

- This tool is guidance-first, not legal entitlement determination.
- Users should always verify final eligibility on official portals.
