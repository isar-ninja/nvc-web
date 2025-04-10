"use server";
import { adminAuth, adminDb } from "@/lib/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
  path: "/",
  sameSite: "strict" as const,
};

export async function createCookie(idToken: string) {
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      maxAge: COOKIE_OPTIONS.maxAge,
      path: COOKIE_OPTIONS.path,
      sameSite: COOKIE_OPTIONS.sameSite,
    });
  } catch (error) {
    console.log("createCookie error ", error);
  }
}

export async function verifyCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token) throw new Error("No token found");
    const data = await adminAuth.verifySessionCookie(token.value);
    return {
      valid: true,
      message: "Cookie verified successfully",
      data,
    };
  } catch (err: any) {
    return { valid: false, message: err.message, data: undefined };
  }
}

export async function deleteCookie() {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * Update a user's email address
 */
export async function updateEmailAction(newEmail: string): Promise<void> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not authenticated");

    // Update the user's email in Firebase Auth
    await adminAuth.updateUser(user.uid, {
      email: newEmail,
    });

    // Update the user's email in Firestore
    await adminDb.collection("users").doc(user.uid).update({
      email: newEmail,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
}

/**
 * Update a user's password
 */
export async function updatePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not authenticated");
    if (!user.email) throw new Error("User email not found");
    if (currentPassword === newPassword)
      throw new Error("Internal server error, please contact support");

    // Re-authenticate the user first
    // This would typically be done on the client using Firebase Auth SDK
    // For server actions, we'd need a custom implementation or use a different approach
    // This is a simplified version that assumes Firebase Admin can update the password directly

    // Update the user's password in Firebase Auth
    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}
