import type { Metadata } from "next"
import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { Navbar } from "@/components/navbar"
import { ResultsDashboard } from "@/components/results-dashboard"

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: "Metadata.results"})

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <Suspense fallback={<ResultsSkeleton />}>
          <ResultsDashboard />
        </Suspense>
      </main>
    </div>
  )
}

function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}
