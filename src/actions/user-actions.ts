"use server";
import { adminAuth, adminDb } from "@/lib/server/firebase-admin";
import {
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { verifyCookie } from "./auth-actions";
import { convertTimestamps, isValidEmail } from "./action-utils";
import { cancelLemonSubscription } from "./lemon-actions";
import { Subscription, User } from "@/lib/shared/models";

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
      companyName: null,
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

    const userRef = adminDb
      .collection("users")
      .doc(authUser.uid)
      .withConverter(userConverter);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data() as any;
    // Convert Firestore Timestamp to Date
    return userData;
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
    if (
      typeof updateData.companyName === "string" &&
      updateData?.companyName?.length < 1
    ) {
      throw new Error("Company name is required");
    }
    if (
      typeof updateData.email === "string" &&
      !isValidEmail(updateData.email)
    ) {
      throw new Error("Email is not valid");
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

const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    // When writing to Firestore, we don't need to do any special conversion
    // (Dates are automatically converted to Timestamps)
    return user;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data();
    const userData = convertTimestamps(data) as User;
    return userData;
  },
};

export async function deleteAccountAction(): Promise<void> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not authenticated");

    // Get current user data
    const userData = await getUserAction();
    if (!userData) throw new Error("User data not found");

    // 1. Cancel subscription if user has one
    if (userData.subscription.lemonSqueezySubscriptionId) {
      await cancelLemonSubscription(userData.subscription as Subscription);
    }

    // 2. Start a batch to handle multiple Firestore operations
    const batch = adminDb.batch();

    // 3. Delete all user's workspaces and related data
    if (userData.workspaces && userData.workspaces.length > 0) {
      for (const workspaceId of userData.workspaces) {
        // Delete workspace document
        const workspaceRef = adminDb.collection("workspaces").doc(workspaceId);
        batch.delete(workspaceRef);

        // Delete any associated Slack installations
        // First, query for installations with this workspace ID
        const slackInstallationsQuery = await adminDb
          .collection("slackInstallations")
          .where("workspaceId", "==", workspaceId)
          .get();

        // Add delete operations to batch for each installation
        slackInstallationsQuery.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }
    }

    // 4. Delete any Slack installations directly associated with the user
    const userSlackInstallationsQuery = await adminDb
      .collection("slackInstallations")
      .where("userId", "==", user.uid)
      .get();

    userSlackInstallationsQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 5. Delete user document from Firestore
    const userRef = adminDb.collection("users").doc(user.uid);
    batch.delete(userRef);

    // 6. Execute the batch
    await batch.commit();

    // 7. Finally delete the user from Firebase Auth
    await adminAuth.deleteUser(user.uid);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}
