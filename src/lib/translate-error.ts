import type { TranslationKey } from "@/i18n";

export function translateApiError(
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
  data: { errorKey?: string; error?: string }
) {
  if (data.errorKey) {
    return t(data.errorKey as TranslationKey);
  }

  return data.error || t("errors.connectionError");
}
