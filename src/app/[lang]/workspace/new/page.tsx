"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquareText, AlertCircle, ArrowUp } from "lucide-react";
import { createWorkspaceAction } from "@/actions/workspace-actions";

export default function NewWorkspace() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxWorkspacesError, setMaxWorkspacesError] = useState(false);
  const { firebaseUser, userData, refreshUserData } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      setError("Workspace name is required");
      setMaxWorkspacesError(false);
      return;
    }

    if (!firebaseUser || !userData) {
      setError("You must be logged in to create a workspace");
      setMaxWorkspacesError(false);
      return;
    }

    try {
      // Check if user can create more workspaces based on their subscription
      const canCreateMore =
        userData.subscription?.maxWorkspaces > userData.workspaces.length;
      if (!canCreateMore) {
        setError(
          "You've reached the maximum number of workspaces for your subscription plan. Please upgrade to create more workspaces.",
        );
        setMaxWorkspacesError(true);
        return;
      }

      setIsLoading(true);
      setError("");
      setMaxWorkspacesError(false);

      await createWorkspaceAction(workspaceName);
      await refreshUserData();

      // Redirect to the dashboard instead of subscription page
      router.push("/dashboard");

      // Optionally show a success toast/notification here
    } catch (err: any) {
      console.error("Error creating workspace:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create workspace. Please try again.",
      );
      // Check if the error is about workspace limits
      if (
        (err instanceof Error &&
          err.message.includes("maximum number of workspaces")) ||
        err.message.includes("workspace limit")
      ) {
        setMaxWorkspacesError(true);
      } else {
        setMaxWorkspacesError(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <span>Goodspeech</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold">Create Your Workspace</h2>
          <p className="mt-2 text-sm text-gray-500">
            Set up a workspace to start using Goodspeech with your Slack team
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
        {maxWorkspacesError && (
          <Button
            variant="outline"
            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-gray-800"
            onClick={() => router.push("/account/subscription")}
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Upgrade Your Plan
          </Button>
        )}

        {userData && userData.subscription.planId !== "free" && (
          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-600">
            <p className="font-medium">
              Current Plan: {userData.subscription.planId}
            </p>
            <p>
              You can create up to {userData.subscription.maxWorkspaces}{" "}
              workspaces.
            </p>
            <p>
              Workspaces used: {userData.workspaces.length} /{" "}
              {userData.subscription.maxWorkspaces}
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="workspace-name">Your slack workspace name</Label>
              <Input
                id="workspace-name"
                name="workspace-name"
                type="text"
                required
                placeholder="e.g. My Team, Company Name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Workspace"}
          </Button>

          {userData &&
            userData.subscription.planId === "free" &&
            !maxWorkspacesError && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Want to create more workspaces?
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/account/subscription")}
                >
                  Upgrade Your Plan
                </Button>
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
