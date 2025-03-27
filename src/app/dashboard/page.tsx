"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Settings,
  BarChart,
  ExternalLink,
  MessageSquareText,
} from "lucide-react";
import { Workspace } from "@/lib/shared/models";
import Image from "next/image";

export default function Dashboard() {
  const { userData, workspaces, defaultWorkspace, firebaseUser } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );

  useEffect(() => {
    // Set the active workspace to the default one
    if (defaultWorkspace) {
      setActiveWorkspace(defaultWorkspace);
    } else if (workspaces.length > 0) {
      setActiveWorkspace(workspaces[0]);
    }
  }, [defaultWorkspace, workspaces]);

  if (!userData) {
    return null; // Will be handled by AuthContext
  }

  const getSubscriptionLabel = (workspace: Workspace) => {
    const { planId, status } = workspace.subscription;

    if (status === "trialing") {
      return `${planId.charAt(0).toUpperCase() + planId.slice(1)} (Trial)`;
    }

    return planId.charAt(0).toUpperCase() + planId.slice(1);
  };


  async function createWorkSpace() {
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseUser?.accessToken}`,
        },
        body: JSON.stringify({
          name: "New Workspace",
          description: "New Workspace Description",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      const workspace = await response.json();
      console.log("workspace created", workspace);
      // setActiveWorkspace(workspace);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard</h1>
          {/* <Link href="/workspace/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </Link> */}
          <Button onClick={createWorkSpace}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workspace
          </Button>
        </div>

        {workspaces.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Welcome to NVC-Bot!</h2>
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
                      onClick={() => setActiveWorkspace(workspace)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeWorkspace?.id === workspace.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="font-medium">{workspace.name}</div>
                      <div className="text-xs mt-1 opacity-80">
                        {getSubscriptionLabel(workspace)}
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
                      <div>
                        <h2 className="text-2xl font-bold">
                          {activeWorkspace.name}
                        </h2>
                        <div className="flex items-center mt-2">
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {getSubscriptionLabel(activeWorkspace)}
                          </span>
                          {activeWorkspace.subscription.status ===
                            "trialing" && (
                            <span className="text-xs text-gray-500 ml-2">
                              Trial ends on{" "}
                              {new Date(
                                activeWorkspace.subscription.currentPeriodEnd,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Link
                          href={`/workspace/${activeWorkspace.id}/settings`}
                        >
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                        </Link>
                        <Link
                          href={`/workspace/${activeWorkspace.id}/subscribe`}
                        >
                          <Button size="sm">
                            {activeWorkspace.subscription.planId === "free"
                              ? "Upgrade"
                              : "Manage Subscription"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">Members</p>
                          <h3 className="text-2xl font-bold mt-1">
                            {activeWorkspace.members.length}
                          </h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div> */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">
                            Translations Used
                          </p>
                          <h3 className="text-2xl font-bold mt-1">0 / 100</h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <MessageSquareText className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">
                            Billing Status
                          </p>
                          <h3 className="text-2xl font-bold mt-1 capitalize">
                            {activeWorkspace.subscription.status}
                          </h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BarChart className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slack Integration */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">
                      Slack Integration
                    </h3>
                    {activeWorkspace.settings.slackTeamId ? (
                      <div className="bg-green-50 p-4 rounded-md dark:bg-green-900/20">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/40">
                            <svg
                              className="h-5 w-5 text-green-600"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9.5 15.6c1.1 0 2-.9 2-2v-5.1c0-1.1-.9-2-2-2s-2 .9-2 2v5.1c0 1.1.9 2 2 2zm0-10.2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                              <path d="M22 8.5c0-1.1-.9-2-2-2h-5.1c-1.1 0-2 .9-2 2s.9 2 2 2H20c1.1 0 2-.9 2-2zM9.5 20c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              <path d="M6.4 8.5c0-1.1-.9-2-2-2H2c-1.1 0-2 .9-2 2s.9 2 2 2h2.4c1.1 0 2-.9 2-2zm2 7.1c0-1.1-.9-2-2-2s-2 .9-2 2v5.1c0 1.1.9 2 2 2s2-.9 2-2v-5.1z" />
                              <path d="M15.6 14.5c-1.1 0-2 .9-2 2s.9 2 2 2h5.1c1.1 0 2-.9 2-2s-.9-2-2-2h-5.1z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">Connected to Slack</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Your NVC-Bot is ready to use in your Slack
                              workspace
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-800">
                        <p className="mb-4">
                          Connect NVC-Bot to your Slack workspace to start
                          translating messages.
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

                  {/* Quick Actions */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">Invite Team Members</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          Add colleagues to your workspace
                        </p>
                        <Link href={`/workspace/${activeWorkspace.id}/members`}>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-1" />
                            Manage Members
                          </Button>
                        </Link>
                      </div> */}
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">View Usage Analytics</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          See how your team is using NVC-Bot
                        </p>
                        <Link
                          href={`/workspace/${activeWorkspace.id}/analytics`}
                        >
                          <Button variant="outline" size="sm">
                            <BarChart className="h-4 w-4 mr-1" />
                            View Analytics
                          </Button>
                        </Link>
                      </div>
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium">Documentation</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          Learn how to use NVC-Bot effectively
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
                  <Button onClick={createWorkSpace}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace
                  </Button>
                  {/* <Link href="/workspace/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Workspace
                    </Button>
                  </Link> */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
