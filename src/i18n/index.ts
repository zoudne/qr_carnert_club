import type { Locale } from "./config";
import type { Messages } from "./types";
import ar from "./messages/ar";
import en from "./messages/en";

const dictionaries: Record<Locale, Messages> = { ar, en };

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale];
}

type NestedKeyOf<T, Prefix extends string = ""> = T extends string
  ? Prefix extends ""
    ? never
    : Prefix
  : {
      [K in keyof T & string]: T[K] extends string
        ? Prefix extends ""
          ? K
          : `${Prefix}.${K}`
        : NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>;
    }[keyof T & string];

export type TranslationKey = NestedKeyOf<Messages>;

export function createTranslator(locale: Locale) {
  const messages = getDictionary(locale);

  return function t(
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    if (typeof value !== "string") {
      return key;
    }

    if (!params) {
      return value;
    }

    return Object.entries(params).reduce(
      (result, [paramKey, paramValue]) =>
        result.replace(`{${paramKey}}`, String(paramValue)),
      value
    );
  };
}
