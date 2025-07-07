import { Plan } from "./models";

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams just getting started",
    pricing: {
      monthly: 5,
      yearly: 5 * 12 * 0.8, // 20% discount for yearly billing
    },
    features: [
      "100 translations per month",
      "Basic support",
      "Standard response styles",
    ],
    limits: {
      maxTranslationsPerMonth: 100,
      maxWorkspaces: 1,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams with more needs",
    pricing: {
      monthly: 10,
      yearly: 10 * 12 * 0.8, // 20% discount for yearly billing
    },
    features: [
      "1,000 translations per month",
      "Priority support",
      "Analytics dashboard",
      "Custom response styles",
    ],
    limits: {
      maxTranslationsPerMonth: 1000,
      maxWorkspaces: 5,
    },
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Lifetime",
    description: "Lifetime subscription",
    pricing: {
      monthly: "180",
      yearly: "180",
    },
    features: [
      "Unlimited translations",
      "Custom integrations",
      "On-premise deployment option",
      "Advanced security features",
    ],
    limits: {
      maxTranslationsPerMonth: 1500,
      maxWorkspaces: 0,
    },
  },
];
