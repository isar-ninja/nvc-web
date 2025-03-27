import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { getUser, updateUser } from "@/lib/server/db-service";

export async function PUT(req: NextRequest) {
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

    // Get the user to update their subscription
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const { planId, billingCycle, maxTranslationsPerMonth, maxWorkspaces } =
      await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    if (billingCycle !== "monthly" && billingCycle !== "yearly") {
      return NextResponse.json(
        { error: "Billing cycle must be monthly or yearly" },
        { status: 400 },
      );
    }

    // Update the user's subscription
    // In a real app, you would integrate with Stripe here
    const updateData: Record<string, any> = {};

    // Use dot notation for nested fields to avoid TypeScript issues
    updateData["subscription.planId"] = planId;
    updateData["subscription.status"] =
      planId === "free" ? "active" : "trialing";
    updateData["subscription.currentPeriodEnd"] = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ); // 14 days trial
    updateData["subscription.billingCycle"] = billingCycle;

    // Update limits if provided
    if (maxTranslationsPerMonth !== undefined) {
      updateData["subscription.maxTranslationsPerMonth"] =
        maxTranslationsPerMonth;
    }

    if (maxWorkspaces !== undefined) {
      updateData["subscription.maxWorkspaces"] = maxWorkspaces;
    }

    // Update the user
    await updateUser(uid, updateData);

    // Get the updated user data
    const updatedUser = await getUser(uid);

    return NextResponse.json({
      user: {
        uid: updatedUser?.uid,
        email: updatedUser?.email,
        subscription: updatedUser?.subscription,
      },
    });
  } catch (error) {
    console.error("Error updating user subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}
