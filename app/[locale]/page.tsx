import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesSection } from "@/components/features-section"
import { PopularSchemesSection } from "@/components/popular-schemes-section"
import { Footer } from "@/components/footer"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: "Metadata.home"})

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function HomePage() {
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
