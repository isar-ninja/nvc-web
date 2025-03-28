"use server";
import { adminAuth } from "@/lib/server/firebase-admin";

export async function anyAction(
  token: string,
): Promise<Record<string, string>> {
  try {
    await adminAuth.verifyIdToken(token);
    return {};
  } catch (error) {
    console.error(`Error getting plans:`, error);
    throw error;
  }
}
