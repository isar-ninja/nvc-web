import { Subscription } from "@/lib/shared/models";
import {
  cancelSubscription,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

export async function cancelLemonSubscription(subscription: Subscription) {
  try {
    // Initialize the Lemon Squeezy SDK
    lemonSqueezySetup({
      apiKey: process.env.LEMONSQUEEZY_API_KEY || "",
    });

    // Cancel the subscription using the dedicated cancelSubscription function
    const { statusCode, error, data } = await cancelSubscription(
      subscription.lemonSqueezySubscriptionId!,
    );

    if (error || !data) {
      console.error(
        "Error canceling subscription:",
        error?.message || "Unknown error",
      );
      throw new Error(error?.message || "Unknown error");
    } else {
      console.log(
        `Successfully cancelled subscription ${subscription.lemonSqueezySubscriptionId}`,
      );
    }
    return { statusCode, data };
  } catch (subscriptionError) {
    console.error(
      "Unexpected error canceling subscription:",
      subscriptionError,
    );
    // Continue with account deletion even if subscription cancellation fails
  }
}
