import { UserCheck, Brain, BadgeIndianRupee } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: UserCheck,
    title: "Share Your Profile",
    description:
      "Enter age, location, occupation, income, and goals. The current implementation processes this data client-side for matching.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Matches Schemes",
    description:
      "A weighted eligibility engine evaluates your profile across 7 dimensions and ranks 13+ schemes by match score.",
  },
  {
    step: "03",
    icon: BadgeIndianRupee,
    title: "See Your Benefits",
    description:
      "Review personalized results with score rationale, estimated benefit value, required documents, and application steps.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-secondary/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Three steps to discover your benefits
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-pretty">
            Fast, structured, and explainable. Complete a short profile and get a
            ranked shortlist with actionable next steps.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center"
            >
              <span className="absolute -top-4 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <h3
                className="mt-6 text-xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
