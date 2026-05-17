import { generateText } from "ai"
import { z } from "zod"

export const maxDuration = 30

const profileSchema = z.object({
  age: z.number().int().min(0).max(120),
  gender: z.string().min(1),
  state: z.string().min(1),
  district: z.string(),
  occupation: z.string().min(1),
  incomeRange: z.string().min(1),
  category: z.string().min(1),
  isRural: z.boolean(),
  isBPL: z.boolean(),
  isPregnant: z.boolean(),
  isStreetVendor: z.boolean(),
  isArtisan: z.boolean(),
  isHeadOfHousehold: z.boolean(),
  goals: z.array(z.string()),
})

const actionPlanRequestSchema = z.object({
  locale: z.string().optional().default("en"),
  profile: profileSchema,
  benefitBreakdown: z.object({
    directSupportTotal: z.number(),
    insuranceCoverageTotal: z.number(),
    loanAccessPotential: z.number(),
    conditionalSupportTotal: z.number(),
  }),
  matches: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        benefits: z.string().min(1),
        score: z.number().int().min(0).max(100),
        confidence: z.number().int().min(0).max(100),
        documents: z.array(z.string().min(1)),
        applicationProcess: z.string().min(1),
        reasons: z.array(z.string()),
        concerns: z.array(z.string()),
      }),
    )
    .min(1)
    .max(5),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = actionPlanRequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid action plan request." }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "AI action plan is not configured. Missing OPENAI_API_KEY." },
        { status: 503 },
      )
    }

    const { locale, profile, benefitBreakdown, matches } = parsed.data
    const languageInstruction =
      locale === "hi"
        ? "Respond fully in simple Hindi."
        : locale === "kn"
          ? "Respond fully in simple Kannada."
          : "Respond fully in simple English."

    const schemeSummary = matches
      .map(
        (match, index) => `${index + 1}. ${match.name}
Score: ${match.score}%, confidence: ${match.confidence}%
Benefits: ${match.benefits}
Documents: ${match.documents.join(", ")}
Apply: ${match.applicationProcess}
Why matched: ${match.reasons.join("; ") || "No reasons provided"}
Concerns: ${match.concerns.join("; ") || "No major concerns"}`,
      )
      .join("\n\n")

    const prompt = `You are YojanaSaarthi AI, a practical government scheme application guide for Indian citizens. ${languageInstruction}

Create a complete, citizen-friendly action plan for this profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Location: ${profile.district ? `${profile.district}, ` : ""}${profile.state}
- Rural: ${profile.isRural ? "yes" : "no"}
- BPL: ${profile.isBPL ? "yes" : "no"}
- Occupation: ${profile.occupation}
- Income range: ${profile.incomeRange}
- Category: ${profile.category}
- Special flags: pregnant=${profile.isPregnant}, streetVendor=${profile.isStreetVendor}, artisan=${profile.isArtisan}, womanHeadOfHousehold=${profile.isHeadOfHousehold}
- Goals: ${profile.goals.join(", ") || "not specified"}

Estimated opportunity:
- Direct support: Rs.${benefitBreakdown.directSupportTotal.toLocaleString("en-IN")}
- Insurance cover: Rs.${benefitBreakdown.insuranceCoverageTotal.toLocaleString("en-IN")}
- Loan access: Rs.${benefitBreakdown.loanAccessPotential.toLocaleString("en-IN")}
- Conditional support: Rs.${benefitBreakdown.conditionalSupportTotal.toLocaleString("en-IN")}

Priority schemes:
${schemeSummary}

Write under 320 words. Include:
1. The exact order to apply in and why
2. Documents to prepare first
3. Where the citizen should go or which portal/office type to use
4. What to ask the official/operator in one simple sentence
5. Any risk or verification warning

Do not promise approval. Do not say the benefit is guaranteed. Keep it practical and warm. Use short paragraphs, not markdown tables.`

    const { text, usage, finishReason } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 650,
      temperature: 0.45,
    })

    return Response.json({ text, usage, finishReason })
  } catch {
    return Response.json(
      { error: "Unable to generate action plan right now. Please try again." },
      { status: 500 },
    )
  }
}
