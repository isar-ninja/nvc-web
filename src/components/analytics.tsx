"use client";

import Script from "next/script";
import { useEffect } from "react";

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GoogleAnalytics = ({ gaId = "G-GK0K8WR7ZB" }) => {
  useEffect(() => {
    // Check if user has already provided consent and update if needed
    const consentData = localStorage.getItem("cookie-consent");
    if (consentData && window.gtag) {
      // If consent exists, update consent mode
      window.gtag("consent", "update", JSON.parse(consentData));
    }
  }, []);

  return (
    <>
      {/* Load the Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />

      {/* Initialize Google Analytics with consent mode */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Set default consent mode - denied by default for GDPR compliance
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });

            // Configure GA with consent mode
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};
