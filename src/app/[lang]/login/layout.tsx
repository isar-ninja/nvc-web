import { Metadata } from "next";
import { i18n, Locale } from "@/lib/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Base URL of your site
  const baseUrl = "https://goodspeech.chat";

  // Canonical URL for this specific page
  const canonicalUrl = `${baseUrl}/${lang}/login`;

  // Create language alternatives for all supported locales
  const languages: Record<string, string> = {};
  i18n.locales.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}/login`;
  });

  return {
    title: lang === "de" ? "Anmelden | Goodspeech" : "Login | Goodspeech",
    description:
      lang === "de"
        ? "Melden Sie sich bei Ihrem Goodspeech-Konto an"
        : "Sign in to your Goodspeech account",
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
