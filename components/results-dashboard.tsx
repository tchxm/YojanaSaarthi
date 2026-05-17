"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { SchemeCard } from "@/components/scheme-card"
import { SaarthiActionPlan } from "@/components/saarthi-action-plan"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  ShieldX,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  Users,
  Building2,
  Shield,
} from "lucide-react"
import { calculateBenefitBreakdown, getMatchedSchemes, schemes as allSchemes } from "@/lib/schemes"
import type { UserProfile } from "@/lib/schemes"
import { createProfileSchemas } from "@/lib/profile-schema"
import { Link } from "@/i18n/navigation"

export function ResultsDashboard() {
  const t = useTranslations("Results")
  const profileT = useTranslations("ProfileForm")
  const searchParams = useSearchParams()
  const paramsKey = searchParams.toString()
  const parsedAge = Number.parseInt(searchParams.get("age") || "25", 10)
  const hasExplicitProfileParams = useMemo(
    () =>
      [
        "age",
        "gender",
        "state",
        "district",
        "occupation",
        "incomeRange",
        "category",
        "isRural",
        "isBPL",
        "isPregnant",
        "isStreetVendor",
        "isArtisan",
        "isHeadOfHousehold",
        "goals",
      ].some((key) => searchParams.has(key)),
    [searchParams, paramsKey],
  )

  const fallbackProfile: UserProfile = useMemo(
    () => ({
      age: Number.isFinite(parsedAge) ? parsedAge : 25,
      gender: (searchParams.get("gender") || "male") as UserProfile["gender"],
      state: searchParams.get("state") || "Karnataka",
      district: searchParams.get("district") || "",
      occupation: searchParams.get("occupation") || "salaried",
      incomeRange: (searchParams.get("incomeRange") || "1to3l") as UserProfile["incomeRange"],
      category: searchParams.get("category") || "general",
      isRural: searchParams.get("isRural") === "true",
      isBPL: searchParams.get("isBPL") === "true",
      isPregnant: searchParams.get("isPregnant") === "true",
      isStreetVendor: searchParams.get("isStreetVendor") === "true",
      isArtisan: searchParams.get("isArtisan") === "true",
      isHeadOfHousehold: searchParams.get("isHeadOfHousehold") === "true",
      goals: searchParams.get("goals")?.split(",").filter(Boolean) || [],
    }),
    [paramsKey, parsedAge, searchParams],
  )

  const [profile, setProfile] = useState<UserProfile>(fallbackProfile)
  const schemas = useMemo(() => createProfileSchemas((key) => profileT(key)), [profileT])

  useEffect(() => {
    setProfile(fallbackProfile)
  }, [fallbackProfile])

  useEffect(() => {
    if (hasExplicitProfileParams) return

    const raw = sessionStorage.getItem("yojanasaarthi_profile")
    if (!raw) return

    try {
      const parsedRaw = JSON.parse(raw)
      const parsed = schemas.profileSubmissionSchema.safeParse(parsedRaw)
      if (parsed.success) {
        setProfile(parsed.data)
      }
    } catch {
      // Ignore invalid storage data and continue with safe fallback profile.
    }
  }, [hasExplicitProfileParams, schemas])

  const matches = useMemo(() => getMatchedSchemes(profile), [profile])
  const normalizedProfileState = profile.state.trim().toLowerCase()
  const isHomeStateMatch = (match: (typeof matches)[number]) => {
    if (match.scheme.level !== "state") return false
    const eligibleStates = match.scheme.eligibility.states
    if (eligibleStates && eligibleStates.length > 0) {
      return eligibleStates.includes(normalizedProfileState)
    }
    return (match.scheme.state ?? "").trim().toLowerCase() === normalizedProfileState
  }

  const stateMatches = matches.filter((match) => isHomeStateMatch(match))
  const centralAndOtherMatches = matches.filter((match) => !isHomeStateMatch(match))
  const strongMatches = centralAndOtherMatches.filter((m) => m.score >= 80)
  const goodMatches = centralAndOtherMatches.filter((m) => m.score >= 60 && m.score < 80)
  const lowMatches = centralAndOtherMatches.filter((m) => m.score > 0 && m.score < 60)
  const benefitBreakdown = useMemo(() => calculateBenefitBreakdown(matches), [matches])

  const topSchemeCount = matches.filter((m) => m.score >= 60).length
  const disqualifiedCount = allSchemes.length - matches.length
  const formatCurrency = (value: number) => `Rs.${value.toLocaleString("en-IN")}`
  const formatIncomeRange = (value: UserProfile["incomeRange"]) => profileT(`options.incomeRanges.${value}`)
  const formatOccupation = (value: string) => profileT(`options.occupation.${value}`)
  const formatGender = (value: string) => profileT(`options.gender.${value}`)
  const formatCategory = (value: string) => profileT(`options.category.${value}`)

  return (
    <div className="flex flex-col gap-8">
      <Button variant="ghost" size="sm" className="gap-2 self-start" asChild>
        <Link href="/discover">
          <ArrowLeft className="h-4 w-4" />
          {t("startOver")}
        </Link>
      </Button>

      <div className="rounded-md border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("profileLabel")}</p>
        <h2 className="mt-1 text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          {t("summaryTitle")}
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {profile.district ? `${profile.district}, ${profile.state}` : profile.state}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            {t("ageYears", {age: profile.age})}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <BriefcaseBusiness className="h-4 w-4 text-primary" />
            {formatOccupation(profile.occupation)}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            {formatGender(profile.gender)}, {formatCategory(profile.category)}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            {t("incomeLabel", {range: formatIncomeRange(profile.incomeRange)})}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            {profile.isRural ? t("rural") : t("urban")}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            {profile.isBPL ? t("bpl") : t("notBpl")}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("directSupport")}</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(benefitBreakdown.directSupportTotal)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/yr</span>
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("insuranceCover")}</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(benefitBreakdown.insuranceCoverageTotal)}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("loanAccess")}</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(benefitBreakdown.loanAccessPotential)}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("conditional")}</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(benefitBreakdown.conditionalSupportTotal)}</p>
          </div>
        </div>
      </div>

      <SaarthiActionPlan
        matches={matches}
        profile={profile}
        benefitBreakdown={benefitBreakdown}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          {t("eligibleBadge", {total: allSchemes.length, matches: matches.length})}
        </Badge>
        <Badge variant="secondary">
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          {t("likelyBadge", {count: topSchemeCount})}
        </Badge>
        <Badge variant="outline">
          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
          {t("additiveNote")}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{t("explanatoryNote")}</p>

      {stateMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("stateSchemesTitle")}
            </h3>
            <Badge className="bg-success/10 text-success">{t("schemesCount", {count: stateMatches.length})}</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {stateMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {strongMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("highTitle")}
            </h3>
            <Badge className="bg-success/10 text-success">
              <IndianRupee className="mr-1 h-3 w-3" />
              {t("schemesCount", {count: strongMatches.length})}
            </Badge>
          </div>
          <div className="flex flex-col gap-4">
            {strongMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {goodMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("mediumTitle")}
            </h3>
            <Badge variant="secondary">{t("schemesCount", {count: goodMatches.length})}</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {goodMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {lowMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("lowTitle")}
            </h3>
            <Badge variant="outline">{t("schemesCount", {count: lowMatches.length})}</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {lowMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {disqualifiedCount > 0 && (
        <Card className="border-border bg-muted/30">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ShieldX className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("hiddenTitle", {count: disqualifiedCount})}</p>
              <p className="text-xs text-muted-foreground">{t("hiddenDescription")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {matches.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t("noMatchesTitle")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("noMatchesDescription", {count: allSchemes.length})}</p>
            </div>
            <Button asChild>
              <Link href="/discover">{t("updateProfile")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
