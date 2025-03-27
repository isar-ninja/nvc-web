import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { createServerUser, getUser } from "@/lib/server/db-service";
import { Subscription } from "@/lib/shared/models";

export async function POST(req: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get user info from Firebase Auth
    const userRecord = await adminAuth.getUser(uid);

    // Check if user already exists in our database
    const existingUser = await getUser(uid);
    if (existingUser) {
      // User already exists, just return the existing data
      return NextResponse.json({ user: existingUser });
    }

    // Initial subscription settings for new users
    const initialSubscription: Subscription = {
      planId: "free",
      status: "trialing",
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
      billingCycle: "monthly",
      cancelAtPeriodEnd: false,
      maxTranslationsPerMonth: 15,
      maxWorkspaces: 1,
    };

    // Create new user with initial subscription
    const newUser = await createServerUser({
      uid,
      email: userRecord.email || "",
      displayName: userRecord.displayName || "",
      photoURL: userRecord.photoURL || "",
      workspaces: [],
      subscription: initialSubscription,
      usage: { totalTranslations: {} },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
