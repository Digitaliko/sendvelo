export const locales = ["en", "sk", "it", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  sk: "Slovenčina",
  it: "Italiano",
  de: "Deutsch",
};
