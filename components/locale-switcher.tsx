"use client"

import {useEffect} from "react"
import {useLocale, useTranslations} from "next-intl"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {usePathname, useRouter} from "@/i18n/navigation"
import {routing, type AppLocale} from "@/i18n/routing"

const STORAGE_KEY = "yojanasaarthi-locale"

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher")
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
  }, [locale])

  const handleChange = (nextLocale: string) => {
    const query = window.location.search.replace(/^\?/, "")
    const href = query ? `${pathname}?${query}` : pathname

    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`
    router.replace(href, {locale: nextLocale as AppLocale})
    router.refresh()
  }

  return (
    <div className="min-w-28">
      <Select value={locale} onValueChange={handleChange}>
        <SelectTrigger aria-label={t("label")} className="h-9 text-sm">
          <SelectValue placeholder={t("shortLabel")} />
        </SelectTrigger>
        <SelectContent>
          {routing.locales.map((item) => (
            <SelectItem key={item} value={item}>
              {t(`locales.${item}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
