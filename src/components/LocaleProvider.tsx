"use client";

import { createContext, useContext } from "react";
import { createTranslator, type TranslationKey } from "@/i18n";
import type { Locale } from "@/i18n/config";

interface LocaleContextValue {
  locale: Locale;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = createTranslator(locale);

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return context;
}
