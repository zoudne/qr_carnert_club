"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import { useTranslation } from "./LocaleProvider";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, t } = useTranslation();
  const [loading, setLoading] = useState(false);

  async function handleChange(nextLocale: Locale) {
    if (nextLocale === locale || loading) return;

    setLoading(true);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-zinc-400" />
      <div className="flex overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => handleChange(loc)}
            disabled={loading}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              locale === loc
                ? "bg-brand text-white"
                : "text-zinc-600 hover:bg-brand-light hover:text-brand"
            }`}
          >
            {t(`language.${loc}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
