import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { GoogleAnalytics } from "@/components/analytics";
import { PostHogProvider } from "./cookie-provider";
import CookieBanner from "@/components/cookie-banner";
import { i18n, Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = await params;

  // You can use the dictionary to get localized metadata
  const dict = await getDictionary(lang as Locale);

  // Base URL of your site
  const baseUrl = "https://goodspeech.chat";

  // Create language alternatives for all supported locales
  const languages: Record<string, string> = {};
  i18n.locales.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}`;
  });

  return {
    title:
      dict.metadata?.title || "Goodspeech | Transform Workplace Communication",
    description:
      dict.metadata?.description ||
      "Goodspeech translates aggressive and passive-aggressive messages into empathic, understandable communication that builds connection and understanding.",
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages,
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return (
    <html lang={lang}>
      <head>
        {/* Google Analytics will be loaded after the initial page load */}
        <GoogleAnalytics />
      </head>
      <PostHogProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <CookieBanner />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Toaster
                toastOptions={{
                  classNames: {
                    error: "bg-red-400",
                    success: "text-green-400",
                  },
                }}
              />
              <div className="flex flex-col min-h-screen">
                {/* <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
                <header className="sticky top-0 z-40 w-full">
                  <Header dict={dict} />
                  <div className="backdrop -z-10"></div>
                  <div className="backdrop-edge -z-10 max-h-[61px]"></div>
                </header>
                <main className="flex flex-1">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
