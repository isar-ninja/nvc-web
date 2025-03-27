import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { getUser, updateUser, getPlan } from "@/lib/server/db-service";
// import {
//   createLemonSqueezyCheckout,
//   getLemonSqueezyVariantId,
// } from "@/lib/server/payment-service";

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
    const { planId, billingCycle } = await req.json();

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

    // Check if the plan exists in the database (except "free" which is a special case)
    if (planId !== "free") {
      const plan = await getPlan(planId);
      if (!plan) {
        return NextResponse.json(
          { error: "Selected plan does not exist" },
          { status: 400 },
        );
      }
    }

    // For the free plan, we update the subscription directly without payment
    if (planId === "free") {
      // Set limits based on the free plan
      const maxTranslationsPerMonth = 100;
      const maxWorkspaces = 1;

      // Update the user's subscription
      const updateData: Record<string, any> = {};

      updateData["subscription.planId"] = "free";
      updateData["subscription.status"] = "active";
      updateData["subscription.billingCycle"] = billingCycle;
      updateData["subscription.maxTranslationsPerMonth"] =
        maxTranslationsPerMonth;
      updateData["subscription.maxWorkspaces"] = maxWorkspaces;

      // If they're coming from a paid plan, set cancelAtPeriodEnd to true
      if (
        user.subscription.planId !== "free" &&
        user.subscription.status === "active"
      ) {
        updateData["subscription.cancelAtPeriodEnd"] = true;
      } else {
        // Otherwise, update currentPeriodEnd to 14 days from now for new free trials
        updateData["subscription.currentPeriodEnd"] = new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        );
        updateData["subscription.cancelAtPeriodEnd"] = false;
      }

      // Update the user
      await updateUser(uid, updateData);

      // Get the updated user data
      const updatedUser = await getUser(uid);

      return NextResponse.json({
        success: true,
        user: {
          uid: updatedUser?.uid,
          email: updatedUser?.email,
          subscription: updatedUser?.subscription,
        },
      });
    }

    // For paid plans, create a LemonSqueezy checkout
    try {
      // Fetch the plan to get the actual limits
      // const plan = await getPlan(planId);

      // Get the variant ID for the selected plan and billing cycle
      // const variantId = getLemonSqueezyVariantId(planId, billingCycle);
      // if (!variantId) {
      //   return NextResponse.json(
      //     { error: "Invalid plan or billing cycle" },
      //     { status: 400 },
      //   );
      // }

      // Create checkout
      // const isUpgrade =
      //   user.subscription.planId !== "free" &&
      //   user.subscription.status === "active";

      // const checkoutData = await createLemonSqueezyCheckout({
      //   variantId,
      //   customerEmail: user.email,
      //   customerName: user.displayName || user.email,
      //   userId: uid,
      //   checkoutOptions: {
      //     // Pre-fill customer information
      //     email: user.email,
      //     name: user.displayName || undefined,
      //     // Custom data to identify the user in webhooks
      //     custom: {
      //       user_id: uid,
      //       plan_id: planId,
      //       billing_cycle: billingCycle,
      //     },
      //   },
      // });

      return NextResponse.json({
        success: true,
        checkoutUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Error creating LemonSqueezy checkout:", error);

      // If LemonSqueezy integration is not set up or fails, fallback to standard plan update
      // This would just be a simple direct update for testing purposes

      // Fetch the plan to get the actual limits
      const plan = await getPlan(planId);

      // Use the plan limits from the database
      const maxTranslationsPerMonth = plan!.limits.maxTranslationsPerMonth;
      const maxWorkspaces = plan!.limits.maxWorkspaces;

      // Update the user's subscription
      const updateData: Record<string, any> = {};

      updateData["subscription.planId"] = planId;
      updateData["subscription.status"] = "active"; // Set as active for testing
      updateData["subscription.currentPeriodEnd"] = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ); // 30 days
      updateData["subscription.billingCycle"] = billingCycle;
      updateData["subscription.maxTranslationsPerMonth"] =
        maxTranslationsPerMonth;
      updateData["subscription.maxWorkspaces"] = maxWorkspaces;
      updateData["subscription.cancelAtPeriodEnd"] = false;

      // Update the user
      await updateUser(uid, updateData);

      // Get the updated user data
      const updatedUser = await getUser(uid);

      return NextResponse.json({
        success: true,
        user: {
          uid: updatedUser?.uid,
          email: updatedUser?.email,
          subscription: updatedUser?.subscription,
        },
      });
    }
  } catch (error) {
    console.error("Error updating user subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}
