"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  BarChart,
  ExternalLink,
  MessageSquareText,
  RefreshCw,
  PieChart,
  AlertTriangle,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { Workspace } from "@/lib/shared/models";
import Image from "next/image";
import { getCurrentMonthKey } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Using Sonner toast component instead
import { updateWorkspaceNameAction } from "@/actions/workspace-actions";
import { useRouter, useParams } from "next/navigation";

// Dashboard component that accepts dictionary for translations
export default function Dashboard({ dict }: { dict?: any }) {
  const { userData, workspaces, defaultWorkspace, refreshWorkspaces } =
    useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    // Set the active workspace to the default one
    if (defaultWorkspace) {
      setActiveWorkspace(defaultWorkspace);
      setNewWorkspaceName(defaultWorkspace.name);
    } else if (workspaces.length > 0) {
      setActiveWorkspace(workspaces[0]);
      setNewWorkspaceName(workspaces[0].name);
    } else if (!userData?.companyName) {
      router.push(`/${lang}/onboarding/company`);
    } else router.push(`/${lang}/workspace/new`);
  }, [defaultWorkspace, workspaces, userData, router, lang]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  if (!userData) {
    return null; // Will be handled by AuthContext
  }

  const startEditingName = () => {
    if (activeWorkspace) {
      setNewWorkspaceName(activeWorkspace.name);
      setIsEditingName(true);
    }
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    if (activeWorkspace) {
      setNewWorkspaceName(activeWorkspace.name);
    }
  };

  const saveWorkspaceName = async () => {
    if (!activeWorkspace || !newWorkspaceName.trim()) {
      return;
    }

    if (newWorkspaceName === activeWorkspace.name) {
      setIsEditingName(false);
      return;
    }

    try {
      setIsUpdatingName(true);
      await updateWorkspaceNameAction(activeWorkspace.id, newWorkspaceName);
      await refreshWorkspaces();
      setIsEditingName(false);
      toast.success("Workspace updated", {
        description: "The workspace name has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating workspace name:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update workspace name",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveWorkspaceName();
    } else if (e.key === "Escape") {
      cancelEditingName();
    }
  };

  const getSubscriptionLabel = () => {
    const { planId, status } = userData.subscription;

    if (status === "trialing") {
      return `${planId.charAt(0).toUpperCase() + planId.slice(1)} (Trial)`;
    }

    return planId.charAt(0).toUpperCase() + planId.slice(1);
  };

  // Format the translations display for global user usage
  const formatGlobalTranslationsDisplay = () => {
    // Get current month's usage from the user
    const monthKey = getCurrentMonthKey();
    const used = userData.usage?.totalTranslations?.[monthKey] || 0;
    const max = userData.subscription.maxTranslationsPerMonth;

    // Format the display
    return max === null || max === undefined
      ? `${used.toLocaleString()} / Unlimited`
      : `${used.toLocaleString()} / ${max.toLocaleString()}`;
  };

  // Format the translations display for specific workspace
  const formatWorkspaceTranslationsDisplay = (workspace: Workspace | null) => {
    if (!workspace) return "0";

    // Get current month's usage from the workspace
    const monthKey = getCurrentMonthKey();
    const used = workspace.usage?.translations?.[monthKey] || 0;

    return used.toLocaleString();
  };

  // Calculate percentage of used translations
  const calculateUsagePercentage = () => {
    const monthKey = getCurrentMonthKey();
    const used = userData.usage?.totalTranslations?.[monthKey] || 0;
    const max = userData.subscription.maxTranslationsPerMonth;

    if (!max || max === 0) return 0;
    return Math.min(100, Math.round((used / max) * 100));
  };

  // Check if trial has ended due to usage or time
  const checkTrialStatus = () => {
    const { status, currentPeriodEnd, maxTranslationsPerMonth } =
      userData.subscription;
    const monthKey = getCurrentMonthKey();
    const used = userData.usage?.totalTranslations?.[monthKey] || 0;

    // Has the trial period ended?
    const trialTimeEnded =
      status === "trialing" &&
      currentPeriodEnd &&
      new Date(currentPeriodEnd as Date) < new Date();

    // Has the user reached their translation limit?
    const usageLimitReached =
      status === "trialing" &&
      maxTranslationsPerMonth !== null &&
      maxTranslationsPerMonth !== undefined &&
      used >= maxTranslationsPerMonth;

    return {
      trialEnded: trialTimeEnded || usageLimitReached,
      reason: trialTimeEnded ? "time" : usageLimitReached ? "usage" : null,
    };
  };

  const usagePercentage = calculateUsagePercentage();
  const isTrialOrPending =
    userData.subscription.status === "trialing" ||
    userData.subscription.status === "pending";
  const trialStatus = checkTrialStatus();

  // Format date based on language
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(lang === "de" ? "de-DE" : "en-US");
  };

  const getSubscriptionStatusDisplay = () => {
    const { status, currentPeriodEnd } = userData.subscription;

    switch (status) {
      case "active":
        return (
          dict?.dashboard?.subscriptionActive || "Your subscription is active"
        );
      case "trialing":
        return !trialStatus.trialEnded
          ? dict?.dashboard?.trialActive || "Your trial is active"
          : trialStatus.reason === "time"
            ? dict?.dashboard?.trialExpired ||
              "Your trial period has expired. Upgrade to continue using Goodspeech."
            : dict?.dashboard?.translationLimitReached ||
              "You've reached your translation limit. Upgrade to continue translating.";
      case "pending":
        return (
          dict?.dashboard?.paymentProcessing ||
          "Your payment is being processed"
        );
      case "cancelled":
        return `${dict?.dashboard?.subscriptionCancelled || "Subscription cancelled. Access available until"} ${formatDate(
          currentPeriodEnd as Date,
        )}`;
      case "past_due":
        return dict?.dashboard?.paymentPastDue || "Payment is past due";
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            {dict?.dashboard?.title || "Dashboard"}
          </h1>
          <Button asChild>
            <Link href={`/${lang}/workspace/new`}>
              <Plus className="h-4 w-4 mr-2" />
              {dict?.dashboard?.createWorkspace || "Create Workspace"}
            </Link>
          </Button>
        </div>

        {/* Display prominent trial ended banner if applicable */}
        {trialStatus.trialEnded && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-md shadow-sm dark:bg-amber-900/20 dark:border-amber-400">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300">
                  {dict?.dashboard?.trialBanner?.title ||
                    "Your trial has ended"}
                </h3>
                <p className="mt-2 text-amber-700 dark:text-amber-200">
                  {trialStatus.reason === "time"
                    ? dict?.dashboard?.trialBanner?.timeExpired ||
                      "Your trial period has expired."
                    : dict?.dashboard?.trialBanner?.usageReached ||
                      "You've reached your maximum translations limit for the trial."}{" "}
                  {dict?.dashboard?.trialBanner?.upgradeMessage ||
                    "Upgrade now to continue enjoying Goodspeech's full benefits with no interruptions."}
                </p>
                <div className="mt-4">
                  <Link href={`/${lang}/account/subscription`}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      {dict?.dashboard?.upgradeNow || "Upgrade Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {workspaces.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">
              {dict?.dashboard?.welcomeTitle || "Welcome to Goodspeech!"}
            </h2>
            <p className="mb-6">
              {dict?.dashboard?.welcomeMessage ||
                "You haven't created any workspaces yet. Create one to get started."}
            </p>
            <Link href={`/${lang}/workspace/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {dict?.dashboard?.createWorkspace || "Create Workspace"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-12">
            {/* Workspace Sidebar */}
            <div className="md:col-span-3">
              <div className="bg-white border rounded-lg p-4 shadow-sm dark:bg-gray-800">
                <h2 className="font-semibold mb-4">
                  {dict?.dashboard?.yourWorkspaces || "Your Workspaces"}
                </h2>
                <div className="space-y-2">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => {
                        setActiveWorkspace(workspace);
                        setNewWorkspaceName(workspace.name);
                        setIsEditingName(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeWorkspace?.id === workspace.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="font-medium">{workspace.name}</div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="opacity-80">
                          {getSubscriptionLabel()}
                        </span>
                        <span className="text-gray-500">
                          {formatWorkspaceTranslationsDisplay(workspace)}{" "}
                          {dict?.dashboard?.translations || "translations"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/${lang}/workspace/new`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      {dict?.dashboard?.newWorkspace || "New Workspace"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-9">
              {activeWorkspace ? (
                <div className="space-y-6">
                  {/* Workspace Header */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-grow">
                        {isEditingName ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              ref={nameInputRef}
                              value={newWorkspaceName}
                              onChange={(e) =>
                                setNewWorkspaceName(e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className="text-xl font-bold h-auto py-1 max-w-md"
                              disabled={isUpdatingName}
                              maxLength={50}
                            />
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={saveWorkspaceName}
                                disabled={
                                  isUpdatingName || !newWorkspaceName.trim()
                                }
                                className="h-8 w-8 p-0"
                              >
                                {isUpdatingName ? (
                                  <span className="animate-spin">
                                    <RefreshCw className="h-4 w-4 text-green-600" />
                                  </span>
                                ) : (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                                <span className="sr-only">Save</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEditingName}
                                disabled={isUpdatingName}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4 text-red-600" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <h2 className="text-2xl font-bold">
                              {activeWorkspace.name}
                            </h2>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={startEditingName}
                              className="ml-2 h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4 text-gray-500" />
                              <span className="sr-only">Edit name</span>
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center mt-2">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {getSubscriptionLabel()}
                          </span>
                          {userData.subscription.status === "trialing" &&
                            !trialStatus.trialEnded && (
                              <span className="text-xs text-gray-500 ml-2">
                                {(
                                  dict?.dashboard?.trialEndsOn ||
                                  "Trial ends on {date}"
                                ).replace(
                                  "{date}",
                                  formatDate(
                                    userData.subscription
                                      .currentPeriodEnd as Date,
                                  ),
                                )}
                              </span>
                            )}
                          {userData.subscription.status === "trialing" &&
                            trialStatus.trialEnded && (
                              <span className="text-xs text-red-500 ml-2 font-medium">
                                {dict?.dashboard?.trialEnded ||
                                  "Trial has ended - Upgrade now"}
                              </span>
                            )}
                          {userData.subscription.status === "pending" && (
                            <span className="text-xs text-amber-500 ml-2">
                              {dict?.dashboard?.paymentProcessing ||
                                "Payment processing"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Link href={`/${lang}/account/subscription`}>
                          <Button
                            size="sm"
                            className={
                              trialStatus.trialEnded
                                ? "bg-amber-600 hover:bg-amber-700"
                                : ""
                            }
                          >
                            {userData.subscription.planId === "free" ||
                            userData.subscription.status === "trialing"
                              ? dict?.dashboard?.upgradePlan || "Upgrade"
                              : dict?.dashboard?.manageSubscription ||
                                "Manage Subscription"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800 ${
                        trialStatus.trialEnded && trialStatus.reason === "usage"
                          ? "border-amber-500"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">
                            {dict?.dashboard?.globalTranslations ||
                              "Global Translations"}
                          </p>
                          <h3
                            className={`text-2xl font-bold mt-1 ${
                              trialStatus.trialEnded &&
                              trialStatus.reason === "usage"
                                ? "text-amber-600"
                                : ""
                            }`}
                          >
                            {formatGlobalTranslationsDisplay()}
                          </h3>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div
                                className={`h-2.5 rounded-full ${
                                  trialStatus.trialEnded &&
                                  trialStatus.reason === "usage"
                                    ? "bg-amber-500"
                                    : "bg-primary"
                                }`}
                                style={{ width: `${usagePercentage}%` }}
                              ></div>
                            </div>
                            <p
                              className={`text-xs mt-1 ${
                                trialStatus.trialEnded &&
                                trialStatus.reason === "usage"
                                  ? "text-amber-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {trialStatus.trialEnded &&
                              trialStatus.reason === "usage"
                                ? dict?.dashboard?.translationLimitReached ||
                                  "Translation limit reached - Upgrade to continue"
                                : (
                                    dict?.dashboard?.usingQuota ||
                                    "Using {percentage}% of your monthly quota"
                                  ).replace(
                                    "{percentage}",
                                    usagePercentage.toString(),
                                  )}
                            </p>
                          </div>

                          {trialStatus.trialEnded &&
                            trialStatus.reason === "usage" && (
                              <div className="mt-3">
                                <Link href={`/${lang}/account/subscription`}>
                                  <Button
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700"
                                  >
                                    {dict?.dashboard?.upgradeNow ||
                                      "Upgrade Now"}
                                  </Button>
                                </Link>
                              </div>
                            )}
                        </div>
                        <div
                          className={`p-2 rounded-full ${
                            trialStatus.trialEnded &&
                            trialStatus.reason === "usage"
                              ? "bg-amber-100"
                              : "bg-primary/10"
                          }`}
                        >
                          <PieChart
                            className={`h-5 w-5 ${
                              trialStatus.trialEnded &&
                              trialStatus.reason === "usage"
                                ? "text-amber-600"
                                : "text-primary"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">
                            {dict?.dashboard?.workspaceTranslations ||
                              "Workspace Translations"}
                          </p>
                          <h3 className="text-2xl font-bold mt-1">
                            {formatWorkspaceTranslationsDisplay(
                              activeWorkspace,
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {`${dict?.dashboard?.thisMonth || "This month in"} "${activeWorkspace.name}"`}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <MessageSquareText className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Status Card */}
                  <div
                    className={`bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800 ${
                      trialStatus.trialEnded && trialStatus.reason === "time"
                        ? "border-amber-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">
                          {dict?.dashboard?.billingStatus || "Billing Status"}
                        </p>
                        <h3
                          className={`text-2xl font-bold mt-1 capitalize ${
                            trialStatus.trialEnded ? "text-amber-600" : ""
                          }`}
                        >
                          {trialStatus.trialEnded
                            ? (
                                dict?.dashboard?.trialEnded || "Trial Ended"
                              ).split(" - ")[0]
                            : userData.subscription.status}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${trialStatus.trialEnded ? "text-amber-600" : ""}`}
                        >
                          {getSubscriptionStatusDisplay()}
                        </p>
                        <div className="mt-3">
                          <Link href={`/${lang}/account/subscription`}>
                            <Button
                              variant={
                                trialStatus.trialEnded ? "default" : "outline"
                              }
                              size="sm"
                              className={
                                trialStatus.trialEnded
                                  ? "bg-amber-600 hover:bg-amber-700"
                                  : ""
                              }
                            >
                              <BarChart className="h-4 w-4 mr-2" />
                              {trialStatus.trialEnded
                                ? dict?.dashboard?.upgradeNow || "Upgrade Now"
                                : isTrialOrPending
                                  ? dict?.dashboard?.upgradePlan ||
                                    "Upgrade Plan"
                                  : dict?.dashboard?.manageSubscription ||
                                    "Manage Subscription"}
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {dict?.dashboard?.currentPlan || "Current Plan"}
                        </p>
                        <p className="font-bold mt-1 capitalize">
                          {userData.subscription.planId}
                        </p>

                        {/* Only show billing cycle for active, paid subscriptions */}
                        {!isTrialOrPending && (
                          <p className="text-sm mt-1">
                            {(
                              dict?.dashboard?.billingCycle || "{cycle} billing"
                            ).replace(
                              "{cycle}",
                              userData.subscription.billingCycle,
                            )}
                          </p>
                        )}

                        {/* For trial, show expiration date instead of renewal date */}
                        {userData.subscription.status === "trialing" &&
                          userData.subscription.currentPeriodEnd && (
                            <p
                              className={`text-xs mt-1 ${
                                trialStatus.trialEnded &&
                                trialStatus.reason === "time"
                                  ? "text-amber-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {trialStatus.trialEnded &&
                              trialStatus.reason === "time"
                                ? (
                                    dict?.dashboard?.trialExpiredOn ||
                                    "Trial expired on {date}"
                                  ).replace(
                                    "{date}",
                                    formatDate(
                                      userData.subscription
                                        .currentPeriodEnd as Date,
                                    ),
                                  )
                                : (
                                    dict?.dashboard?.trialEndsOn ||
                                    "Trial ends on {date}"
                                  ).replace(
                                    "{date}",
                                    formatDate(
                                      userData.subscription
                                        .currentPeriodEnd as Date,
                                    ),
                                  )}
                            </p>
                          )}

                        {/* For pending, show processing message */}
                        {userData.subscription.status === "pending" && (
                          <p className="text-xs text-amber-500 mt-1">
                            {dict?.dashboard?.paymentBeingProcessed ||
                              "Payment being processed"}
                          </p>
                        )}

                        {/* For active subscriptions, show renewal date */}
                        {userData.subscription.status === "active" &&
                          userData.subscription.currentPeriodEnd && (
                            <p className="text-xs text-gray-500 mt-1">
                              {(
                                dict?.dashboard?.renewsOn || "Renews on {date}"
                              ).replace(
                                "{date}",
                                formatDate(
                                  userData.subscription
                                    .currentPeriodEnd as Date,
                                ),
                              )}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Slack Integration */}
                  {!trialStatus.trialEnded && (
                    <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                      <h3 className="text-lg font-semibold mb-4">
                        {dict?.dashboard?.slackIntegration ||
                          "Slack Integration"}
                      </h3>
                      {activeWorkspace.settings.slackTeamId ? (
                        <div className="bg-green-50 p-4 rounded-md dark:bg-green-900/20">
                          <div className="flex items-center">
                            <div className="bg-green-300 p-2 rounded-full dark:bg-green-900/40">
                              <Image
                                alt="Add to Slack"
                                height="16"
                                width="16"
                                src="/slack-icon.png"
                              />
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium">
                                {dict?.dashboard?.connectedToSlack ||
                                  "Connected to Slack"}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {dict?.dashboard?.slackBotReady ||
                                  "Your Goodspeech Bot is ready to use in your Slack workspace"}
                              </p>
                            </div>

                            <div className="ml-auto">
                              <Button
                                asChild={true}
                                size="sm"
                                className="w-full min-[400px]:w-auto"
                              >
                                <Link
                                  target="_blank"
                                  href={`https://slackbot-e8huapd7e6cegqd9.germanywestcentral-01.azurewebsites.net/slack/install?workspace=${activeWorkspace.id}`}
                                >
                                  {dict?.dashboard?.reinstall || "Reinstall"}
                                  <RefreshCw className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-800">
                          <p className="mb-4">
                            {dict?.dashboard?.connectSlack ||
                              "Connect the Goodspeech Bot to your Slack workspace to start translating messages."}
                          </p>
                          <Button
                            asChild={true}
                            size="sm"
                            className="w-full min-[400px]:w-auto"
                          >
                            <Link
                              target="_blank"
                              href={`https://slackbot-e8huapd7e6cegqd9.germanywestcentral-01.azurewebsites.net/slack/install?workspace=${activeWorkspace.id}`}
                            >
                              <Image
                                alt="Add to Slack"
                                height="16"
                                width="16"
                                src="/slack-icon.png"
                              />
                              {dict?.dashboard?.addToSlack || "Add to slack"}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">
                      {dict?.dashboard?.quickActions || "Quick Actions"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">
                          {dict?.dashboard?.documentation || "Documentation"}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          {dict?.dashboard?.learnToUse ||
                            "Learn how to use Goodspeech effectively"}
                        </p>
                        <Link href={`/${lang}/docs`} target="_blank">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {dict?.dashboard?.viewDocs || "View Docs"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-6 shadow-sm text-center dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    {dict?.dashboard?.noWorkspaceSelected ||
                      "No Workspace Selected"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {dict?.dashboard?.selectWorkspace ||
                      "Select a workspace from the sidebar or create a new one to get started."}
                  </p>
                  <Link href={`/${lang}/workspace/new`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {dict?.dashboard?.createWorkspace || "Create Workspace"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
