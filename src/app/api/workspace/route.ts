import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { createWorkspace, getUser, updateUser } from "@/lib/server/db-service";

export async function POST(req: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Parse request body
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    // Get the user to check subscription limits
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has reached their workspace limit
    if (user.workspaces.length >= (user.subscription?.maxWorkspaces || 1)) {
      return NextResponse.json(
        { error: "Workspace limit reached for your current subscription plan" },
        { status: 403 }
      );
    }

    // Create the workspace with server-side logic
    const newWorkspace = await createWorkspace({
      name: name.trim(),
      ownerId: uid,
      settings: {
        customization: {
          preferredLanguage: "en",
          responseStyle: "neutral",
        },
      },
      usage: {
        translations: {},
      },
    });

    // If this is the user's first workspace, set it as default
    if (!user.workspaces.length) {
      await updateUser(uid, {
        defaultWorkspace: newWorkspace.id,
      });
    }

    return NextResponse.json({ workspace: newWorkspace });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 },
    );
  }
}
