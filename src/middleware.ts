import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./lib/i18n-config";

function getPreferredLocale(acceptLanguage: string): string {
  // If no Accept-Language header is present, return default locale
  if (!acceptLanguage) return i18n.defaultLocale;

  // Parse the Accept-Language header with quality values
  const acceptedLocales = acceptLanguage
    .split(",")
    .map((item) => {
      const [locale, quality = "q=1"] = item.trim().split(";");
      const q = Number(quality.replace("q=", "")) || 1;

      // Get base language code (e.g., "en" from "en-US")
      const baseLocale = locale.split("-")[0].toLowerCase();

      // If this is a region-specific variant (e.g., de-DE), slightly boost its
      // priority for its base language match
      return { locale: baseLocale, originalLocale: locale, q };
    })
    .sort((a, b) => b.q - a.q);

  // Find the first preferred locale that is supported by the app
  for (const { locale } of acceptedLocales) {
    if (i18n.locales.includes(locale as any)) {
      return locale;
    }
  }

  // If no match is found, use default locale
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if the request is for a static file or API route
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If the pathname already has a locale, proceed with the request
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Get the Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Get the preferred locale based on browser settings
  const browserPreferredLocale = getPreferredLocale(acceptLanguage);
  // Get the stored locale from cookies if it exists
  const storedLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // Determine which locale to use (preference: stored > browser > default)
  const localeToUse =
    browserPreferredLocale || storedLocale || i18n.defaultLocale;

  // Construct the redirect URL with the appropriate locale
  const newUrl = new URL(
    `/${localeToUse}${pathname === "/" ? "" : pathname}`,
    request.url,
  );

  // Create the response with the redirect
  const response = NextResponse.redirect(newUrl);

  // Set a cookie to remember this locale preference if it wasn't already set
  if (!storedLocale && browserPreferredLocale !== i18n.defaultLocale) {
    response.cookies.set("NEXT_LOCALE", localeToUse, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    "/((?!_next|api|.*\\..*|_vercel).*)",
  ],
};
