"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { SchemeCard } from "@/components/scheme-card"
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
import { profileSubmissionSchema } from "@/lib/profile-schema"

export function ResultsDashboard() {
  const searchParams = useSearchParams()
  const paramsKey = searchParams.toString()
  const parsedAge = Number.parseInt(searchParams.get("age") || "25", 10)

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
      goals: (searchParams.get("goals")?.split(",").filter(Boolean) || []),
    }),
    [paramsKey, parsedAge],
  )

  const [profile, setProfile] = useState<UserProfile>(fallbackProfile)

  useEffect(() => {
    setProfile(fallbackProfile)
  }, [fallbackProfile])

  useEffect(() => {
    const raw = sessionStorage.getItem("yojanasaarthi_profile")
    if (!raw) return

    try {
      const parsedRaw = JSON.parse(raw)
      const parsed = profileSubmissionSchema.safeParse(parsedRaw)
      if (parsed.success) {
        setProfile(parsed.data)
      }
    } catch {
      // Ignore invalid storage data and continue with safe fallback profile.
    }
  }, [])

  const matches = useMemo(() => getMatchedSchemes(profile), [profile])
  const normalizedProfileState = profile.state.trim().toLowerCase()
  const isHomeStateMatch = (schemeState: (typeof matches)[number]) => {
    if (schemeState.scheme.level !== "state") return false
    const eligibleStates = schemeState.scheme.eligibility.states
    if (eligibleStates && eligibleStates.length > 0) {
      return eligibleStates.includes(normalizedProfileState)
    }
    return (schemeState.scheme.state ?? "").trim().toLowerCase() === normalizedProfileState
  }

  const stateMatches = matches.filter((match) => isHomeStateMatch(match))
  const centralAndOtherMatches = matches.filter((match) => !isHomeStateMatch(match))

  const strongMatches = centralAndOtherMatches.filter((m) => m.score >= 80)
  const goodMatches = centralAndOtherMatches.filter((m) => m.score >= 60 && m.score < 80)
  const lowMatches = centralAndOtherMatches.filter((m) => m.score > 0 && m.score < 60)

  const benefitBreakdown = useMemo(() => calculateBenefitBreakdown(matches), [matches])

  const topSchemeCount = matches.filter((m) => m.score >= 60).length
  const disqualifiedCount = allSchemes.length - matches.length
  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`
  const formatIncomeRange = (value: UserProfile["incomeRange"]) => {
    switch (value) {
      case "lt1l":
        return "< Rs.1L"
      case "1to3l":
        return "Rs.1L - Rs.3L"
      case "3to5l":
        return "Rs.3L - Rs.5L"
      case "5to10l":
        return "Rs.5L - Rs.10L"
      case "gt10l":
        return "Rs.10L+"
      default:
        return "Not specified"
    }
  }
  const formatLabel = (value: string) =>
    value
      .split("-")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ")

  return (
    <div className="flex flex-col gap-8">
      {/* Back nav */}
      <Button variant="ghost" size="sm" className="gap-2 self-start" asChild>
        <Link href="/discover">
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Link>
      </Button>

      {/* Profile summary */}
      <div className="rounded-md border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profile</p>
        <h2
          className="mt-1 text-xl font-semibold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Eligibility Profile Summary
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {profile.district ? `${profile.district}, ${profile.state}` : profile.state}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            {profile.age} yrs
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <BriefcaseBusiness className="h-4 w-4 text-primary" />
            {formatLabel(profile.occupation)}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            {profile.gender}, {profile.category.toUpperCase()}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            Income: {formatIncomeRange(profile.incomeRange)}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            {profile.isRural ? "Rural" : "Urban"}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            {profile.isBPL ? "BPL" : "Not BPL"}
          </p>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Direct Support</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(benefitBreakdown.directSupportTotal)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/yr</span>
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Insurance Cover</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(benefitBreakdown.insuranceCoverageTotal)}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Loan Access</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(benefitBreakdown.loanAccessPotential)}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Conditional</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(benefitBreakdown.conditionalSupportTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          Eligible from {allSchemes.length}: {matches.length}
        </Badge>
        <Badge variant="secondary">
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          Likely eligible: {topSchemeCount}
        </Badge>
        <Badge variant="outline">
          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
          Benefit totals are not blindly summed across non-additive schemes
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Note: Insurance and conditional values represent potential coverage/policy-fit estimates. They are not guaranteed yearly cash.
      </p>

      {/* State-first matches */}
      {stateMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              State Schemes For You
            </h3>
            <Badge className="bg-success/10 text-success">{stateMatches.length} schemes</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {stateMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Strong matches */}
      {strongMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Highly Eligible
            </h3>
            <Badge className="bg-success/10 text-success">
              <IndianRupee className="mr-1 h-3 w-3" />
              {strongMatches.length} schemes
            </Badge>
          </div>
          <div className="flex flex-col gap-4">
            {strongMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Good matches */}
      {goodMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Also Eligible
            </h3>
            <Badge variant="secondary">{goodMatches.length} schemes</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {goodMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Low matches */}
      {lowMatches.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h3
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              May Be Eligible
            </h3>
            <Badge variant="outline">{lowMatches.length} schemes</Badge>
          </div>
          <div className="flex flex-col gap-4">
            {lowMatches.map((match) => (
              <SchemeCard key={match.scheme.id} match={match} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Disqualified info */}
      {disqualifiedCount > 0 && (
        <Card className="border-border bg-muted/30">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ShieldX className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {disqualifiedCount} schemes were not shown
              </p>
              <p className="text-xs text-muted-foreground">
                These schemes did not match your profile due to hard eligibility criteria like gender, age, state, BPL status, income, occupation, or social category requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No matches at all */}
      {matches.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">No Matching Schemes Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on your profile, none of the {allSchemes.length} schemes in our database currently match your eligibility criteria. Try adjusting your profile or check back as new schemes are added.
              </p>
            </div>
            <Button asChild>
              <Link href="/discover">Update Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
