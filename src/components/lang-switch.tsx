"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { i18n } from "@/lib/i18n-config";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLang = params.lang as string;

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      // Get the path without the locale
      const newPathname = pathname.replace(`/${currentLang}`, `/${newLocale}`);
      router.push(newPathname);
    },
    [currentLang, pathname, router],
  );

  return (
    <Select defaultValue={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
