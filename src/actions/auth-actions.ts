"use server";
import { adminDb } from "@/lib/server/firebase-admin";
import { User } from "@/lib/shared/models";
import { FieldValue } from "firebase-admin/firestore";

export async function createUserAction(
  userData: Omit<User, "createdAt">,
): Promise<User> {
  try {
    const userRef = adminDb.collection("users").doc(userData.uid);

    const newUser: User = {
      ...userData,
      createdAt: FieldValue.serverTimestamp(),
    };

    await userRef.set(newUser);

    // Convert the server timestamp to Date for the return value
    return {
      ...newUser,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error(`Error creating user ${userData.uid}:`, error);
    throw error;
  }
}
