import { adminDb } from "@/lib/server/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import crypto from "crypto";

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
  | "order_created"
  | "order_refunded";

// Subscription status mapping
const subscriptionStatusMap: Record<string, string> = {
  active: "active",
  paused: "paused",
  past_due: "past_due",
  unpaid: "unpaid",
  cancelled: "cancelled",
  expired: "expired",
};

// Plan ID mapping (Lemon Squeezy product IDs to your internal plan IDs)
// Update these with your actual product IDs
const planIdMap: Record<string, string> = {
  "1096066": "starter", // Example - update with your actual product ID
  "1096067": "pro", // Example - update with your actual product ID
};

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

    console.log(`Received Lemon Squeezy eventData:`, eventData);
    console.log(`Received Lemon Squeezy metadata:`, meta);

    // Extract the user_id from custom data in meta
    const userId = meta.custom_data?.user_id;

    if (!userId) {
      console.warn("No user_id found in webhook custom_data", meta);
    } else {
      console.log(`Found user_id in custom_data: ${userId}`);
    }

    // Process based on event type
    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
        await handleSubscriptionUpdate(eventData, userId);
        break;
      case "subscription_cancelled":
        await handleSubscriptionCancellation(eventData, userId);
        break;
      case "order_created":
        await handleOrderCreated(eventData, userId);
        break;
      // Add other event types as needed
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

// Handle subscription creation and updates
async function handleSubscriptionUpdate(eventData: any, userId?: string) {
  try {
    if (!eventData || !eventData.attributes) {
      console.error("Invalid event data structure", eventData);
      return;
    }

    // The subscription ID is in eventData.id, not in attributes
    const subscriptionId = eventData.id;

    if (!subscriptionId) {
      console.error("Could not find subscription ID in event data");
      return;
    }

    const attributes = eventData.attributes;
    const customerId = attributes.customer_id;
    const status = subscriptionStatusMap[attributes.status] || "unknown";
    const productId = attributes.product_id;
    const variantId = attributes.variant_id;
    const planId = planIdMap[productId.toString()] || "starter"; // Default to starter if no mapping
    const billingCycle = attributes.billing_anchor === 1 ? "monthly" : "yearly";
    const productName = attributes.product_name;
    const variantName = attributes.variant_name;

    console.log(
      `Processing subscription ID: ${subscriptionId} for product: ${productName} (${productId}), variant: ${variantName}, mapped to plan: ${planId}`,
    );

    // If we have a userId from custom_data, use it directly
    let uid = userId;

    // If no userId from custom_data, try to find user with customer ID
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
          `No user found with Lemon Squeezy customer ID: ${customerId} and no user_id was provided in custom_data`,
        );
        return;
      }
    }

    // Set subscription data based on the plan
    let maxTranslationsPerMonth = 15; // Default value
    let maxWorkspaces = 1; // Default value

    // Set limits based on plan
    if (planId === "starter") {
      maxTranslationsPerMonth = 300;
      maxWorkspaces = 3;
    } else if (planId === "pro") {
      maxTranslationsPerMonth = 1000;
      maxWorkspaces = 10;
    }

    // Calculate currentPeriodEnd
    const currentPeriodEnd = attributes.ends_at
      ? new Date(attributes.ends_at).getTime()
      : attributes.renews_at
        ? new Date(attributes.renews_at).getTime()
        : Date.now() + 30 * 24 * 60 * 60 * 1000; // Fallback to 30 days from now

    // Update user subscription using dot notation to ensure we don't lose any existing fields
    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        "subscription.planId": planId,
        "subscription.status": status,
        "subscription.billingCycle": billingCycle,
        "subscription.currentPeriodEnd": Timestamp.fromMillis(currentPeriodEnd),
        "subscription.cancelAtPeriodEnd": !!attributes.cancelled,
        "subscription.lemonSqueezySubscriptionId": subscriptionId,
        "subscription.lemonSqueezyProductId": productId,
        "subscription.lemonSqueezyVariantId": variantId,
        "subscription.lemonSqueezyVariantName": variantName,
        "subscription.lemonSqueezyProductName": productName,
        "subscription.maxTranslationsPerMonth": maxTranslationsPerMonth,
        "subscription.maxWorkspaces": maxWorkspaces,
        "subscription.updatedAt": Timestamp.now(),
        lemonSqueezyCustomerId: customerId,
        updatedAt: Timestamp.now(),
      });

    console.log(
      `Updated subscription for user ${uid} to plan ${planId} (${subscriptionId})`,
    );
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}

// Handle subscription cancellations
async function handleSubscriptionCancellation(eventData: any, userId?: string) {
  try {
    if (!eventData || !eventData.attributes) {
      console.error("Invalid event data structure", eventData);
      return;
    }

    // The subscription ID is in eventData.id
    const subscriptionId = eventData.id;

    const attributes = eventData.attributes;
    const customerId = attributes.customer_id;

    console.log(
      `Processing cancellation for subscription ID: ${subscriptionId}`,
    );

    // If we have a userId from custom_data, use it directly
    let uid = userId;

    // If no userId from custom_data, try to find user with customer ID
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
          `No user found with Lemon Squeezy customer ID: ${customerId} and no user_id was provided in custom_data`,
        );
        return;
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
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

// Handle new orders
async function handleOrderCreated(eventData: any, userId?: string) {
  const attributes = eventData.attributes;
  const customerId = attributes.customer_id;
  const customerEmail = attributes.customer_email;

  // If we have a userId from custom_data, use it directly
  let uid = userId;

  // If no userId provided, try to find user by email
  if (!uid) {
    const usersRef = adminDb.collection("users");
    const userSnapshot = await usersRef
      .where("email", "==", customerEmail)
      .limit(1)
      .get();

    if (!userSnapshot.empty) {
      uid = userSnapshot.docs[0].id;
    } else {
      console.log(
        `No user found with email: ${customerEmail} and no user_id was provided in custom_data`,
      );
      return;
    }
  }

  // Update the user with Lemon Squeezy customer ID
  await adminDb.collection("users").doc(uid).update({
    lemonSqueezyCustomerId: customerId,
    updatedAt: Timestamp.now(),
  });

  console.log(
    `Updated user ${uid} with Lemon Squeezy customer ID: ${customerId}`,
  );
}
