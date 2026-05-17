"use client"

import { Shield, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/locale-switcher"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations("Navbar")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            YojanaSaarthi
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("howItWorks")}
          </Link>
          <Link href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("features")}
          </Link>
          <Link href="/schemes" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("exploreSchemes")}
          </Link>
          <Link href="/discover" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("discoverSchemes")}
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <Button asChild>
            <Link href="/discover">{t("cta")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href="/schemes"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {t("exploreSchemes")}
            </Link>
            <LocaleSwitcher />
            <Button asChild className="w-full">
              <Link href="/discover" onClick={() => setMobileOpen(false)}>{t("cta")}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
