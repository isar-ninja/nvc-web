import { Plan } from "./models";

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams just getting started",
    pricing: {
      monthly: 9,
      yearly: 9 * 12 * 0.8, // 20% discount for yearly billing
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
      monthly: 29,
      yearly: 29 * 12 * 0.8, // 20% discount for yearly billing
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
    name: "Enterprise",
    description: "For large organizations",
    pricing: {
      monthly: "Custom",
      yearly: "Custom",
    },
    features: [
      "Unlimited translations",
      "24/7 dedicated support",
      "Custom integrations",
      "On-premise deployment option",
      "Advanced security features",
    ],
    limits: {
      maxTranslationsPerMonth: 0,
      maxWorkspaces: 0,
    },
  },
];
