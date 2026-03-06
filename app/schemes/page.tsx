import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SchemesLibrary } from "@/components/schemes-library"

export const metadata: Metadata = {
  title: "Explore Schemes - YojanaSaarthi AI",
  description:
    "Browse central and Karnataka government schemes by category, level, and state. Explore benefits, eligibility, documents, and official portals.",
}

export default function SchemesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <SchemesLibrary />
      </main>
      <Footer />
    </div>
  )
}

