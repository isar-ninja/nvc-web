import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/server/server-auth";
import { adminDb } from "@/lib/server/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth.authenticated || !auth.email) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse request body
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    const userDoc = await adminDb.collection("users").doc(auth.uid).get();
    const userData = userDoc.data();
    console.log("userData ", userData);
    // Generate a unique ID for the workspace
    // const workspaceRef = adminDb.collection("workspaces").doc();

    // // Create the workspace document
    // await workspaceRef.set({
    //   id: workspaceRef.id,
    //   name,
    //   description: description || "",
    //   createdAt: new Date().toISOString(),
    //   owner: auth.uid,
    //   ownerEmail: auth.email,
    //   members: [auth.uid],
    //   memberEmails: [auth.email],
    // });

    // // Create a members subcollection document for the owner
    // await workspaceRef.collection("members").doc(auth.uid).set({
    //   uid: auth.uid,
    //   email: auth.email,
    //   role: "owner",
    //   joinedAt: new Date().toISOString(),
    // });

    return NextResponse.json(
      {
        success: true,
        workspaceId: "123445",
        message: "Workspace created successfully",
      },
      { status: 201 },
    );
    // return NextResponse.json(
    //   {
    //     success: true,
    //     workspaceId: workspaceRef.id,
    //     message: "Workspace created successfully",
    //   },
    //   { status: 201 },
    // );
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 },
    );
  }
}
