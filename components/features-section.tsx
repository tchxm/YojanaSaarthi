import Link from "next/link"
import { ArrowUpRight, CheckCircle2, ShieldCheck, Scale, Target } from "lucide-react"

const engineBlocks = [
  {
    icon: ShieldCheck,
    title: "Deterministic Rule Evaluation",
    description:
      "Hard disqualification gates for income caps, state restrictions, age bands, and social-category requirements.",
  },
  {
    icon: Scale,
    title: "Weighted Scoring Model",
    description:
      "Multi-factor relevance scoring across age, income, occupation, demographic flags, and user goals.",
  },
  {
    icon: Target,
    title: "Targeting & Priority Logic",
    description:
      "Schemes designed specifically for your profile are ranked higher than broad, open-access programs.",
  },
]

const trustPoints = [
  "Eligibility computed using explicit policy rules",
  "No login required",
  "AI used only for explanation",
  "Policy sources tracked and versioned",
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-background py-14 lg:py-18">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-md border border-border bg-card p-6 lg:p-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Inside the Engine
            </span>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How eligibility is computed
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {engineBlocks.map((block) => (
              <div key={block.title} className="rounded-md border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <block.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3
                      className="text-base font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {block.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Example Preview
            </p>
            <h3
              className="mt-2 text-xl font-semibold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Profile to match output
            </h3>
            <div className="mt-4 rounded-md border border-border bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Profile
              </p>
              <p className="mt-1 text-sm text-foreground">
                29 yrs | SC | Rural | Rs.1.8L | Small Business
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Top Matches
              </p>
              <div className="mt-2 space-y-2 text-sm text-foreground">
                <p className="flex items-center justify-between rounded-sm border border-border bg-background px-3 py-2">
                  <span>Stand Up India</span>
                  <span className="font-semibold text-primary">96 (Primary)</span>
                </p>
                <p className="flex items-center justify-between rounded-sm border border-border bg-background px-3 py-2">
                  <span>PM SVANidhi</span>
                  <span className="font-semibold text-primary">91 (Primary)</span>
                </p>
                <p className="flex items-center justify-between rounded-sm border border-border bg-background px-3 py-2">
                  <span>PM Mudra</span>
                  <span className="font-semibold text-primary">92 (Secondary)</span>
                </p>
              </div>
            </div>
            <Link href="/discover" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View breakdown
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Designed for Trust
            </p>
            <h3
              className="mt-2 text-xl font-semibold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Transparency by default
            </h3>
            <div className="mt-5 space-y-3">
              {trustPoints.map((point) => (
                <p key={point} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
