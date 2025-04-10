"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateUserAction, deleteAccountAction } from "@/actions/user-actions";
import {
  updateEmailAction,
  updatePasswordAction,
} from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function ManageAccountPage() {
  const { userData, loading, refreshUserData, firebaseUser } = useAuth();
  const router = useRouter();
  const { lang } = useParams();
  // Form states
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Account deletion
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [authProviders, setAuthProviders] = useState<string[]>([]);
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (userData && !loading) {
      setEmail(userData.email || "");
      setCompanyName(userData.companyName || "");
    }
    if (firebaseUser) {
      const providers = firebaseUser.providerData.map(
        (provider) => provider.providerId,
      );
      setAuthProviders(providers);
    }
  }, [userData, loading, firebaseUser]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userData) {
    router.push("/login");
    return null;
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email required", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setIsUpdatingEmail(true);
      await updateEmailAction(email);
      await refreshUserData();
      toast.success("Email updated", {
        description: "Your email has been updated successfully.",
      });
    } catch (error) {
      toast.error("Failed to update email", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields required", {
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must match.",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updatePasswordAction(currentPassword, newPassword);
      toast.success("Password updated", {
        description: "Your password has been updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCompanyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdatingProfile(true);
      await updateUserAction({ companyName });
      await refreshUserData();
      toast.success("Company name updated", {
        description: "Your company name has been updated successfully.",
      });
    } catch (error) {
      toast.error("Failed to update company name", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteClick = () => {
    // Check if user has an active subscription
    const hasActiveSubscription =
      userData?.subscription?.status === "active" ||
      userData?.subscription?.status === "trialing";

    if (hasActiveSubscription) {
      // Set subscription details for the warning dialog
      const planName =
        userData.subscription.lemonSqueezyProductName ||
        userData.subscription.planId;
      const billingCycle =
        userData.subscription.billingCycle === "monthly" ? "monthly" : "yearly";
      const currentEndDate = formatDate(
        userData.subscription.currentPeriodEnd as Date,
        lang as string,
      );
      const formattedPlanInfo = `${planName} (${billingCycle}) \n
        Your subscription will end on: ${currentEndDate}`;
      setSubscriptionDetails(formattedPlanInfo);
      setShowSubscriptionWarning(true);
    } else {
      // No active subscription, proceed to normal delete flow
      setIsDeleteDialogOpen(true);
    }
  };

  // Function to acknowledge subscription warning and proceed
  const handleProceedWithDelete = () => {
    setShowSubscriptionWarning(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteEmail !== userData.email) {
      toast.error("Email doesn't match", {
        description: "The email you entered doesn't match your account email.",
      });
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAccountAction();
      toast.error("Account deleted", {
        description: "Your account has been deleted successfully.",
      });
      router.push("/login");
    } catch (error) {
      toast.error("Failed to delete account", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const hasPasswordAuth = authProviders.includes("password");

  return (
    <div className="mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <p className="text-muted-foreground">
        Manage your account preferences and settings
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCompanyUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              <Button
                type="submit"
                disabled={isUpdatingProfile || companyName.length < 3}
              >
                {isUpdatingProfile && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Company
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>Change your email address</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                />
              </div>
              <Button type="submit" disabled={isUpdatingEmail}>
                {isUpdatingEmail && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        {hasPasswordAuth && (
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Danger Zone
            </CardTitle>
            <CardDescription>Actions here can't be undone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Deleting your account will remove all of your data, including
                workspaces, integrations, and settings. This action cannot be
                reversed.
              </p>
              {/* Subscription Warning Dialog */}
              <Dialog
                open={showSubscriptionWarning}
                onOpenChange={setShowSubscriptionWarning}
              >
                <Button variant="destructive" onClick={handleDeleteClick}>
                  Delete Account
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-amber-500" />
                      Active Subscription Warning
                    </DialogTitle>
                    <DialogDescription>
                      You have an active subscription that will be canceled if
                      you delete your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-900/20 dark:border-amber-800">
                      <h4 className="font-semibold mb-2">
                        Subscription details:
                      </h4>
                      <p className="text-sm">{subscriptionDetails}</p>
                    </div>
                    <p className="text-sm">
                      If you proceed, your subscription will be automatically
                      canceled, and you will lose access to premium features
                      immediately.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowSubscriptionWarning(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleProceedWithDelete}
                    >
                      I understand, proceed
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      Delete your account
                    </DialogTitle>
                    <DialogDescription>
                      This action is permanent and cannot be undone. All your
                      data, workspaces, and integrations will be permanently
                      deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm">
                      To confirm, please enter your email address:{" "}
                      <span className="font-semibold">{userData.email}</span>
                    </p>
                    <Input
                      value={confirmDeleteEmail}
                      onChange={(e) => setConfirmDeleteEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={
                        confirmDeleteEmail !== userData.email || isDeleting
                      }
                    >
                      {isDeleting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
