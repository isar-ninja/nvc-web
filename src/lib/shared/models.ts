import { FieldValue } from "firebase-admin/firestore";

export const stati = [
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "pending",
  "cancelled",
] as const;

export type Status = (typeof stati)[number];

export interface Workspace {
  id: string;
  name: string;
  createdAt: Date | number | FieldValue;
  ownerId: string;
  settings: {
    slackTeamId?: string;
    slackBotToken?: string;
    customization?: {
      preferredLanguage: string;
      responseStyle: string;
    };
  };
  usage: {
    // Keep track of translations by month (e.g., "2023-10": 157)
    translations: Record<string, number>;
  };
}

export interface Subscription {
  planId: string;
  status: Status;
  currentPeriodEnd: Date | number | FieldValue;
  billingCycle: "monthly" | "yearly";
  cancelAtPeriodEnd: boolean;
  lemonSqueezySubscriptionId?: string;
  lemonSqueezyProductName?: string;
  lemonSqueezyProductId?: number;
  lemonSqueezyVariantId?: number;
  lemonSqueezyVariantName?: string;
  maxTranslationsPerMonth: number;
  maxWorkspaces: number;
}

export interface User {
  uid: string;
  email: string;
  companyName: string | null;
  photoURL?: string;
  workspaces: string[]; // Workspace IDs
  defaultWorkspace?: string;
  createdAt: Date | number | FieldValue;
  subscription: Subscription;
  usage: {
    totalTranslations: Record<string, number>;
  };
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  pricing: {
    monthly: number | string;
    yearly: number | string;
  };
  features: string[];
  limits: {
    maxTranslationsPerMonth: number;
    maxWorkspaces: number;
  };
  recommended?: boolean;
}
