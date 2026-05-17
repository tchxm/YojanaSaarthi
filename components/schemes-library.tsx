"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
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
import { Link } from "@/i18n/navigation"
import { getLocalizedSchemeText } from "@/lib/scheme-localizations"

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

const categoryValues: CategoryFilter[] = [
  "all",
  "education",
  "business",
  "agriculture",
  "health",
  "women",
  "social-security",
]

const levelValues: LevelFilter[] = ["all", "central", "karnataka"]
const stateValues: StateFilter[] = ["all", "karnataka"]

const formatCurrency = (value: number) => `Rs.${value.toLocaleString("en-IN")}`

function LibrarySchemeCard({ scheme }: { scheme: Scheme }) {
  const [showDetails, setShowDetails] = useState(false)
  const t = useTranslations("SchemesLibrary")
  const common = useTranslations("Common")
  const profileT = useTranslations("ProfileForm")
  const locale = useLocale()
  const localized = getLocalizedSchemeText(locale, scheme)
  const benefitSummary =
    scheme.benefitType === "loan"
      ? {
          label: t("potentialBenefit"),
          value: t("loanBenefit"),
        }
      : scheme.benefitType === "insurance"
        ? {
            label: t("potentialBenefit"),
            value: t("insuranceBenefit", {amount: formatCurrency(scheme.annualValue)}),
          }
        : {
            label: t("benefitSummary"),
            value: t("yearlySupport", {amount: formatCurrency(scheme.annualValue)}),
          }

  const getBestFor = () => {
    const elig = scheme.eligibility
    if (scheme.id === "gruha-lakshmi") return t("quickAudience.womenHeads")
    if (scheme.id === "pm-kisan") return t("quickAudience.farmers")
    if (scheme.id === "pm-svanidhi") return t("quickAudience.streetVendors")
    if (elig.isBPL && elig.isRural) return t("quickAudience.ruralBpl")
    if (elig.isBPL) return t("quickAudience.bpl")
    if (elig.isPregnant) return t("quickAudience.pregnant")
    if (elig.isArtisan) return t("quickAudience.artisans")
    if (elig.occupations && elig.occupations.length > 0) {
      return profileT(`options.occupation.${elig.occupations[0]}`)
    }
    return t("quickAudience.citizens")
  }

  const summarizeEligibility = () => {
    const elig = scheme.eligibility
    const items: string[] = []

    if (elig.gender && elig.gender !== "any") items.push(`${profileT("labels.gender")}: ${profileT(`options.gender.${elig.gender}`)}`)
    if (elig.minAge !== undefined || elig.maxAge !== undefined) items.push(`${profileT("labels.age")}: ${elig.minAge ?? 0}-${elig.maxAge ?? 120}`)
    if (elig.maxIncome !== undefined) items.push(`${profileT("labels.incomeRange")}: <= ${formatCurrency(elig.maxIncome)}`)
    if (elig.categories && elig.categories.length > 0) items.push(`${profileT("labels.category")}: ${elig.categories.map((c) => c.toUpperCase()).join(", ")}`)
    if (elig.occupations && elig.occupations.length > 0) items.push(`${profileT("labels.occupation")}: ${elig.occupations.map((o) => profileT(`options.occupation.${o}`)).join(", ")}`)
    if (elig.isBPL) items.push("BPL")
    if (elig.isRural) items.push(common("state"))
    if (elig.states && elig.states.length > 0) items.push(`${profileT("labels.state")}: ${elig.states.join(", ")}`)

    if (items.length === 0) return t("openEligibility")
    return items.slice(0, 3).join(" | ")
  }

  const levelLabel = scheme.level === "central" ? common("central") : scheme.state ?? common("state")
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
          <Badge variant="secondary">{common(`categories.${scheme.category}`)}</Badge>
        </div>
        <CardTitle className="text-lg leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
          {localized.name}
        </CardTitle>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{localized.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-md border border-border bg-muted/20 p-3 text-sm">
          <p className="font-medium text-foreground">{benefitSummary.label}</p>
          <p className="mt-1 text-muted-foreground">{localized.benefits}</p>
          <p className="mt-2 flex items-center gap-1.5 font-medium text-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            {benefitSummary.value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("bestFor")}: <span className="font-medium text-foreground">{getBestFor()}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowDetails((prev) => !prev)}>
            {showDetails ? t("hideDetails") : t("viewDetails")}
          </Button>
          <Button size="sm" asChild>
            <Link href="/discover">{t("cta")}</Link>
          </Button>
        </div>

        {showDetails && (
          <div className="grid gap-3 border-t border-border pt-3 text-sm">
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">{t("benefits")}</p>
              <p className="mt-1 text-muted-foreground">{localized.benefits}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">{t("eligibility")}</p>
              <p className="mt-1 text-muted-foreground">{summarizeEligibility()}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="mb-1 font-semibold text-foreground">{t("documentsRequired")}</p>
              <ul className="ml-5 list-disc text-muted-foreground">
                {scheme.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">{t("howToApply")}</p>
              <p className="mt-1 text-muted-foreground">{scheme.applicationProcess}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="font-semibold text-foreground">{t("officialPortal")}</p>
              <a
                href={scheme.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
              >
                {t("visitOfficialPortal")}
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
            Source: {scheme.level === "central" ? common("sourceGovernmentOfIndia") : common("sourceGovernmentOfState", {state: scheme.state ?? "State"})}
          </p>
          <p className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            {t("documentsRequired")}: {scheme.documents.length}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function SchemesLibrary() {
  const t = useTranslations("SchemesLibrary")
  const common = useTranslations("Common")
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
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{t("totalSchemes", {count: totals.total})}</Badge>
          <Badge variant="outline">{t("centralSchemes", {count: totals.central})}</Badge>
          <Badge variant="outline">{t("karnatakaSchemes", {count: totals.karnataka})}</Badge>
        </div>

        <div className="mt-4 rounded-md border border-border bg-muted/20 p-3 text-sm">
          <p className="text-muted-foreground">{t("prompt")}</p>
          <Button asChild size="sm" className="mt-2">
            <Link href="/discover">{t("cta")}</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-md border border-border bg-card p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("filterBy")}</p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("category")}</p>
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categoryValues.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all" ? t("allCategories") : common(`categories.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("level")}</p>
            <Select value={level} onValueChange={(value) => setLevel(value as LevelFilter)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectLevel")} />
              </SelectTrigger>
              <SelectContent>
                {levelValues.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all" ? t("allLevels") : t(`levelLabels.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("state")}</p>
            <Select value={state} onValueChange={(value) => setState(value as StateFilter)}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectState")} />
              </SelectTrigger>
              <SelectContent>
                {stateValues.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all" ? t("allStates") : "Karnataka"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredSchemes.map((scheme) => (
          <LibrarySchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </section>

      {filteredSchemes.length === 0 && (
        <Card className="rounded-md border border-border shadow-none">
          <CardContent className="p-6 text-sm text-muted-foreground">{t("noSchemes")}</CardContent>
        </Card>
      )}
    </div>
  )
}
