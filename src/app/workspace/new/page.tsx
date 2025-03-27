"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquareText } from "lucide-react";
import { canUserCreateMoreWorkspaces } from "@/lib/client/db-service";

export default function NewWorkspace() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { firebaseUser, userData, refreshUserData } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      setError("Workspace name is required");
      return;
    }

    if (!firebaseUser || !userData) {
      setError("You must be logged in to create a workspace");
      return;
    }

    try {
      // Check if user can create more workspaces based on their subscription
      const canCreateMore = await canUserCreateMoreWorkspaces(userData);
      if (!canCreateMore) {
        setError(
          "You've reached the maximum number of workspaces for your subscription plan. Please upgrade to create more workspaces.",
        );
        return;
      }

      setIsLoading(true);
      setError("");

      const idToken = await firebaseUser.getIdToken();

      // Call the API to create the workspace
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name: workspaceName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workspace");
      }

      // const { workspace } = await response.json();
      await refreshUserData();

      // Redirect to the dashboard instead of subscription page
      router.push("/dashboard");

      // Optionally show a success toast/notification here
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create workspace. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <span>NVC-Bot</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold">Create Your Workspace</h2>
          <p className="mt-2 text-sm text-gray-500">
            Set up a workspace to start using NVC-Bot with your Slack team
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
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

          {userData && userData.subscription.planId === "free" && (
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
