"use server";
import { getUser } from "@/lib/server/db-service";
import { adminAuth, adminDb } from "@/lib/server/firebase-admin";
import { Subscription, User } from "@/lib/shared/models";
import { FieldValue } from "firebase-admin/firestore";

export async function createUserAction(
  token: string,
  data: { uid: string; email: string; displayName: string; photoURL: string },
): Promise<User> {
  try {
    await adminAuth.verifyIdToken(token);
    const userRef = adminDb.collection("users").doc(data.uid);

    const initialSubscription: Subscription = {
      planId: "free",
      status: "trialing",
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
      billingCycle: "monthly",
      cancelAtPeriodEnd: false,
      maxTranslationsPerMonth: 15,
      maxWorkspaces: 1,
    };

    const newUser: User = {
      uid: data.uid,
      email: data?.email || "",
      displayName: data?.displayName || "",
      photoURL: data?.photoURL || "",
      workspaces: [],
      subscription: initialSubscription,
      usage: { totalTranslations: {} },
      createdAt: FieldValue.serverTimestamp(),
    };

    await userRef.set(newUser);

    // Convert the server timestamp to Date for the return value
    return {
      ...newUser,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error(`Error creating user ${data.uid}:`, error);
    throw error;
  }
}
