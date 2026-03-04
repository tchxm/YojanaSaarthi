import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { ProfileForm } from "@/components/profile-form"

export const metadata: Metadata = {
  title: "Discover Schemes - YojanaSaarthi AI",
  description:
    "Tell us about yourself and discover government schemes you are eligible for. AI-powered matching across 13+ central and state schemes.",
}

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Scheme Discovery
          </span>
          <h1
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Your Eligibility Profile
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
            Your inputs are evaluated against policy rules, income caps, and targeting criteria.
          </p>
        </div>
        <ProfileForm />
      </main>
    </div>
  )
}
