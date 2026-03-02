import { generateText } from "ai"
import { z } from "zod"

export const maxDuration = 30

const explainRequestSchema = z.object({
  schemeName: z.string().min(1),
  schemeDescription: z.string().min(1),
  schemeBenefits: z.string().min(1),
  schemeDocuments: z.array(z.string().min(1)).min(1),
  schemeApplicationProcess: z.string().min(1),
  matchScore: z.number().int().min(0).max(100),
  matchReasons: z.array(z.string()).default([]),
  missedReasons: z.array(z.string()).default([]),
  userName: z.string().min(1),
  userAge: z.number().int().min(0).max(120),
  userGender: z.string().min(1),
  userOccupation: z.string().min(1),
  userState: z.string().min(1),
  userIncome: z.number().int().min(0),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = explainRequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request payload for explanation generation." },
        { status: 400 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "AI explanation is not configured. Missing OPENAI_API_KEY." },
        { status: 503 },
      )
    }

    const {
      schemeName,
      schemeDescription,
      schemeBenefits,
      schemeDocuments,
      schemeApplicationProcess,
      matchScore,
      matchReasons,
      missedReasons,
      userName,
      userAge,
      userGender,
      userOccupation,
      userState,
      userIncome,
    } = parsed.data

    const prompt = `You are YojanaSaarthi AI, a friendly and knowledgeable government scheme advisor for Indian citizens. You speak clearly, warmly, and in simple English.

A citizen named ${userName} (age ${userAge}, ${userGender}, ${userOccupation}, from ${userState}, annual income Rs.${userIncome}) has been matched with a government scheme.

SCHEME DETAILS:
- Name: ${schemeName}
- Description: ${schemeDescription}
- Benefits: ${schemeBenefits}
- Documents needed: ${(schemeDocuments as string[]).join(", ")}
- How to apply: ${schemeApplicationProcess}
- Match score: ${matchScore}%

WHY IT MATCHES:
${(matchReasons as string[]).map((r: string) => `- ${r}`).join("\n")}

${(missedReasons as string[]).length > 0 ? `POTENTIAL CONCERNS:\n${(missedReasons as string[]).map((r: string) => `- ${r}`).join("\n")}` : "No major concerns."}

Please provide a personalized explanation in 4-5 short paragraphs covering:
1. Why this scheme is relevant for ${userName} specifically
2. What concrete benefits they would receive
3. Key documents to keep ready
4. Simple steps to apply
5. Any important things to be aware of

Keep it conversational, helpful, and under 250 words. Do not use markdown headers or bullet points - write in flowing paragraphs. Address the user by name.`

    const { text, usage, finishReason } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({
      text,
      usage,
      finishReason,
    })
  } catch {
    return Response.json(
      { error: "Unable to generate explanation right now. Please try again." },
      { status: 500 },
    )
  }
}
