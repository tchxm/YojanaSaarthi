"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import type { SchemeMatch, UserProfile } from "@/lib/schemes"
import { getLocalizedSchemeText } from "@/lib/scheme-localizations"

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
  const locale = useLocale()
  const t = useTranslations("AIExplanation")
  const localized = getLocalizedSchemeText(locale, match.scheme)

  const fetchExplanation = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          schemeName: localized.name,
          schemeDescription: localized.description,
          schemeBenefits: localized.benefits,
          schemeDocuments: match.scheme.documents,
          schemeApplicationProcess: match.scheme.applicationProcess,
          matchScore: match.score,
          matchReasons: match.matchReasons,
          missedReasons: match.missedReasons,
          userAge: profile.age,
          userGender: profile.gender,
          userOccupation: profile.occupation,
          userState: profile.state,
          userIncomeRange: profile.incomeRange,
        }),
      })

      if (!response.ok) {
        throw new Error(t("failed"))
      }

      const data = await response.json()
      setExplanation(data.text)
    } catch {
      setError(t("unavailable"))
    } finally {
      setLoading(false)
    }
  }

  if (explanation) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          {t("title")}
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
          {t("retry")}
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
          {t("generating")}
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {t("getExplanation")}
        </>
      )}
    </Button>
  )
}
