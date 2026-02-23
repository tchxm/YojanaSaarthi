"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import type { SchemeMatch, UserProfile } from "@/lib/schemes"

export function AIExplanation({
  match,
  profile,
}: {
  match: SchemeMatch
  profile: UserProfile
}) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExplanation = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeName: match.scheme.name,
          schemeDescription: match.scheme.description,
          schemeBenefits: match.scheme.benefits,
          schemeDocuments: match.scheme.documents,
          schemeApplicationProcess: match.scheme.applicationProcess,
          matchScore: match.score,
          matchReasons: match.matchReasons,
          missedReasons: match.missedReasons,
          userName: profile.name,
          userAge: profile.age,
          userGender: profile.gender,
          userOccupation: profile.occupation,
          userState: profile.state,
          userIncome: profile.annualIncome,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI explanation")
      }

      const data = await response.json()
      setExplanation(data.text)
    } catch {
      setError("Unable to generate AI explanation. The explanation engine may be temporarily unavailable.")
    } finally {
      setLoading(false)
    }
  }

  if (explanation) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Powered Analysis
        </div>
        <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
          {explanation}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchExplanation} className="mt-2 bg-transparent">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={fetchExplanation}
      disabled={loading}
      className="gap-2 bg-transparent"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Get AI Explanation
        </>
      )}
    </Button>
  )
}
