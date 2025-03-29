"use server";
import { adminAuth } from "@/lib/server/firebase-admin";
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
