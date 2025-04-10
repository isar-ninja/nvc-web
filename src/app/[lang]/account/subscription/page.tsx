"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle,
  MessageSquareText,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plan } from "@/lib/shared/models";
import Link from "next/link";
import Script from "next/script";
import { getPlans } from "@/actions/plan-actions";
import { useRouter } from "next/navigation";

const LEMON_SQUEEZY_URLS = {
  starter: (uid: string) =>
    `https://store.goodspeech.chat/buy/0a7a668c-c4fd-45b9-9f5a-c791c71c3b38?checkout[custom][user_id]=${uid}`,
  professional: (uid: string) =>
    `https://store.goodspeech.chat/buy/4493c79c-c8ed-4184-bbd2-e5ca89af827a?checkout[custom][user_id]=${uid}`, // Update with actual URL
  enterprise: `/enterprise`,
};
// 4242 4242 4242 4242
export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const { userData, firebaseUser } = useAuth();
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const availablePlans = await getPlans();
        setPlans(availablePlans);

        // If user has a subscription, preselect their current plan
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load subscription plans. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (userData?.subscription) {
      setSelectedPlanId(userData.subscription.planId);
      setBillingCycle(userData.subscription.billingCycle);
    }
  }, [userData]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
  };

  // Function to format price with dollar sign
  const formatPrice = (price: number | string) => {
    return typeof price === "number" ? `€${price}` : price;
  };

  // Function to get the monthly equivalent of yearly pricing
  const getMonthlyEquivalent = (yearlyPrice: number) => {
    return (yearlyPrice / 12).toFixed(0);
  };

  // Calculate if plan is an upgrade or downgrade
  const isPlanUpgrade = (planId: string) => {
    if (!userData) return false;
    if (userData.subscription.planId === planId) return false;

    // Simple logic based on plan hierarchy: free < basic < premium < enterprise
    const planHierarchy = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    return (
      planHierarchy[planId as keyof typeof planHierarchy] >
      planHierarchy[userData.subscription.planId as keyof typeof planHierarchy]
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <MessageSquareText className="h-10 w-10 text-primary mx-auto animate-pulse" />
          <p className="mt-4">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Script defer src="https://assets.lemonsqueezy.com/lemon.js" />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">
              Choose Your Subscription Plan
            </h1>
            <p className="text-gray-500">
              Select the plan that best fits your needs
            </p>

            {userData?.subscription &&
              userData.subscription.status !== "cancelled" && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 max-w-lg mx-auto">
                  <h2 className="font-semibold mb-1">Current Subscription</h2>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        userData.subscription.status === "active"
                          ? "success"
                          : "outline"
                      }
                    >
                      {userData.subscription.status}
                    </Badge>
                    <span className="font-medium capitalize">
                      {userData.subscription.planId} Plan
                    </span>
                    <span className="text-gray-500 text-sm">
                      {userData.subscription.planId !== "free" &&
                        `(${userData.subscription.billingCycle})`}
                    </span>

                    {userData.subscription.status === "active" &&
                      userData.subscription.currentPeriodEnd && (
                        <div className="text-sm text-gray-500 mt-1 w-full">
                          Next billing date:{" "}
                          {new Date(
                            userData.subscription.currentPeriodEnd as Date,
                          ).toLocaleDateString()}
                        </div>
                      )}
                  </div>
                  <Link href={`https://store.goodspeech.chat/billing`}>
                    <Button size="sm" className="mt-4 ">
                      Manage Subscription
                    </Button>
                  </Link>
                </div>
              )}

            {/* Billing cycle toggle */}
            <div className="mt-8">
              <RadioGroup
                className="flex gap-4 justify-center p-2 bg-gray-50 rounded-full w-fit mx-auto"
                value={billingCycle}
                onValueChange={(value) =>
                  setBillingCycle(value as "monthly" | "yearly")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="cursor-pointer">
                    Monthly
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <Label htmlFor="yearly" className="cursor-pointer">
                    Yearly
                    <Badge
                      variant="outline"
                      className="ml-2 bg-green-50 text-green-600 border-green-200"
                    >
                      Save up to 25%
                    </Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrentPlan = userData?.subscription.planId === plan.id;
              const price =
                billingCycle === "monthly"
                  ? plan.pricing.monthly
                  : plan.pricing.yearly;
              return (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-6 shadow-sm transition-all relative ${
                    isCurrentPlan ? "border-primary bg-primary/5" : ""
                  } ${
                    selectedPlanId === plan.id
                      ? "border-primary ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                      Current Plan
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {plan.id === "premium" && (
                        <Zap className="h-5 w-5 text-amber-500" />
                      )}
                      {plan.id === "enterprise" && (
                        <Shield className="h-5 w-5 text-indigo-500" />
                      )}
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-gray-500">{plan.description}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatPrice(price)}
                      </span>
                      <span className="ml-1 text-xl font-normal text-gray-500">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>

                    {billingCycle === "yearly" && plan.id !== "enterprise" && (
                      <div className="text-green-600 text-sm mt-1">
                        Save 20% with annual billing
                      </div>
                    )}

                    {billingCycle === "yearly" && typeof price === "number" && (
                      <div className="text-sm text-gray-500 mt-1">
                        ${getMonthlyEquivalent(price)}/mo equivalent
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Max Workspaces</span>
                      <span className="font-medium">
                        {plan.limits.maxWorkspaces}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Translations / Month</span>
                      <span className="font-medium">
                        {plan.limits.maxTranslationsPerMonth === null
                          ? "Unlimited"
                          : plan.limits.maxTranslationsPerMonth.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-gray-100"></div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button
                      variant={
                        selectedPlanId === plan.id ? "default" : "outline"
                      }
                      className="w-full"
                      onClick={() =>
                        plan.id === "enterprise"
                          ? router.push("/enterprise")
                          : handlePlanSelect(plan.id)
                      }
                      disabled={false}
                    >
                      {selectedPlanId === plan.id && plan.id !== "enterprise"
                        ? "Selected"
                        : plan.id === "enterprise"
                          ? "Get in touch"
                          : "Select Plan"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={
                selectedPlanId === "enterprise"
                  ? `${LEMON_SQUEEZY_URLS[selectedPlanId]}`
                  : `${LEMON_SQUEEZY_URLS[selectedPlanId]?.(firebaseUser?.uid) || ""}`
              }
              className={`lemonsqueezy-button ${userData?.subscription.planId === selectedPlanId ? "pointer-events-none" : ""}`}
            >
              <Button
                size="lg"
                onClick={() => null}
                disabled={
                  !selectedPlanId ||
                  (userData?.subscription.planId === selectedPlanId &&
                    userData?.subscription.billingCycle === billingCycle)
                }
              >
                {false ? (
                  <>
                    <MessageSquareText className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : userData?.subscription.planId === selectedPlanId &&
                  userData?.subscription.billingCycle === billingCycle ? (
                  "Current Plan"
                ) : isPlanUpgrade(selectedPlanId) ? (
                  <>
                    Upgrade Subscription
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Update Subscription"
                )}
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              {selectedPlanId === "enterprise"
                ? "Our sales team will contact you to discuss custom pricing and features."
                : "You can change or cancel your subscription at any time."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
