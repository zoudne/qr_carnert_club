import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "carnet_session";

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "fallback-secret-for-middleware"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/carnets") ||
    pathname.startsWith("/api/users") ||
    pathname.startsWith("/api/auth/change-password");

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/carnets/:path*",
    "/api/users/:path*",
    "/api/auth/change-password",
  ],
};
