import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { getWorkspace, updateWorkspace } from "@/lib/server/db-service";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Get the workspace ID from the URL params
    const { id: workspaceId } = await context.params;
    console.log("params ", workspaceId);
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 },
      );
    }

    // Get the authorization token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get the workspace to verify ownership
    const workspace = await getWorkspace(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 },
      );
    }

    // Verify the user is the workspace owner
    if (workspace.ownerId !== uid) {
      return NextResponse.json(
        { error: "You do not have permission to update this workspace" },
        { status: 403 },
      );
    }

    // Parse request body
    const { planId, billingCycle } = await req.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    if (billingCycle !== "monthly" && billingCycle !== "yearly") {
      return NextResponse.json(
        { error: "Billing cycle must be monthly or yearly" },
        { status: 400 },
      );
    }

    // Update the workspace subscription
    // In a real app, you would integrate with Stripe here
    await updateWorkspace(workspaceId, {
      subscription: {
        ...workspace.subscription,
        planId,
        status: planId === "free" ? "active" : "trialing",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        billingCycle,
      },
    });

    // Get the updated workspace
    const updatedWorkspace = await getWorkspace(workspaceId);

    return NextResponse.json({ workspace: updatedWorkspace });
  } catch (error) {
    console.error("Error updating workspace subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}
