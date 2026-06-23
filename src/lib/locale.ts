import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : defaultLocale;
}
