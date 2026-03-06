import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { schemes } from "@/lib/schemes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const featuredSchemeIds = [
  "pm-kisan",
  "gruha-lakshmi",
  "pm-svanidhi",
  "ayushman-bharat",
  "nrega",
  "pm-mudra",
]

const formatCategory = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const formatCurrency = (value: number) => `Rs.${value.toLocaleString("en-IN")}`

export function PopularSchemesSection() {
  const featured = featuredSchemeIds
    .map((id) => schemes.find((scheme) => scheme.id === id))
    .filter((scheme): scheme is NonNullable<typeof scheme> => Boolean(scheme))

  return (
    <section className="border-t border-border bg-background py-14 lg:py-18">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Policy Library
            </span>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Explore Popular Schemes
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Browse key Central and State programs, then check eligibility instantly.
            </p>
          </div>
          <Button asChild>
            <Link href="/schemes" className="gap-2">
              View All Schemes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((scheme) => (
            <Card key={scheme.id} className="rounded-md border border-border shadow-none">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{scheme.level === "central" ? "Central" : scheme.state ?? "State"}</Badge>
                  <Badge variant="secondary">{formatCategory(scheme.category)}</Badge>
                </div>
                <CardTitle className="text-lg leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                  {scheme.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted-foreground">{scheme.description}</p>
                <div className="rounded-md border border-border bg-muted/20 p-2.5 text-sm">
                  <p className="font-medium text-foreground">Benefit summary</p>
                  <p className="text-muted-foreground">{formatCurrency(scheme.annualValue)} yearly support (approx.)</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/schemes">View Details</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/discover">Check My Eligibility</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer" className="gap-1">
                      Official Portal
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
