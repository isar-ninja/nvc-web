"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white border rounded-lg p-6 shadow-sm mb-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Welcome to NVC-Bot!</h2>
          <p className="mb-4">
            You're now logged in. From here you can manage your NVC-Bot settings
            and integrations.
          </p>

          <div className="grid gap-6 mt-8 md:grid-cols-2">
            <div className="border rounded-lg p-6 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://slackbot-e8huapd7e6cegqd9.germanywestcentral-01.azurewebsites.net/slack/install"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Connect to Slack
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    Customize Bot Settings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary hover:underline">
                    View Usage Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Email: {user?.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Plan: Free Trial
              </p>
              <Button size="sm">Upgrade Plan</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
