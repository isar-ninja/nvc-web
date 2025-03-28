"use server";
import { adminAuth, adminDb } from "@/lib/server/firebase-admin";
import { Subscription, User } from "@/lib/shared/models";
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

export async function createCookie(idToken: string) {
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
}

export async function verifyCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token) throw new Error("No token found");
    await adminAuth.verifySessionCookie(token.value);
    return {
      valid: true,
      message: "Cookie verified successfully",
    };
  } catch (err: any) {
    return { valid: false, message: err.message };
  }
}

export async function deleteCookie() {
  (await cookies()).delete(COOKIE_NAME);
}
