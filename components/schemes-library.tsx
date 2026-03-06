"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { schemes, type Scheme } from "@/lib/schemes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExternalLink, FileText, IndianRupee, Landmark, ShieldCheck } from "lucide-react"

type CategoryFilter =
  | "all"
  | "education"
  | "business"
  | "agriculture"
  | "health"
  | "women"
  | "social-security"

type LevelFilter = "all" | "central" | "karnataka"
type StateFilter = "all" | "karnataka"

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "All categories" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business" },
  { value: "agriculture", label: "Agriculture" },
  { value: "health", label: "Health" },
  { value: "women", label: "Women" },
  { value: "social-security", label: "Social Security" },
]

const levelOptions: Array<{ value: LevelFilter; label: string }> = [
  { value: "all", label: "All levels" },
  { value: "central", label: "Central" },
  { value: "karnataka", label: "Karnataka" },
]

const stateOptions: Array<{ value: StateFilter; label: string }> = [
  { value: "all", label: "All states" },
  { value: "karnataka", label: "Karnataka" },
]

const formatCategory = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const formatCurrency = (value: number) => `Rs.${value.toLocaleString("en-IN")}`

const getBenefitSummary = (scheme: Scheme) => {
  if (scheme.benefitType === "loan") {
    return {
      label: "Potential benefit",
      value: "Loan access as per scheme limit",
    }
  }
  if (scheme.benefitType === "insurance") {
    return {
      label: "Potential benefit",
      value: `Insurance cover up to ${formatCurrency(scheme.annualValue)}`,
    }
  }
  return {
    label: "Benefit summary",
    value: `${formatCurrency(scheme.annualValue)} yearly support (approx.)`,
  }
}

const getBestFor = (scheme: Scheme) => {
  const elig = scheme.eligibility
  if (scheme.id === "gruha-lakshmi") return "Women heads of households in Karnataka"
  if (scheme.id === "pm-kisan") return "Farmer families needing direct support"
  if (scheme.id === "pm-svanidhi") return "Street vendors seeking working capital"
  if (elig.isBPL && elig.isRural) return "Rural BPL households"
  if (elig.isBPL) return "BPL households"
  if (elig.isPregnant) return "Pregnant women"
  if (elig.isArtisan) return "Traditional artisans"
  if (elig.isStreetVendor) return "Street vendors"
  if (elig.occupations && elig.occupations.length > 0) {
    return `${elig.occupations[0].replace(/-/g, " ")} profiles`
  }
  if (elig.gender && elig.gender !== "any") {
    return `${elig.gender.charAt(0).toUpperCase() + elig.gender.slice(1)} applicants`
  }
  return "Citizens matching scheme criteria"
}

const summarizeEligibility = (scheme: Scheme) => {
  const elig = scheme.eligibility
  const items: string[] = []

  if (elig.gender && elig.gender !== "any") {
    items.push(`For ${elig.gender} applicants`)
  }
  if (elig.minAge !== undefined || elig.maxAge !== undefined) {
    const min = elig.minAge ?? 0
    const max = elig.maxAge ?? 120
    items.push(`Age ${min}-${max}`)
  }
  if (elig.maxIncome !== undefined) {
    items.push(`Income up to ${formatCurrency(elig.maxIncome)}`)
  }
  if (elig.categories && elig.categories.length > 0) {
    items.push(`Category: ${elig.categories.map((c) => c.toUpperCase()).join(", ")}`)
  }
  if (elig.occupations && elig.occupations.length > 0) {
    items.push(`Occupation: ${elig.occupations.map((o) => o.replace(/-/g, " ")).join(", ")}`)
  }
  if (elig.isBPL) items.push("BPL required")
  if (elig.isRural) items.push("Rural only")
  if (elig.states && elig.states.length > 0) {
    items.push(`State: ${elig.states.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}`)
  }

  if (items.length === 0) return "Open eligibility with scheme-specific verification."
  return items.slice(0, 3).join(" | ")
}

function LibrarySchemeCard({ scheme }: { scheme: Scheme }) {
  const [showDetails, setShowDetails] = useState(false)
  const benefitSummary = getBenefitSummary(scheme)
  const levelLabel = scheme.level === "central" ? "Central" : scheme.state ?? "State"
  const levelTone =
    scheme.level === "central"
      ? "border-blue-300 bg-blue-50 text-blue-700"
      : "border-emerald-300 bg-emerald-50 text-emerald-700"

  return (
    <Card className="rounded-md border border-border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={levelTone}>
            {levelLabel}
          </Badge>
          <Badge variant="secondary">{formatCategory(scheme.category)}</Badge>
        </div>
        <CardTitle className="text-lg leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
          {scheme.name}
        </CardTitle>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{scheme.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-md border border-border bg-muted/20 p-3 text-sm">
          <p className="font-medium text-foreground">{benefitSummary.label}</p>
          <p className="mt-1 text-muted-foreground">{scheme.benefits}</p>
          <p className="mt-2 flex items-center gap-1.5 font-medium text-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            {benefitSummary.value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Best for: <span className="font-medium text-foreground">{getBestFor(scheme)}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowDetails((prev) => !prev)}>
            {showDetails ? "Hide Details" : "View Details"}
          </Button>
          <Button size="sm" asChild>
            <Link href="/discover">Check My Eligibility</Link>
          </Button>
        </div>

        {showDetails && (
          <div className="grid gap-3 border-t border-border pt-3 text-sm">
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">Benefits</p>
              <p className="mt-1 text-muted-foreground">{scheme.benefits}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">Eligibility</p>
              <p className="mt-1 text-muted-foreground">{summarizeEligibility(scheme)}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="mb-1 font-semibold text-foreground">Documents required</p>
              <ul className="ml-5 list-disc text-muted-foreground">
                {scheme.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">How to apply</p>
              <p className="mt-1 text-muted-foreground">{scheme.applicationProcess}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">Official portal</p>
              <a
                href={scheme.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
              >
                Visit official portal
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 rounded-md border border-border bg-muted/20 p-3 text-xs text-muted-foreground sm:grid-cols-3">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Last verified: February 2026
          </p>
          <p className="flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-primary" />
            Source: {scheme.level === "central" ? "Government of India" : `Government of ${scheme.state ?? "State"}`}
          </p>
          <p className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            Documents required: {scheme.documents.length}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function SchemesLibrary() {
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [level, setLevel] = useState<LevelFilter>("all")
  const [state, setState] = useState<StateFilter>("all")

  const totals = useMemo(() => {
    const central = schemes.filter((scheme) => scheme.level === "central").length
    const karnataka = schemes.filter(
      (scheme) =>
        scheme.level === "state" &&
        ((scheme.state ?? "").trim().toLowerCase() === "karnataka" ||
          scheme.eligibility.states?.includes("karnataka")),
    ).length

    return {
      total: schemes.length,
      central,
      karnataka,
    }
  }, [])

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      if (category !== "all" && scheme.category !== category) return false

      if (level === "central" && scheme.level !== "central") return false
      if (level === "karnataka") {
        const isKarnatakaScheme =
          scheme.level === "state" &&
          ((scheme.state ?? "").trim().toLowerCase() === "karnataka" ||
            scheme.eligibility.states?.includes("karnataka"))
        if (!isKarnatakaScheme) return false
      }

      if (state === "karnataka") {
        const hasKarnatakaCoverage =
          (scheme.state ?? "").trim().toLowerCase() === "karnataka" ||
          scheme.eligibility.states?.includes("karnataka")
        if (!hasKarnatakaCoverage) return false
      }

      return true
    })
  }, [category, level, state])

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-md border border-border bg-card p-5 sm:p-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Explore Government Schemes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse central and Karnataka programs available to citizens.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Total schemes available: {totals.total}</Badge>
          <Badge variant="outline">Central: {totals.central}</Badge>
          <Badge variant="outline">Karnataka: {totals.karnataka}</Badge>
        </div>

        <div className="mt-4 rounded-md border border-border bg-muted/20 p-3 text-sm">
          <p className="text-muted-foreground">Not sure which schemes apply to you?</p>
          <Button asChild size="sm" className="mt-2">
            <Link href="/discover">Check My Eligibility</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-md border border-border bg-card p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Filter by</p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Level</p>
            <Select value={level} onValueChange={(value) => setLevel(value as LevelFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</p>
            <Select value={state} onValueChange={(value) => setState(value as StateFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Policy Library
          </h2>
          <Badge variant="secondary">{filteredSchemes.length} results</Badge>
        </div>

        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredSchemes.map((scheme) => (
              <LibrarySchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="p-8 text-center text-muted-foreground">
              No schemes match the selected filters. Try resetting one or more filters.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
