import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Navbar } from "@/components/navbar"
import { ProfileForm } from "@/components/profile-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: "Metadata.discover"})

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function DiscoverPage() {
  const t = await getTranslations("DiscoverPage")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </span>
          <h1
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
            {t("description")}
          </p>
        </div>
        <ProfileForm />
      </main>
    </div>
  )
}
