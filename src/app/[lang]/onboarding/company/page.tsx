"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateUserAction } from "@/actions/user-actions";
import { Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";

// This component will be used to render the dictionary-aware content
export default function CompanyOnboarding() {
  const params = useParams();
  const lang = params.lang as Locale;
  const [dictionary, setDictionary] = useState<any | null>(null);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userData } = useAuth();

  useEffect(() => {
    if (!!userData?.companyName) {
      router.push(`/dashboard`);
    }
  }, [userData?.companyName, lang, router]);

  // Load dictionary when component mounts
  useEffect(() => {
    async function loadDictionary() {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    }
    loadDictionary();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update the user with company name
      await updateUserAction({ companyName: company });
      // Redirect to workspace creation with language prefix
      router.push(`/${lang}/workspace/new`);
    } catch (error) {
      console.error("Error saving company name:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while dictionary is loading
  if (!dictionary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const { onboarding } = dictionary;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{onboarding.company.title}</CardTitle>
          <CardDescription>{onboarding.company.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                {onboarding.company.companyLabel}
              </label>
              <Input
                id="company"
                type="text"
                placeholder={onboarding.company.companyPlaceholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? onboarding.company.saving
                : onboarding.company.continueButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
