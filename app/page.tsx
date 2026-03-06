import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesSection } from "@/components/features-section"
import { PopularSchemesSection } from "@/components/popular-schemes-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <HeroSection />
        <PopularSchemesSection />
        <HowItWorks />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
