"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

type ConsentSettings = {
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  analytics_storage: "granted" | "denied";
};

// Default consent values - all denied by default (GDPR compliant)
const defaultConsent: ConsentSettings = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent choice
    const hasConsent = localStorage.getItem("cookie-consent");

    // If no consent has been recorded yet, show the banner
    if (!hasConsent) {
      setVisible(true);

      // Initialize Google's consent mode with default (denied) settings
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "default", defaultConsent);
      }
    } else {
      // If consent was previously granted, update Google's consent mode
      const consentSettings = JSON.parse(hasConsent) as ConsentSettings;
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", consentSettings);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consentSettings: ConsentSettings = {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    };

    // Save consent to localStorage
    localStorage.setItem("cookie-consent", JSON.stringify(consentSettings));

    // Update Google's consent mode
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", consentSettings);
    }

    setVisible(false);
  };

  const handleAcceptEssential = () => {
    // Only accept essential cookies (no analytics)
    const consentSettings: ConsentSettings = {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    };

    // Save consent to localStorage
    localStorage.setItem("cookie-consent", JSON.stringify(consentSettings));

    // Update Google's consent mode
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", consentSettings);
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-8">
            <h3 className="text-lg font-semibold mb-1">Cookie-Einstellungen</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf
              unserer Website zu bieten. Weitere Informationen finden Sie in
              unserer{" "}
              <Link
                href="/dsgvo"
                className="underline text-primary hover:text-primary/90"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleAcceptEssential}
              className="whitespace-nowrap"
            >
              Nur Essentielle
            </Button>
            <Button onClick={handleAcceptAll} className="whitespace-nowrap">
              Alle akzeptieren
            </Button>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label="Schließen"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
