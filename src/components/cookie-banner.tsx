"use client";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

export function cookieConsentGiven() {
  if (
    typeof window === "undefined" ||
    !localStorage.getItem("cookie_consent")
  ) {
    return "undecided";
  }
  return localStorage.getItem("cookie_consent");
}

export default function CookieBanner() {
  const [consentGiven, setConsentGiven] = useState<string | null>("");
  const posthog = usePostHog();

  useEffect(() => {
    // We want this to only run once the client loads
    // or else it causes a hydration error
    setConsentGiven(cookieConsentGiven());
  }, []);

  useEffect(() => {
    if (consentGiven !== "" && posthog) {
      posthog.set_config({
        persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
      });
    }
  }, [consentGiven, posthog]);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
  };

  if (consentGiven !== "undecided") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Cookie Consent
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
                We use tracking cookies to understand how you use the product
                and help us improve it. By accepting cookies, you help us
                enhance your experience and develop new features based on how
                our users interact with the site.
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                You can change your preferences at any time in your account
                settings.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <Button
              type="button"
              onClick={handleDeclineCookies}
              className="inline-flex justify-center items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Decline
            </Button>
            <Button
              type="button"
              onClick={handleAcceptCookies}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Accept Cookies
            </Button>
          </div>

          <button
            onClick={handleDeclineCookies}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 md:hidden"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
