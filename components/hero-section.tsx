import React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-secondary-foreground">
              Civic Eligibility Intelligence
            </span>
          </div>

          <h1
            className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Government Scheme Matching{" "}
            <span className="text-primary">Scored and Explained</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground lg:text-lg text-pretty">
            A deterministic eligibility engine that evaluates income caps, category
            rules, occupation targeting, and policy constraints and shows exactly why
            you qualify or don't.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8 text-base" asChild>
              <Link href="/discover">
                Discover Your Schemes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8 text-base bg-transparent" asChild>
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>

          <div className="mt-8 w-full max-w-4xl rounded-md border border-border bg-muted/30 p-4">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                23+ schemes modeled
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Hard eligibility gates
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Transparent scoring (0-100)
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No black-box ML decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
