"use server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { Plan } from "@/lib/shared/models";

export async function createUserAction(
  token: string,
): Promise<Record<string, Plan>> {
  try {
    await adminAuth.verifyIdToken(token);

    // Convert the server timestamp to Date for the return value
    return {};
  } catch (error) {
    console.error(`Error getting plans:`, error);
    throw error;
  }
}
