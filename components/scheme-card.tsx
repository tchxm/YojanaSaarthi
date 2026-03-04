"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AIExplanation } from "@/components/ai-explanation"
import {
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Building2,
  ShieldCheck,
  FileBadge2,
} from "lucide-react"
import type { SchemeMatch, UserProfile, ScoreBreakdownItem } from "@/lib/schemes"

function ScoreBreakdownRow({ item }: { item: ScoreBreakdownItem }) {
  const pct = item.max > 0 ? (item.earned / item.max) * 100 : 0
  const barColor =
    pct >= 80
      ? "bg-success"
      : pct >= 50
        ? "bg-primary"
        : pct > 0
          ? "bg-warning"
          : "bg-muted"

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{item.label}</span>
        <span className="tabular-nums text-muted-foreground">
          {item.earned}/{item.max}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] leading-tight text-muted-foreground">{item.reason}</p>
    </div>
  )
}

const categoryColors: Record<string, string> = {
  pension: "bg-chart-1/10 text-chart-1",
  housing: "bg-chart-2/10 text-chart-2",
  agriculture: "bg-chart-3/10 text-chart-3",
  education: "bg-chart-4/10 text-chart-4",
  business: "bg-chart-5/10 text-chart-5",
  health: "bg-success/10 text-success",
  women: "bg-primary/10 text-primary",
  employment: "bg-accent/10 text-accent-foreground",
  "social-security": "bg-warning/10 text-warning-foreground",
}

export function SchemeCard({
  match,
  profile,
}: {
  match: SchemeMatch
  profile: UserProfile
}) {
  const [expanded, setExpanded] = useState(false)
  const { scheme, score, confidence, effectiveTargetStrength, matchReasons, missedReasons, breakdown } = match
  const tierTone: Record<typeof effectiveTargetStrength, string> = {
    primary: "bg-success/10 text-success border-success/30",
    secondary: "bg-warning/10 text-warning-foreground border-warning/30",
    general: "bg-primary/10 text-primary border-primary/30",
  }
  const tierStrip: Record<typeof effectiveTargetStrength, string> = {
    primary: "border-l-4 border-l-emerald-500",
    secondary: "border-l-4 border-l-blue-400",
    general: "border-l-4 border-l-slate-300",
  }
  const alignmentLabel =
    score >= 85 ? "High Alignment" : score >= 70 ? "Moderate Alignment" : "Limited Alignment"
  const authority = scheme.level === "central" ? "Government of India" : `Government of ${scheme.state ?? profile.state}`

  return (
    <Card className={`overflow-hidden rounded-md border border-border shadow-none ${tierStrip[effectiveTargetStrength]}`}>
      <CardHeader className="pb-1.5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`text-xs capitalize ${tierTone[effectiveTargetStrength]}`}>
                {effectiveTargetStrength}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {scheme.level === "central" ? "Central" : scheme.state}
              </Badge>
              <Badge variant="secondary" className={categoryColors[scheme.category] || ""}>
                {scheme.category.replace("-", " ")}
              </Badge>
            </div>
            <CardTitle
              className="text-lg leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {scheme.name}
            </CardTitle>
            <div className="mt-2.5 space-y-0.5">
              <p className="text-xs text-foreground">
                Confidence: <span className="font-semibold">{confidence}%</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Based on rule completeness.
              </p>
              <div className="h-px w-full bg-border" />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {scheme.description}
            </p>
          </div>
          <div className="min-w-24 text-right">
            <p className="text-3xl font-extrabold leading-none text-foreground">{score}</p>
            <p className="mt-0.5 text-xs leading-none text-muted-foreground">{alignmentLabel}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5">
        {/* Benefits */}
        <div className="flex items-start gap-3 rounded-md border border-border bg-background p-2.5">
          <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <span className="text-sm font-medium text-foreground">Benefits: </span>
            <span className="text-sm text-muted-foreground">{scheme.benefits}</span>
          </div>
        </div>

        {/* Expandable section */}
        {expanded && (
          <div className="flex flex-col gap-4 border-t border-border pt-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Eligibility Evaluation Log</h4>
              <div className="flex flex-col gap-2">
                {matchReasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground">{reason}</span>
                  </div>
                ))}
                {missedReasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-2 text-sm">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span className="text-muted-foreground">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Breakdown */}
            {breakdown && breakdown.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  Score Breakdown ({score}%)
                </h4>
                <div className="flex flex-col gap-2.5">
                  {breakdown.map((item) => (
                    <ScoreBreakdownRow key={item.label} item={item} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Schemes specifically targeting your profile score higher. Open/general schemes get partial points per criterion.
                </p>
              </div>
            )}

            {/* Documents */}
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4" />
                Required Documents
              </h4>
              <ul className="ml-6 list-disc text-sm text-muted-foreground">
                {scheme.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>

            {/* Application Process */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">
                How to Apply
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {scheme.applicationProcess}
              </p>
            </div>

            {/* AI Explanation */}
            <AIExplanation match={match} profile={profile} />

            {/* Official link */}
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Visit Official Portal
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div className="rounded-md border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Verified: Feb 2026
            </p>
            <p className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              Authority: {authority}
            </p>
            <p className="flex items-center gap-1.5">
              <FileBadge2 className="h-3.5 w-3.5 text-primary" />
              Policy Version: 2026-Q1
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="gap-1 self-start text-muted-foreground"
        >
          {expanded ? (
            <>
              Hide Evaluation Details <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View Evaluation Details <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
