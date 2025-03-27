"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/lib/db-service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquareText } from "lucide-react";

export default function NewWorkspace() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { firebaseUser, refreshUserData } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      setError("Workspace name is required");
      return;
    }

    if (!firebaseUser) {
      setError("You must be logged in to create a workspace");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const newWorkspace = await createWorkspace({
        name: workspaceName,
        ownerId: firebaseUser.uid,
        settings: {
          customization: {
            preferredLanguage: "en",
            responseStyle: "neutral",
          },
        },
        subscription: {
          planId: "free",
          status: "trialing",
          currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
          cancelAtPeriodEnd: false,
          billingCycle: "monthly",
        },
      });

      // Refresh user data to include the new workspace
      await refreshUserData();

      // Redirect to the subscription selection page
      router.push(`/workspace/${newWorkspace.id}/subscribe`);
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError("Failed to create workspace. Please try again.");
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
        </form>
      </div>
    </div>
  );
}
