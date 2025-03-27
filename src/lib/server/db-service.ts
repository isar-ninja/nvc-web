import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { User, Workspace } from "@/lib/shared/models";
import { adminDb } from "./firebase-admin";

// User Functions
export async function getUser(uid: string): Promise<User | null> {
  try {
    const userRef = adminDb.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as any;
    return {
      ...data,
      uid: doc.id,
      createdAt: convertTimestampToDate(data.createdAt),
      subscription: data.subscription || {
        planId: "free",
        status: "trialing",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        billingCycle: "monthly",
        maxTranslationsPerMonth: 100,
        maxWorkspaces: 1,
      },
      usage: data.usage || { totalTranslations: {} },
    } as User;
  } catch (error) {
    console.error(`Error getting user ${uid}:`, error);
    throw error;
  }
}

export async function updateUser(
  uid: string,
  data: Partial<User>,
): Promise<void> {
  try {
    const userRef = adminDb.collection("users").doc(uid);

    // Create a copy of data for processing
    const processedData: any = { ...data };

    // Handle timestamp conversions
    if (data.createdAt instanceof Date) {
      processedData.createdAt = Timestamp.fromDate(data.createdAt);
    }

    // Handle subscription date conversions if they exist
    if (data.subscription?.currentPeriodEnd instanceof Date) {
      // Create a new subscription object to avoid modifying the original
      processedData.subscription = {
        ...(data.subscription || {}),
      };

      // Convert the Date to Timestamp
      processedData.subscription.currentPeriodEnd = Timestamp.fromDate(
        data.subscription.currentPeriodEnd,
      );
    }

    await userRef.update(processedData);
  } catch (error) {
    console.error(`Error updating user ${uid}:`, error);
    throw error;
  }
}
// Workspace Functions
export async function createWorkspace(
  workspaceData: Omit<Workspace, "id" | "createdAt">,
): Promise<Workspace> {
  const workspaceRef = adminDb.collection("workspaces").doc();

  const newWorkspace: Workspace = {
    id: workspaceRef.id,
    ...workspaceData,
    createdAt: FieldValue.serverTimestamp(),
    usage: workspaceData.usage || { translations: {} },
  };

  await workspaceRef.set(newWorkspace);

  // Update user's workspaces array
  const userRef = adminDb.collection("users").doc(workspaceData.ownerId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const userData = userDoc.data() as User;
    const updatedWorkspaces = [...(userData.workspaces || []), workspaceRef.id];

    await userRef.update({
      workspaces: updatedWorkspaces,
      defaultWorkspace: userData.defaultWorkspace || workspaceRef.id,
    });
  }

  // Convert the serverTimestamp to a Date for the return value
  return {
    ...newWorkspace,
    createdAt: new Date(),
  };
}

// Helper function to safely convert Firestore timestamps to Date objects
function convertTimestampToDate(timestampValue: any): Date {
  if (timestampValue instanceof Date) {
    return timestampValue;
  }

  // If it's a Firestore Timestamp
  if (timestampValue && typeof timestampValue.toDate === "function") {
    return timestampValue.toDate();
  }

  // If it's a Unix timestamp (seconds or milliseconds)
  if (typeof timestampValue === "number") {
    // If it's seconds (Firestore uses seconds)
    if (timestampValue < 10000000000) {
      return new Date(timestampValue * 1000);
    }
    // If it's milliseconds
    return new Date(timestampValue);
  }

  // Default fallback
  return new Date();
}

// Other server-side database functions
export async function getWorkspace(id: string): Promise<Workspace | null> {
  try {
    const workspaceRef = adminDb.collection("workspaces").doc(id);
    const doc = await workspaceRef.get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as any;
    return {
      ...data,
      id: doc.id,
      createdAt: convertTimestampToDate(data.createdAt),
      usage: data.usage || { translations: {} },
    } as Workspace;
  } catch (error) {
    console.error(`Error getting workspace ${id}:`, error);
    throw error;
  }
}

export async function updateWorkspace(
  id: string,
  data: Partial<Workspace>,
): Promise<void> {
  try {
    const workspaceRef = adminDb.collection("workspaces").doc(id);

    // Convert Dates to Timestamps for Firestore if they exist in the data
    const processedData = { ...data };

    if (data.createdAt instanceof Date) {
      processedData.createdAt = Timestamp.fromDate(data.createdAt);
    }

    await workspaceRef.update(processedData);
  } catch (error) {
    console.error(`Error updating workspace ${id}:`, error);
    throw error;
  }
}

export async function recordTranslation(workspaceId: string): Promise<void> {
  const monthKey = getCurrentMonthKey();

  try {
    // Use a transaction to safely update the counter
    await adminDb.runTransaction(async (transaction) => {
      const workspaceRef = adminDb.collection("workspaces").doc(workspaceId);
      const doc = await transaction.get(workspaceRef);

      if (!doc.exists) return;

      const data = doc.data() as any;
      const currentCount = data.usage?.translations?.[monthKey] || 0;

      transaction.update(workspaceRef, {
        [`usage.translations.${monthKey}`]: currentCount + 1,
      });
    });
  } catch (error) {
    console.error(
      `Error recording translation for workspace ${workspaceId}:`,
      error,
    );
    throw error;
  }
}

// Utility functions
export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getTranslationsThisMonth(workspace: Workspace): number {
  const monthKey = getCurrentMonthKey();
  return workspace.usage?.translations?.[monthKey] || 0;
}

export async function canPerformTranslation(
  workspaceId: string,
  maxTranslations: number,
): Promise<boolean> {
  try {
    const workspace = await getWorkspace(workspaceId);
    if (!workspace) return false;

    const translationsThisMonth = getTranslationsThisMonth(workspace);
    return translationsThisMonth < maxTranslations;
  } catch (error) {
    console.error(
      `Error checking translation limit for workspace ${workspaceId}:`,
      error,
    );
    // In case of error, return false to be safe
    return false;
  }
}
