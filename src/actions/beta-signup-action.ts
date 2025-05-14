"use server";
import { adminDb } from "@/lib/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function subscribeToMailAction(
  email: string,
): Promise<Record<string, string>> {
  try {
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists
    const subscribersRef = adminDb.collection("email-subscribers");
    const existingSubscriber = await subscribersRef
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingSubscriber.empty) {
      return {
        success: "true",
        message: "You're already on our list!",
      };
    }

    // Add new subscriber
    await subscribersRef.add({
      email,
      createdAt: FieldValue.serverTimestamp(),
      source: "beta-signup",
      status: "active",
    });

    return {
      success: "true",
      message: "Thanks for subscribing! We'll keep you updated.",
    };
  } catch (error) {
    console.error(`Error adding subscriber:`, error);
    throw error;
  }
}
