import { NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { LOCALE_COOKIE } from "@/lib/locale";

export async function POST(request: Request) {
  try {
    const { locale } = await request.json();

    if (!locale || !isLocale(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, locale });
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to set locale" }, { status: 500 });
  }
}
