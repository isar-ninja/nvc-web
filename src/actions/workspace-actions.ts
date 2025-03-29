"use server";
import { User, Workspace } from "@/lib/shared/models";
import { verifyCookie } from "./auth-actions";
import { adminDb } from "@/lib/server/firebase-admin";
import {
  FieldValue,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import { getUserAction, updateUserAction } from "./user-actions";

export async function createWorkspaceAction(
  workspaceName: string,
): Promise<Workspace> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not found");
    const existingUser = (await getUserAction()) as User;
    const userRef = adminDb.collection("users").doc(user.uid);
    const canCreateMore =
      existingUser?.subscription?.maxWorkspaces >
      existingUser?.workspaces.length;

    if (!canCreateMore) {
      throw new Error(
        "You've reached the maximum number of workspaces for your subscription plan. Please upgrade to create more workspaces.",
      );
    }

    const workspaceRef = adminDb.collection("workspaces").doc();

    const newWorkspace: Workspace = {
      ownerId: user.uid,
      id: workspaceRef.id,
      name: workspaceName,
      createdAt: FieldValue.serverTimestamp(),
      usage: { translations: {} },
      settings: {},
    };

    await workspaceRef.set(newWorkspace);

    const updatedWorkspaces = [
      ...(existingUser.workspaces || []),
      workspaceRef.id,
    ];
    const userUpdates: Partial<User> = {
      workspaces: updatedWorkspaces,
    };
    if (!existingUser?.workspaces.length) {
      userUpdates.defaultWorkspace = newWorkspace.id;
    }

    await userRef.update(userUpdates);
    // Convert the server timestamp to Date for the return value
    return { ...newWorkspace, createdAt: new Date() };
  } catch (error) {
    console.error(`Error getting plans:`, error);
    throw error;
  }
}

export async function getWorkspacesAction(): Promise<Workspace[]> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not found");
    const plansRef = adminDb
      .collection("workspaces")
      .withConverter(workspaceConverter);
    const workspaceDocs = await plansRef.where("ownerId", "==", user.uid).get();
    const workspaces = workspaceDocs.docs.map((doc) => doc.data() as Workspace);
    return workspaces;
  } catch (error) {
    console.error(`Error getting workspace:`, error);
    throw error;
  }
}

export async function getWorkspaceByIdAction(
  workspaceId: string,
): Promise<Workspace | null> {
  try {
    const { data: user } = await verifyCookie();
    if (!user) throw new Error("User not authenticated");

    // Get the workspace document
    const workspaceRef = adminDb
      .collection("workspaces")
      .doc(workspaceId)
      .withConverter(workspaceConverter);

    const workspaceDoc = await workspaceRef.get();

    if (!workspaceDoc.exists) {
      return null;
    }

    const workspace = workspaceDoc.data() as Workspace;

    // Security check - ensure the user is authorized to access this workspace
    if (workspace.ownerId !== user.uid) {
      throw new Error("You do not have permission to access this workspace");
    }

    return workspace;
  } catch (error) {
    console.error(`Error getting workspace by ID:`, error);
    throw error;
  }
}

const workspaceConverter = {
  toFirestore: (workspace: Workspace) => ({
    ...workspace,
    createdAt:
      workspace.createdAt instanceof Date
        ? Timestamp.fromDate(workspace.createdAt)
        : workspace.createdAt,
  }),
  fromFirestore: (snapshot: QueryDocumentSnapshot): Workspace => {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt,
      // Ensure usage exists with translations object
      usage: data.usage || { translations: {} },
    } as Workspace;
  },
};
