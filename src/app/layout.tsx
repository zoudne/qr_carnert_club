import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import { createTranslator } from "@/i18n";
import { getDirection } from "@/i18n/config";
import { getLocale } from "@/lib/locale";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = createTranslator(locale);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
