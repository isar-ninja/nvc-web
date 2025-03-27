import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";
import { createWorkspace } from "@/lib/server/db-service";

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
      subscription: {
        planId: "free",
        status: "trialing",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        cancelAtPeriodEnd: false,
        billingCycle: "monthly",
      },
      usage: {
        translations: {},
      },
    });

    return NextResponse.json({ workspace: newWorkspace });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 },
    );
  }
}
