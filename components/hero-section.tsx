import React from "react"
import Link from "next/link"
import { ArrowRight, IndianRupee, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-secondary-foreground">
              Built for Benefit Discovery in India
            </span>
          </div>

          <h1
            className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Stop Missing Government Benefits You{" "}
            <span className="text-primary">Deserve</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl text-pretty">
            YojanaSaarthi helps citizens quickly identify relevant government schemes
            using a transparent scoring model and plain-language guidance. Get clarity
            on eligibility, expected benefits, and application steps in minutes
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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

          <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard
              icon={<IndianRupee className="h-5 w-5" />}
              value="Up to Rs.5L"
              label="Annual value in select schemes"
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value="13+"
              label="Schemes modeled in the current engine"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              value="7"
              label="Eligibility dimensions evaluated per profile"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
        {value}
      </span>
      <span className="text-center text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
