import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User, Workspace } from "./shared/models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string, lang: string) => {
  return new Date(date).toLocaleDateString(lang === "de" ? "de-DE" : "en-US");
};

// Utility functions for translation tracking
export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getTranslationsThisMonth(workspace: Workspace): number {
  const monthKey = getCurrentMonthKey();
  return workspace.usage?.translations?.[monthKey] || 0;
}

export function getUserTranslationsThisMonth(user: User): number {
  const monthKey = getCurrentMonthKey();
  return user.usage?.totalTranslations?.[monthKey] || 0;
}

export function getRemainingTranslations(user: User): number {
  const translationsThisMonth = getUserTranslationsThisMonth(user);
  const maxTranslations = user.subscription?.maxTranslationsPerMonth || 100;
  return Math.max(0, maxTranslations - translationsThisMonth);
}
