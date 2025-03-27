"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getWorkspace, updateWorkspace } from "@/lib/db-service";
import { Workspace } from "@/lib/models";
import { CheckCircle, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define plans to match those on the homepage
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams just getting started",
    pricing: {
      monthly: 9,
      yearly: 9 * 12 * 0.8, // 20% discount for yearly billing
    },
    features: [
      "100 translations per month",
      "Basic support",
      "Standard response styles",
    ],
    limits: {
      maxTranslationsPerMonth: 100,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams with more needs",
    pricing: {
      monthly: 29,
      yearly: 29 * 12 * 0.8, // 20% discount for yearly billing
    },
    features: [
      "1,000 translations per month",
      "Priority support",
      "Analytics dashboard",
      "Custom response styles",
    ],
    limits: {
      maxTranslationsPerMonth: 1000,
    },
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    pricing: {
      monthly: "Custom",
      yearly: "Custom",
    },
    features: [
      "Unlimited translations",
      "24/7 dedicated support",
      "Custom integrations",
      "On-premise deployment option",
      "Advanced security features",
    ],
    limits: {
      maxTranslationsPerMonth: Infinity,
    },
  },
];

export default function SubscribePage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const router = useRouter();
  const { firebaseUser, refreshUserData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !firebaseUser) return;

      try {
        // Fetch workspace data
        const workspaceData = await getWorkspace(id as string);
        if (!workspaceData) {
          setError("Workspace not found");
          return;
        }

        // Check if user is authorized to access this workspace
        if (workspaceData.ownerId !== firebaseUser.uid) {
          setError("You don't have access to this workspace");
          return;
        }

        setWorkspace(workspaceData);

        // Set initial selected plan
        setSelectedPlan(workspaceData.subscription.planId || "starter");
        setBillingCycle(workspaceData.subscription.billingCycle || "monthly");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load subscription information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, firebaseUser]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!workspace || !selectedPlan) return;

    try {
      setIsLoading(true);

      // In a real implementation, you would integrate with Stripe here
      // For now, we'll just update the workspace with the selected plan

      await updateWorkspace(workspace.id, {
        subscription: {
          ...workspace.subscription,
          planId: selectedPlan,
          status: selectedPlan === "free" ? "active" : "trialing",
          // Set trial end date to 14 days from now
          currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          billingCycle: billingCycle,
        },
      });

      // Refresh user data to include updated workspace
      await refreshUserData();

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error updating subscription:", err);
      setError("Failed to update subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format price with dollar sign
  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price.toFixed(0)}` : price;
  };

  // Function to get monthly price for yearly billing
  const getMonthlyEquivalent = (yearlyPrice, monthlyPrice) => {
    if (typeof yearlyPrice === "number" && typeof monthlyPrice === "number") {
      return yearlyPrice / 12;
    }
    return null;
  };

  // Function to get yearly price without discount (for strike-through)
  const getYearlyWithoutDiscount = (monthlyPrice) => {
    if (typeof monthlyPrice === "number") {
      return monthlyPrice * 12;
    }
    return null;
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
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">
              Choose a Plan for {workspace?.name}
            </h1>
            <p className="text-gray-500">
              Select the plan that best fits your needs
            </p>

            <div className="flex justify-center items-center mt-8 space-x-4">
              <span
                className={`text-sm ${billingCycle === "monthly" ? "font-bold" : "text-gray-500"}`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "yearly" : "monthly",
                  )
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-primary bg-gray-200"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-primary transition ${
                    billingCycle === "yearly"
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${billingCycle === "yearly" ? "font-bold" : "text-gray-500"}`}
              >
                Yearly <span className="text-green-600">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg border p-6 shadow-sm transition-all ${
                  plan.recommended ? "border-primary ring-1 ring-primary" : ""
                } ${
                  selectedPlan === plan.id
                    ? "border-primary ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
              >
                {plan.recommended && (
                  <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-full inline-block mb-2">
                    Recommended
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-500">{plan.description}</p>
                </div>
                <div className="mt-4">
                  {billingCycle === "monthly" ||
                  typeof plan.pricing.monthly === "string" ? (
                    // Monthly pricing display
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatPrice(plan.pricing.monthly)}
                      </span>
                      {typeof plan.pricing.monthly === "number" && (
                        <span className="ml-1 text-xl font-normal text-gray-500">
                          /month
                        </span>
                      )}
                    </div>
                  ) : (
                    // Yearly pricing display with strike-through original price
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          {formatPrice(plan.pricing.yearly)}
                        </span>
                        <span className="ml-1 text-xl font-normal text-gray-500">
                          /year
                        </span>
                      </div>
                      <div className="flex items-baseline mt-1 text-gray-500">
                        <span className="line-through">
                          {formatPrice(
                            getYearlyWithoutDiscount(plan.pricing.monthly),
                          )}
                        </span>
                        <span className="ml-2 text-green-600 text-sm">
                          Save 20%
                        </span>
                      </div>
                      {typeof plan.pricing.monthly === "number" && (
                        <div className="text-sm text-gray-500 mt-1">
                          {formatPrice(
                            getMonthlyEquivalent(
                              plan.pricing.yearly,
                              plan.pricing.monthly,
                            ),
                          )}
                          /mo equivalent
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              onClick={handleSubscribe}
              disabled={isLoading || !selectedPlan}
            >
              {isLoading
                ? "Processing..."
                : selectedPlan === "enterprise"
                  ? "Contact Sales"
                  : "Confirm Subscription"}
            </Button>
            {selectedPlan !== "enterprise" && (
              <p className="mt-4 text-sm text-gray-500">
                You can change or cancel your subscription at any time.
                {billingCycle === "monthly"
                  ? " No long-term commitment required."
                  : ""}
              </p>
            )}
            {selectedPlan === "enterprise" && (
              <p className="mt-4 text-sm text-gray-500">
                Our sales team will contact you to discuss custom pricing and
                features.
              </p>
            )}
          </div>

          {/* Free Trial Information */}
          {/* <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border text-center">
            <h3 className="text-lg font-semibold mb-2">
              Start with a 14-Day Free Trial
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try any plan free for 14 days. No credit card required. You'll
              only be charged when your trial ends.
            </p>
          </div> */}
        </div>
      </main>
    </div>
  );
}
