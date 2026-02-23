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
} from "lucide-react"
import { getMatchedSchemes, schemes as allSchemes } from "@/lib/schemes"
import type { UserProfile } from "@/lib/schemes"

export function ResultsDashboard() {
  const searchParams = useSearchParams()

  const profile: UserProfile = useMemo(
    () => ({
      name: searchParams.get("name") || "User",
      age: parseInt(searchParams.get("age") || "25"),
      gender: (searchParams.get("gender") || "male") as UserProfile["gender"],
      state: searchParams.get("state") || "Karnataka",
      district: searchParams.get("district") || "",
      occupation: searchParams.get("occupation") || "salaried",
      annualIncome: parseInt(searchParams.get("annualIncome") || "300000"),
      category: searchParams.get("category") || "general",
      isRural: searchParams.get("isRural") === "true",
      isBPL: searchParams.get("isBPL") === "true",
      isPregnant: searchParams.get("isPregnant") === "true",
      isStreetVendor: searchParams.get("isStreetVendor") === "true",
      goals: searchParams.get("goals")?.split(",") || [],
    }),
    [searchParams],
  )

  const matches = useMemo(() => getMatchedSchemes(profile), [profile])

  const strongMatches = matches.filter((m) => m.score >= 80)
  const goodMatches = matches.filter((m) => m.score >= 60 && m.score < 80)
  const lowMatches = matches.filter((m) => m.score > 0 && m.score < 60)

  const totalMissedBenefits = matches
    .filter((m) => m.score >= 60)
    .reduce((sum, m) => sum + m.scheme.annualValue, 0)

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Missed Benefits - emotional killer feature */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Potential Benefits You May Be Missing
              </p>
              <p
                className="text-2xl font-bold text-destructive"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Rs.{totalMissedBenefits.toLocaleString("en-IN")}
                <span className="text-sm font-normal text-muted-foreground">/year</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Eligible From {allSchemes.length} Schemes
              </p>
              <p
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {matches.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Likely Eligible For
              </p>
              <p
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {topSchemeCount} Schemes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
