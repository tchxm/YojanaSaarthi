import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SchemesLibrary } from "@/components/schemes-library"

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: "Metadata.schemes"})

  return {
    title: t("title"),
    description: t("description"),
  }
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
