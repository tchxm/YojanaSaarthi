"use client"

import { useMemo, useState } from "react"
import { useLocale } from "next-intl"
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Landmark,
  Loader2,
  MapPinned,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BenefitBreakdown, SchemeMatch, UserProfile } from "@/lib/schemes"
import { getLocalizedSchemeText } from "@/lib/scheme-localizations"

type ActionPlanProps = {
  matches: SchemeMatch[]
  profile: UserProfile
  benefitBreakdown: BenefitBreakdown
}

const formatCurrency = (value: number) => `Rs.${value.toLocaleString("en-IN")}`

function uniqueItems(items: string[], limit: number) {
  return Array.from(new Set(items.filter(Boolean))).slice(0, limit)
}

function getOfficeHint(match: SchemeMatch) {
  const process = match.scheme.applicationProcess.toLowerCase()
  if (process.includes("bank")) return "Bank branch"
  if (process.includes("csc") || process.includes("common service")) return "Common Service Centre"
  if (process.includes("gram panchayat") || process.includes("panchayat")) return "Gram Panchayat / local office"
  if (process.includes("anganwadi")) return "Anganwadi Centre"
  if (process.includes("post office")) return "Post office"
  return match.scheme.level === "state" ? "State portal / local office" : "Official scheme portal"
}

export function SaarthiActionPlan({ matches, profile, benefitBreakdown }: ActionPlanProps) {
  const locale = useLocale()
  const [aiPlan, setAiPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const priorityMatches = useMemo(
    () =>
      matches
        .filter((match) => match.score >= 70)
        .slice(0, 3),
    [matches],
  )

  const backupMatches = useMemo(
    () =>
      matches
        .filter((match) => match.score >= 40 && match.score < 70)
        .slice(0, 2),
    [matches],
  )

  const planSchemes = priorityMatches.length > 0 ? priorityMatches : matches.slice(0, 3)
  const documents = uniqueItems(planSchemes.flatMap((match) => match.scheme.documents), 8)
  const officeHints = uniqueItems(planSchemes.map(getOfficeHint), 4)

  const riskChecks = [
    profile.isBPL ? "Keep BPL/ration card details consistent with Aadhaar and bank records." : "If a scheme needs BPL proof, confirm your ration-card status before applying.",
    profile.incomeRange === "gt10l"
      ? "Income-sensitive welfare schemes may need extra verification because the selected income band is high."
      : "Keep a recent income certificate ready where income caps are mentioned.",
    profile.category !== "general"
      ? "For caste/category schemes, use the latest valid certificate in the same name as Aadhaar."
      : "Category-specific schemes may not apply unless official documents support that category.",
  ]

  const generateAiPlan = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          profile,
          benefitBreakdown,
          matches: planSchemes.map((match) => {
            const localized = getLocalizedSchemeText(locale, match.scheme)
            return {
              name: localized.name,
              description: localized.description,
              benefits: localized.benefits,
              score: match.score,
              confidence: match.confidence,
              documents: match.scheme.documents,
              applicationProcess: match.scheme.applicationProcess,
              reasons: match.matchReasons,
              concerns: match.missedReasons,
            }
          }),
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to generate action plan")
      }

      const data = await response.json()
      setAiPlan(data.text)
    } catch {
      setError("AI action plan is unavailable right now. The checklist below is still ready to use.")
    } finally {
      setLoading(false)
    }
  }

  if (matches.length === 0) return null

  return (
    <section className="overflow-hidden rounded-md border border-primary/20 bg-card">
      <div className="border-b border-border bg-primary/5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Saarthi Action Plan</p>
            </div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Your next best steps
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              A practical application order based on your strongest matches, document needs, and likely verification checks.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {planSchemes.length} priority schemes
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Apply First</h3>
            </div>
            <div className="space-y-3">
              {planSchemes.map((match, index) => {
                const localized = getLocalizedSchemeText(locale, match.scheme)
                return (
                  <div key={match.scheme.id} className="flex gap-3 rounded-md border border-border bg-muted/20 p-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{localized.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {match.score}% match, {match.confidence}% confidence. Start via {getOfficeHint(match)}.
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Document Stack</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {documents.map((doc) => (
                  <li key={doc} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Where To Go</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {officeHints.map((hint) => (
                  <li key={hint} className="flex gap-2">
                    <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estimated Opportunity</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-muted-foreground">Direct yearly support</span>
                <span className="font-semibold text-foreground">{formatCurrency(benefitBreakdown.directSupportTotal)}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-muted-foreground">Insurance cover</span>
                <span className="font-semibold text-foreground">{formatCurrency(benefitBreakdown.insuranceCoverageTotal)}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-muted-foreground">Loan access</span>
                <span className="font-semibold text-foreground">{formatCurrency(benefitBreakdown.loanAccessPotential)}</span>
              </p>
            </div>
          </div>

          <div className="rounded-md border border-warning/30 bg-warning/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Before You Apply</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {riskChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>

          {backupMatches.length > 0 && (
            <div className="rounded-md border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Keep As Backup</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {backupMatches.map((match) => (
                  <Badge key={match.scheme.id} variant="outline">
                    {getLocalizedSchemeText(locale, match.scheme).name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="border-t border-border p-5">
        {aiPlan ? (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              AI Personal Plan
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">{aiPlan}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Generate a citizen-friendly plan with exact order, office script, and document warnings.
            </p>
            <Button onClick={generateAiPlan} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Action Plan
                </>
              )}
            </Button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
    </section>
  )
}
