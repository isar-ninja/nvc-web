import { adminDb } from "@/lib/server/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import crypto from "crypto";
import { getPlans } from "@/actions/plan-actions";
import { Plan } from "@/lib/shared/models";

// Your Lemon Squeezy signing secret from environment variables
const LEMONSQUEEZY_SIGNING_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

// Define webhook event types
type LemonSqueezyEvent =
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_success" // Added payment success event
  | "subscription_payment_failed" // Added payment failed event
  | "order_created"
  | "order_refunded";

// Verify the webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
): boolean {
  if (!signature || !LEMONSQUEEZY_SIGNING_SECRET) return false;

  try {
    const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_SIGNING_SECRET);
    const digest = Buffer.from(hmac.update(payload).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    // Use timing-safe comparison to prevent timing attacks
    return (
      digest.length === signatureBuffer.length &&
      crypto.timingSafeEqual(digest, signatureBuffer)
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body
    const payload = await request.text();
    const signature = request.headers.get("X-Signature");

    // Verify webhook signature
    // Skip verification in development or test mode if needed
    const skipVerification =
      process.env.NODE_ENV === "development" ||
      process.env.SKIP_WEBHOOK_VERIFICATION === "true";

    if (!skipVerification && !verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the request body
    const webhookData = JSON.parse(payload);
    const { meta, data: eventData } = webhookData;
    const eventName = meta.event_name as LemonSqueezyEvent;

    console.log(`Received Lemon Squeezy event: ${eventName}`);

    // Extract the user_id from custom data in meta
    const userId = meta.custom_data?.user_id;

    if (!userId) {
      console.log("No user_id found in webhook custom_data", eventData);
    } else {
      console.log(`Found user_id in custom_data: ${userId}`);
    }

    let billingCycle: string = "monthly";
    if (eventData?.attributes?.variant_name) {
      const variantName = eventData.attributes.variant_name;
      const variantNameLower = variantName.toLowerCase();
      if (
        variantNameLower.includes("annual") ||
        variantNameLower.includes("annually") ||
        variantNameLower.includes("yearly") ||
        variantNameLower.includes("year")
      ) {
        billingCycle = "yearly";
      } else if (
        variantNameLower.includes("month") ||
        variantNameLower.includes("monthly")
      ) {
        billingCycle = "monthly";
      }
    }

    // Process based on event type
    switch (eventName) {
      case "subscription_created":
        // When subscription is created, set it to "pending" until payment is confirmed
        const plan = await getPlanDetails(eventData.attributes.variant_name);
        return await handleSubscriptionCreated(
          eventData,
          plan,
          billingCycle,
          userId,
        );

      case "subscription_payment_success":
        // When payment succeeds, set subscription to "active"
        return await handleSubscriptionPaymentSuccess(eventData, userId);

      case "subscription_payment_failed":
        // Handle failed payment
        return await handleSubscriptionPaymentFailed(eventData, userId);

      case "subscription_updated":
        // Regular update (not related to payment)
        const updatePlan = await getPlanDetails(
          eventData.attributes.variant_name,
        );
        return await handleSubscriptionUpdate(
          eventData,
          updatePlan,
          billingCycle,
          userId,
        );

      case "subscription_cancelled":
        return await handleSubscriptionCancellation(eventData, userId);

      case "order_created":
        // For order_created, we'll just log but not take action on subscription
        console.log(`Order created, waiting for subscription events`);
        break;

      default:
        console.log(`Unhandled event type: ${eventName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Handle initial subscription creation - mark as pending
async function handleSubscriptionCreated(
  eventData: any,
  plan: Plan,
  billingCycle: string,
  userId?: string,
) {
  try {
    if (!eventData || !eventData.attributes) {
      console.error("Invalid event data structure", eventData);
      return NextResponse.json({
        success: false,
        error: "Invalid data structure",
      });
    }

    const subscriptionId = eventData.id;
    const attributes = eventData.attributes;
    const variantName = attributes.variant_name.toLowerCase();
    const planId = variantName.includes("starter") ? "starter" : "pro";
    const customerId = attributes.customer_id;
    const customerEmail = attributes.user_email;

    console.log(
      `Processing new subscription ID: ${subscriptionId}, setting status to pending`,
    );

    // Find the user
    let uid = userId;
    if (!uid) {
      const usersRef = adminDb.collection("users");
      const userSnapshot = await usersRef
        .where("email", "==", customerEmail)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        uid = userSnapshot.docs[0].id;
      } else {
        console.error(
          `No user found with email: ${customerEmail} and no user_id provided`,
        );
        return NextResponse.json({ success: false });
      }
    }

    // Subscription data with pending status
    const maxTranslationsPerMonth = plan.limits.maxTranslationsPerMonth;
    const maxWorkspaces = plan.limits.maxWorkspaces;

    // Calculate renewal date
    const currentPeriodEnd = attributes.ends_at
      ? new Date(attributes.ends_at).getTime()
      : attributes.renews_at
        ? new Date(attributes.renews_at).getTime()
        : null;

    // Update user with pending subscription
    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        "subscription.planId": planId,
        "subscription.status": "pending", // Mark as pending until payment confirmed
        "subscription.billingCycle": billingCycle,
        "subscription.currentPeriodEnd": currentPeriodEnd
          ? Timestamp.fromMillis(currentPeriodEnd)
          : null,
        "subscription.cancelAtPeriodEnd": false,
        "subscription.lemonSqueezySubscriptionId": subscriptionId,
        "subscription.lemonSqueezyProductId": attributes.product_id,
        "subscription.lemonSqueezyVariantId": attributes.variant_id,
        "subscription.lemonSqueezyVariantName": attributes.variant_name,
        "subscription.lemonSqueezyProductName": attributes.product_name,
        "subscription.maxTranslationsPerMonth": maxTranslationsPerMonth,
        "subscription.maxWorkspaces": maxWorkspaces,
        "subscription.updatedAt": Timestamp.now(),
        lemonSqueezyCustomerId: customerId,
        updatedAt: Timestamp.now(),
      });

    console.log(
      `Created pending subscription for user ${uid}: plan ${planId} (${subscriptionId})`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling subscription creation:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Handle successful payment - mark subscription as active
async function handleSubscriptionPaymentSuccess(
  eventData: any,
  userId?: string,
) {
  try {
    if (!eventData || !eventData.attributes) {
      console.error("Invalid payment success data structure", eventData);
      return NextResponse.json({ success: false });
    }

    const subscriptionId = eventData.attributes.subscription_id;
    console.log(
      `Processing successful payment for subscription ${subscriptionId}`,
    );

    // Find the user - first by userId, then by subscriptionId
    let uid = userId;
    if (!uid) {
      const usersRef = adminDb.collection("users");
      const userSnapshot = await usersRef
        .where("subscription.lemonSqueezySubscriptionId", "==", subscriptionId)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        uid = userSnapshot.docs[0].id;
      } else {
        console.error(`No user found with subscription ID: ${subscriptionId}`);
        console.error(
          `No user found with subscription email: ${eventData.attributes.user_email}`,
        );
        return NextResponse.json({ success: false });
      }
    }

    // Update subscription to active status
    await adminDb.collection("users").doc(uid).update({
      "subscription.status": "active", // Now we confirm it's active
      "subscription.updatedAt": Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(
      `Activated subscription ${subscriptionId} for user ${uid} after successful payment`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling successful payment:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Handle failed payment
async function handleSubscriptionPaymentFailed(
  eventData: any,
  userId?: string,
) {
  try {
    if (!eventData || !eventData.attributes) {
      console.error("Invalid payment failed data structure", eventData);
      return NextResponse.json({ success: false });
    }

    const subscriptionId = eventData.attributes.subscription_id;
    console.log(`Processing failed payment for subscription ${subscriptionId}`);

    // Find the user
    let uid = userId;
    if (!uid) {
      const usersRef = adminDb.collection("users");
      const userSnapshot = await usersRef
        .where("subscription.lemonSqueezySubscriptionId", "==", subscriptionId)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        uid = userSnapshot.docs[0].id;
      } else {
        console.error(`No user found with subscription ID: ${subscriptionId}`);
        return NextResponse.json({ success: false });
      }
    }

    // Update subscription to reflect payment failure
    await adminDb.collection("users").doc(uid).update({
      "subscription.status": "past_due", // Mark as past due
      "subscription.updatedAt": Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(
      `Marked subscription ${subscriptionId} as past_due for user ${uid} after payment failure`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling failed payment:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Handle general subscription updates (not payment related)
async function handleSubscriptionUpdate(
  eventData: any,
  plan: Plan,
  billingCycle: string,
  userId?: string,
) {
  try {
    // Most of the original update logic remains the same
    if (!eventData || !eventData.attributes) {
      console.error("Invalid event data structure", eventData);
      return NextResponse.json({ success: false });
    }

    const subscriptionId = eventData.id;
    const attributes = eventData.attributes;
    const variantName = attributes.variant_name.toLowerCase();
    const planId = variantName.includes("starter") ? "starter" : "pro";
    const customerId = attributes.customer_id;
    const customerEmail = attributes.user_email;
    const status = attributes.status; // We'll use the status from Lemon Squeezy

    // Find user
    let uid = userId;
    if (!uid) {
      const usersRef = adminDb.collection("users");
      const userSnapshot = await usersRef
        .where("email", "==", customerEmail)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        uid = userSnapshot.docs[0].id;
      } else {
        console.error(`No user found with email: ${customerEmail}`);
        return NextResponse.json({ success: false });
      }
    }

    // Update subscription - normal update case
    const maxTranslationsPerMonth = plan.limits.maxTranslationsPerMonth;
    const maxWorkspaces = plan.limits.maxWorkspaces;

    const currentPeriodEnd = attributes.ends_at
      ? new Date(attributes.ends_at).getTime()
      : attributes.renews_at
        ? new Date(attributes.renews_at).getTime()
        : null;

    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        "subscription.planId": planId,
        "subscription.status": status, // Use status from Lemon Squeezy
        "subscription.billingCycle": billingCycle,
        "subscription.currentPeriodEnd": currentPeriodEnd
          ? Timestamp.fromMillis(currentPeriodEnd)
          : null,
        "subscription.cancelAtPeriodEnd": !!attributes.cancelled,
        "subscription.lemonSqueezySubscriptionId": subscriptionId,
        "subscription.lemonSqueezyProductId": attributes.product_id,
        "subscription.lemonSqueezyVariantId": attributes.variant_id,
        "subscription.lemonSqueezyVariantName": attributes.variant_name,
        "subscription.lemonSqueezyProductName": attributes.product_name,
        "subscription.maxTranslationsPerMonth": maxTranslationsPerMonth,
        "subscription.maxWorkspaces": maxWorkspaces,
        "subscription.updatedAt": Timestamp.now(),
        lemonSqueezyCustomerId: customerId,
        updatedAt: Timestamp.now(),
      });

    console.log(
      `Updated subscription for user ${uid} to plan ${planId} (${subscriptionId})`,
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling subscription update:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Handle subscription cancellations
async function handleSubscriptionCancellation(eventData: any, userId?: string) {
  try {
    if (!eventData || !eventData.attributes) {
      console.error("Invalid event data structure", eventData);
      return NextResponse.json({ success: false });
    }

    const subscriptionId = eventData.id;
    const attributes = eventData.attributes;
    const customerId = attributes.customer_id;

    console.log(
      `Processing cancellation for subscription ID: ${subscriptionId}`,
    );

    // Find user
    let uid = userId;
    if (!uid) {
      const usersRef = adminDb.collection("users");
      const userSnapshot = await usersRef
        .where("lemonSqueezyCustomerId", "==", customerId)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        uid = userSnapshot.docs[0].id;
      } else {
        console.error(
          `No user found with Lemon Squeezy customer ID: ${customerId}`,
        );
        return NextResponse.json({ success: false });
      }
    }

    // Update user subscription to show cancellation
    await adminDb.collection("users").doc(uid).update({
      "subscription.status": "cancelled",
      "subscription.cancelAtPeriodEnd": true,
      "subscription.updatedAt": Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`Cancelled subscription ${subscriptionId} for user ${uid}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getPlanDetails(variantName: string): Promise<Plan> {
  const plans = await getPlans();
  const plan = plans.find((plan: Plan) =>
    variantName.toLowerCase().includes(plan.name.toLowerCase()),
  );
  return plan!;
}
