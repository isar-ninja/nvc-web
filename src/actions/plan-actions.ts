"use server";
import { adminDb } from "@/lib/server/firebase-admin";
import { Plan } from "@/lib/shared/models";

export async function getPlans(): Promise<Plan[]> {
  try {
    const plansRef = adminDb.collection("plans");
    const querySnapshot = await plansRef.get();

    const plans = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as Plan[];
    return sortPlans(plans);
  } catch (error) {
    console.error(`Error getting plans:`, error);
    throw error;
  }
}

function sortPlans(plans: Plan[]): Plan[] {
  return plans.sort((a, b) => {
    // If both are numbers, sort numerically
    if (
      typeof a.pricing.monthly === "number" &&
      typeof b.pricing.monthly === "number"
    ) {
      return a.pricing.monthly - b.pricing.monthly;
    }

    // Put plans with numeric prices before plans with non-numeric prices
    if (
      typeof a.pricing.monthly === "number" &&
      typeof b.pricing.monthly !== "number"
    ) {
      return -1;
    }

    if (
      typeof a.pricing.monthly !== "number" &&
      typeof b.pricing.monthly === "number"
    ) {
      return 1;
    }

    // If both are non-numeric, maintain their original order
    return 0;
  });
}
