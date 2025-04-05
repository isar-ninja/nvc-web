"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareText } from "lucide-react";
import { useParams } from "next/navigation";
import { Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/i18n";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleRegistering, setIsGoogleRegistering] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const params = useParams();
  const lang = params.lang as Locale;
  const [dictionary, setDictionary] = useState<any>(null);

  // Load dictionary when component mounts
  useEffect(() => {
    async function loadDictionary() {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    }
    loadDictionary();
  }, [lang]);

  // Show loading state while dictionary is loading
  if (!dictionary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const t = dictionary.auth.register;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      setIsRegistering(false);
      return;
    }

    try {
      setError("");
      await register(email, password);
    } catch (err: any) {
      setError(`${t.registerError} ${err.message}`);
      setIsRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleRegistering(true);
    try {
      setError("");
      await loginWithGoogle();
    } catch (err: any) {
      setError(`${t.googleRegisterError} ${err.message}`);
      setIsGoogleRegistering(false);
    }
  };

  // Show a full-screen loader when Google sign-in is processing
  if (isGoogleRegistering) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 z-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">
            {dictionary.auth.login.signingYouIn}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {dictionary.auth.login.settingUp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <span>Goodspeech</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold">{t.title}</h2>
          <p className="mt-2 text-sm text-gray-500">
            <Link
              href={`/${lang}/login`}
              className="font-medium text-primary hover:underline"
            >
              {t.alreadyHaveAccount}
            </Link>
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md shadow-sm px-4 py-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t.passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium"
              >
                {t.confirmPasswordLabel}
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {dictionary.auth.login.signingIn}
                </>
              ) : (
                t.createAccountButton
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isRegistering || isGoogleRegistering}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {t.googleSignUp}
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link
            href={`/${lang}`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
