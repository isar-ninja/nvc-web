import { FieldValue } from "firebase-admin/firestore";

export const stati = [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
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
  subscription: {
    planId: string;
    status: Status;
    currentPeriodEnd: Date | number;
    billingCycle: "monthly" | "yearly";
    cancelAtPeriodEnd: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  usage: {
    // Keep track of translations by month (e.g., "2023-10": 157)
    translations: Record<string, number>;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  workspaces: string[]; // Workspace IDs
  defaultWorkspace?: string;
  createdAt: Date | number | FieldValue;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  limits: {
    maxUsers: number;
    maxTranslationsPerMonth: number;
  };
  pricing: {
    monthly: number;
    yearly: number;
  };
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
}
