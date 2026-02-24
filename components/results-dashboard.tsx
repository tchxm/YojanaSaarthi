"use client"

import { useMemo } from "react"
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
  User,
  ShieldX,
  ShieldCheck,
  Landmark,
  CircleHelp,
} from "lucide-react"
import { calculateBenefitBreakdown, getMatchedSchemes, schemes as allSchemes } from "@/lib/schemes"
import type { UserProfile } from "@/lib/schemes"

export function ResultsDashboard() {
  const searchParams = useSearchParams()
  const paramsKey = searchParams.toString()

  const parseNumberParam = (value: string | null, fallback: number) => {
    if (!value) return fallback
    const normalized = value.replace(/[, ]+/g, "")
    const parsed = Number.parseInt(normalized, 10)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const profile: UserProfile = useMemo(
    () => ({
      name: searchParams.get("name") || "User",
      age: parseNumberParam(searchParams.get("age"), 25),
      gender: (searchParams.get("gender") || "male") as UserProfile["gender"],
      state: searchParams.get("state") || "Karnataka",
      district: searchParams.get("district") || "",
      occupation: searchParams.get("occupation") || "salaried",
      annualIncome: parseNumberParam(searchParams.get("annualIncome"), 300000),
      category: searchParams.get("category") || "general",
      isRural: searchParams.get("isRural") === "true",
      isBPL: searchParams.get("isBPL") === "true",
      isPregnant: searchParams.get("isPregnant") === "true",
      isStreetVendor: searchParams.get("isStreetVendor") === "true",
      isArtisan: searchParams.get("isArtisan") === "true",
      isHeadOfHousehold: searchParams.get("isHeadOfHousehold") === "true",
      goals: (searchParams.get("goals")?.split(",").filter(Boolean) || []),
    }),
    [paramsKey],
  )

  const matches = useMemo(() => getMatchedSchemes(profile), [profile])

  const strongMatches = matches.filter((m) => m.score >= 80)
  const goodMatches = matches.filter((m) => m.score >= 60 && m.score < 80)
  const lowMatches = matches.filter((m) => m.score > 0 && m.score < 60)

  const benefitBreakdown = useMemo(() => calculateBenefitBreakdown(matches), [matches])

  const topSchemeCount = matches.filter((m) => m.score >= 60).length
  const disqualifiedCount = allSchemes.length - matches.length

  return (
    <div className="flex flex-col gap-10">
      {/* Back nav */}
      <Button variant="ghost" size="sm" className="gap-2 self-start" asChild>
        <Link href="/discover">
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Link>
      </Button>

      {/* Profile summary */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h2
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Results for {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile.age} yrs, {profile.gender}, {profile.state} | {profile.occupation.replace(/-/g, " ")} | {profile.category.toUpperCase()} | Rs.{profile.annualIncome.toLocaleString("en-IN")}/yr
            {profile.isBPL && " | BPL"}{profile.isRural && " | Rural"}
          </p>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex min-w-0 items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm font-medium leading-snug text-muted-foreground">
                Direct Support Total
              </p>
              <p
                className="break-words text-xl font-bold leading-tight text-destructive sm:text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Rs.{benefitBreakdown.directSupportTotal.toLocaleString("en-IN")}
                <span className="text-sm font-normal text-muted-foreground">/year</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex min-w-0 items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm font-medium leading-snug text-muted-foreground">
                Insurance Coverage Potential
              </p>
              <p
                className="break-words text-xl font-bold leading-tight text-foreground sm:text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Rs.{benefitBreakdown.insuranceCoverageTotal.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">Coverage amount estimate, not guaranteed payout</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex min-w-0 items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Landmark className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm font-medium leading-snug text-muted-foreground">
                Loan Access Potential
              </p>
              <p
                className="break-words text-xl font-bold leading-tight text-foreground sm:text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Rs.{benefitBreakdown.loanAccessPotential.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">Estimated access potential, subject to lender checks</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex min-w-0 items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning-foreground">
              <CircleHelp className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="break-words text-sm font-medium leading-snug text-muted-foreground">
                Conditional Support
              </p>
              <p
                className="break-words text-xl font-bold leading-tight text-foreground sm:text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Rs.{benefitBreakdown.conditionalSupportTotal.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">Score-weighted potential, not guaranteed annual support</p>
            </div>
          </CardContent>
        </Card>
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
