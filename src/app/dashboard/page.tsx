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

export default function Dashboard() {
  const { userData, workspaces, defaultWorkspace, refreshWorkspaces } =
    useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // console.log("Dashboard userData", userData);
  useEffect(() => {
    // Set the active workspace to the default one
    if (defaultWorkspace) {
      setActiveWorkspace(defaultWorkspace);
      setNewWorkspaceName(defaultWorkspace.name);
    } else if (workspaces.length > 0) {
      setActiveWorkspace(workspaces[0]);
      setNewWorkspaceName(workspaces[0].name);
    }
  }, [defaultWorkspace, workspaces]);

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

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard</h1>
          <Button asChild>
            <Link href="/workspace/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
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
                  Your trial has ended
                </h3>
                <p className="mt-2 text-amber-700 dark:text-amber-200">
                  {trialStatus.reason === "time"
                    ? "Your trial period has expired."
                    : "You've reached your maximum translations limit for the trial."}{" "}
                  Upgrade now to continue enjoying Goodspeech's full benefits
                  with no interruptions.
                </p>
                <div className="mt-4">
                  <Link href="/account/subscription">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      Upgrade Now
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
              Welcome to Goodspeech!
            </h2>
            <p className="mb-6">
              You haven't created any workspaces yet. Create one to get started.
            </p>
            <Link href="/workspace/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-12">
            {/* Workspace Sidebar */}
            <div className="md:col-span-3">
              <div className="bg-white border rounded-lg p-4 shadow-sm dark:bg-gray-800">
                <h2 className="font-semibold mb-4">Your Workspaces</h2>
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
                          translations
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/workspace/new">
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      New Workspace
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
                                Trial ends on{" "}
                                {new Date(
                                  userData.subscription
                                    .currentPeriodEnd as Date,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          {userData.subscription.status === "trialing" &&
                            trialStatus.trialEnded && (
                              <span className="text-xs text-red-500 ml-2 font-medium">
                                Trial has ended - Upgrade now
                              </span>
                            )}
                          {userData.subscription.status === "pending" && (
                            <span className="text-xs text-amber-500 ml-2">
                              Payment processing
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        {/* <Link
                          className="pointer-events-none"
                          href={`/workspace/${activeWorkspace.id}/settings`}
                        >
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                        </Link> */}
                        <Link href="/account/subscription">
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
                              ? "Upgrade"
                              : "Manage Subscription"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            Global Translations
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
                                ? "Translation limit reached - Upgrade to continue"
                                : `Using ${usagePercentage}% of your monthly quota`}
                            </p>
                          </div>

                          {trialStatus.trialEnded &&
                            trialStatus.reason === "usage" && (
                              <div className="mt-3">
                                <Link href="/account/subscription">
                                  <Button
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700"
                                  >
                                    Upgrade Now
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
                            Workspace Translations
                          </p>
                          <h3 className="text-2xl font-bold mt-1">
                            {formatWorkspaceTranslationsDisplay(
                              activeWorkspace,
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            This month in "{activeWorkspace.name}"
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
                        <p className="text-sm text-gray-500">Billing Status</p>
                        <h3
                          className={`text-2xl font-bold mt-1 capitalize ${
                            trialStatus.trialEnded ? "text-amber-600" : ""
                          }`}
                        >
                          {trialStatus.trialEnded
                            ? "Trial Ended"
                            : userData.subscription.status}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${trialStatus.trialEnded ? "text-amber-600" : ""}`}
                        >
                          {userData.subscription.status === "active" &&
                            "Your subscription is active"}
                          {userData.subscription.status === "trialing" &&
                            !trialStatus.trialEnded &&
                            "Your trial is active"}
                          {userData.subscription.status === "trialing" &&
                            trialStatus.trialEnded &&
                            (trialStatus.reason === "time"
                              ? "Your trial period has expired. Upgrade to continue using Goodspeech."
                              : "You've reached your translation limit. Upgrade to continue translating.")}
                          {userData.subscription.status === "pending" &&
                            "Your payment is being processed"}
                          {userData.subscription.status === "cancelled" &&
                            "Your subscription will end soon"}
                          {userData.subscription.status === "past_due" &&
                            "Payment is past due"}
                        </p>
                        <div className="mt-3">
                          <Link href="/account/subscription">
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
                                ? "Upgrade Now"
                                : isTrialOrPending
                                  ? "Upgrade Plan"
                                  : "Manage Subscription"}
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Current Plan</p>
                        <p className="font-bold mt-1 capitalize">
                          {userData.subscription.planId}
                        </p>

                        {/* Only show billing cycle for active, paid subscriptions */}
                        {!isTrialOrPending && (
                          <p className="text-sm mt-1">
                            {userData.subscription.billingCycle} billing
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
                                ? "Trial expired on "
                                : "Trial ends on "}
                              {new Date(
                                userData.subscription.currentPeriodEnd as Date,
                              ).toLocaleDateString()}
                            </p>
                          )}

                        {/* For pending, show processing message */}
                        {userData.subscription.status === "pending" && (
                          <p className="text-xs text-amber-500 mt-1">
                            Payment being processed
                          </p>
                        )}

                        {/* For active subscriptions, show renewal date */}
                        {userData.subscription.status === "active" &&
                          userData.subscription.currentPeriodEnd && (
                            <p className="text-xs text-gray-500 mt-1">
                              Renews on{" "}
                              {new Date(
                                userData.subscription.currentPeriodEnd as Date,
                              ).toLocaleDateString()}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Slack Integration */}
                  {!trialStatus.trialEnded && (
                    <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                      <h3 className="text-lg font-semibold mb-4">
                        Slack Integration
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
                                Connected to Slack
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Your Goodspeech Bot is ready to use in your
                                Slack workspace
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
                                  href="https://slackbot-e8huapd7e6cegqd9.germanywestcentral-01.azurewebsites.net/slack/install"
                                >
                                  Reinstall
                                  <RefreshCw className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-800">
                          <p className="mb-4">
                            Connect the Goodspeech Bot to your Slack workspace
                            to start translating messages.
                          </p>
                          <Button
                            asChild={true}
                            size="sm"
                            className="w-full min-[400px]:w-auto"
                          >
                            <Link
                              target="_blank"
                              href="https://slackbot-e8huapd7e6cegqd9.germanywestcentral-01.azurewebsites.net/slack/install"
                            >
                              <Image
                                alt="Add to Slack"
                                height="16"
                                width="16"
                                src="/slack-icon.png"
                              />
                              Add to slack
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">View Usage Analytics</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          See how your team is using Goodspeech
                        </p>
                        <Link
                          className="pointer-events-none"
                          href={`/workspace/${activeWorkspace.id}/analytics`}
                        >
                          <Button variant="outline" size="sm">
                            <BarChart className="h-4 w-4 mr-1" />
                            View Analytics
                          </Button>
                        </Link>
                      </div> */}
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">Documentation</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          Learn how to use Goodspeech effectively
                        </p>
                        <Link href="/docs" target="_blank">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Docs
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-6 shadow-sm text-center dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">
                    No Workspace Selected
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Select a workspace from the sidebar or create a new one to
                    get started.
                  </p>
                  <Link href="/workspace/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Workspace
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
