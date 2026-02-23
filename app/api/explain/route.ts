import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
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
  } = await req.json()

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
}
