"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plan } from "@/lib/shared/models";
import { getAvailablePlans } from "@/lib/client/db-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const { userData, firebaseUser, refreshUserData } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [processingSubscription, setProcessingSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load available plans
    const loadPlans = async () => {
      try {
        setLoading(true);
        const availablePlans = await getAvailablePlans();
        setPlans(availablePlans);

        // If user has a subscription, preselect their current plan
        if (userData?.subscription) {
          setSelectedPlanId(userData.subscription.planId);
          setBillingCycle(userData.subscription.billingCycle);
        }
      } catch (err) {
        console.error("Error loading plans:", err);
        setError("Failed to load subscription plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [userData]);

  // Calculate savings percentage
  const getSavingsPercentage = (plan: Plan) => {
    const monthly = plan.pricing.monthly * 12;
    const yearly = plan.pricing.yearly;
    return Math.round(((monthly - yearly) / monthly) * 100);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubscribe = async () => {
    if (!firebaseUser || !userData) return;

    try {
      setProcessingSubscription(true);
      setError(null);

      // Get the idToken for authentication
      const idToken = await firebaseUser.getIdToken();

      // Call the API to create or update the subscription
      const response = await fetch(`/api/user/subscription`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          planId: selectedPlanId,
          billingCycle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subscription");
      }

      const data = await response.json();

      // Handle redirect to LemonSqueezy checkout if needed
      if (data.checkoutUrl) {
        // Redirect to LemonSqueezy checkout
        window.location.href = data.checkoutUrl;
      } else {
        // If no redirect needed (e.g., downgrading to free plan)
        await refreshUserData();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error updating subscription:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update subscription. Please try again.",
      );
    } finally {
      setProcessingSubscription(false);
    }
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading subscription plans...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-500">
          Choose the plan that works best for you and your team
        </p>

        {userData?.subscription.status !== "canceled" && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h2 className="font-semibold mb-1">Current Subscription</h2>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <Badge
                  variant={
                    userData?.subscription.status === "active"
                      ? "success"
                      : "outline"
                  }
                >
                  {userData?.subscription.status}
                </Badge>
                <span className="ml-2 font-medium capitalize">
                  {userData?.subscription.planId} Plan
                </span>
                <span className="ml-2 text-gray-500 text-sm">
                  ({userData?.subscription.billingCycle})
                </span>
              </div>
              {userData?.subscription.status === "active" &&
                userData?.subscription.currentPeriodEnd && (
                  <div className="text-sm text-gray-500">
                    Next billing date:{" "}
                    {new Date(
                      userData?.subscription.currentPeriodEnd as Date,
                    ).toLocaleDateString()}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <div className="flex gap-2 items-center">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Billing cycle toggle */}
      <div className="mb-8">
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

      {/* Plan selection */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = userData?.subscription.planId === plan.id;
          const price =
            billingCycle === "monthly"
              ? plan.pricing.monthly
              : plan.pricing.yearly;
          // const isUpgrade = isPlanUpgrade(plan.id);
          const savingsPercentage = getSavingsPercentage(plan);

          return (
            <Card
              key={plan.id}
              className={`relative ${selectedPlanId === plan.id ? "border-2 border-primary" : ""} ${isCurrentPlan ? "bg-gray-50" : ""}`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                  Current Plan
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      {formatPrice(price)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>

                  {billingCycle === "yearly" && savingsPercentage > 0 && (
                    <div className="text-green-600 text-sm mt-1">
                      Save {savingsPercentage}% with annual billing
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="font-medium mb-2">Features:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
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
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : "default"}
                  onClick={() => setSelectedPlanId(plan.id)}
                  disabled={processingSubscription}
                >
                  {isCurrentPlan ? "Current Plan" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedPlanId && (
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleSubscribe}
            disabled={
              processingSubscription ||
              (userData?.subscription.planId === selectedPlanId &&
                userData?.subscription.billingCycle === billingCycle)
            }
          >
            {processingSubscription ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
        </div>
      )}
    </div>
  );
}
