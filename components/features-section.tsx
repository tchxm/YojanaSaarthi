import { ShieldCheck, Gauge, FileText, Lightbulb } from "lucide-react"

const features = [
  {
    icon: Gauge,
    title: "Eligibility Scoring Engine",
    description:
      "Weighted matching across age, income, gender, occupation, location, category, and goals. Every scheme receives a transparent 0-100 score.",
  },
  {
    icon: Lightbulb,
    title: "AI-Powered Explanations",
    description:
      "Get plain-language summaries that explain fit, likely benefits, key documents, and what to watch for before applying.",
  },
  {
    icon: FileText,
    title: "Document Checklist",
    description:
      "Each scheme includes a practical checklist and application route so users can prepare before visiting a portal or office.",
  },
  {
    icon: ShieldCheck,
    title: "Missed Benefit Estimation",
    description:
      "Estimate annual value across high-match schemes to prioritize opportunities with the strongest potential impact.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Intelligence, not just information
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-pretty">
            More than a static list: this product scores, explains, and prioritizes
            schemes so users can act with confidence.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-5 rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
