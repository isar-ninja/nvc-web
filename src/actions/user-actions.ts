"use server";
import { adminDb } from "@/lib/server/firebase-admin";
import { Subscription, User } from "@/lib/shared/models";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { verifyCookie } from "./auth-actions";

export async function createUserAction(): Promise<User> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not found");
    const userRef = adminDb.collection("users").doc(user.uid);

    const initialSubscription: Subscription = {
      planId: "free",
      status: "trialing",
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
      billingCycle: "monthly",
      cancelAtPeriodEnd: true,
      maxTranslationsPerMonth: 15,
      maxWorkspaces: 1,
    };

    const newUser: User = {
      uid: user.uid,
      email: user?.email || "",
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
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
    console.error(`Error creating user:`, error);
    throw error;
  }
}

/**
 * Get the current user's data from Firestore
 * @returns User object or null if not found
 */
export async function getUserAction(): Promise<User | null> {
  try {
    const { data: authUser } = await verifyCookie();
    if (!authUser) throw new Error("User not authenticated");

    const userRef = adminDb.collection("users").doc(authUser.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data() as any;

    // Convert Firestore Timestamp to Date
    return {
      ...userData,
      createdAt:
        userData.createdAt instanceof Timestamp
          ? userData.createdAt.toDate()
          : userData.createdAt instanceof Date
            ? userData.createdAt
            : new Date(),
      subscription: {
        ...userData.subscription,
        currentPeriodEnd:
          userData.subscription?.currentPeriodEnd instanceof Timestamp
            ? userData.subscription.currentPeriodEnd.toDate()
            : userData.subscription?.currentPeriodEnd,
      },
    } as User;
  } catch (error) {
    console.error(`Error getting user:`, error);
    throw error;
  }
}

/**
 * Update user data in Firestore
 * @param updateData Partial User object with fields to update
 * @returns Updated User object
 */
export async function updateUserAction(
  updateData: Partial<User>,
): Promise<User> {
  try {
    const { data: authUser } = await verifyCookie();
    if (!authUser) throw new Error("User not authenticated");

    const userRef = adminDb.collection("users").doc(authUser.uid);

    // Ensure we're not overwriting the user ID
    if (updateData.uid && updateData.uid !== authUser.uid) {
      throw new Error("Cannot change user ID");
    }
    if (updateData.subscription || updateData.usage || updateData.workspaces) {
      throw new Error("Cannot change user data");
    }

    // Remove any undefined values to avoid overwriting with undefined
    const cleanedUpdateData = Object.entries(updateData)
      .filter(([, value]) => value !== undefined)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Add updatedAt timestamp
    const finalUpdateData = {
      ...cleanedUpdateData,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await userRef.update(finalUpdateData);

    // Get the updated user data
    const updatedUser = await getUserAction();
    if (!updatedUser) {
      throw new Error("Failed to retrieve updated user data");
    }

    return updatedUser;
  } catch (error) {
    console.error(`Error updating user:`, error);
    throw error;
  }
}
