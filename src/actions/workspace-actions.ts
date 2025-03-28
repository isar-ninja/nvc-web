"use server";
import { createWorkspace, getUser, updateUser } from "@/lib/server/db-service";
import { adminAuth } from "@/lib/server/firebase-admin";
import { User, Workspace } from "@/lib/shared/models";

export async function createWorkspaceAction(
  token: string,
  name: string,
): Promise<Workspace> {
  try {
    const user = await adminAuth.verifyIdToken(token);
    const existingUser = (await getUser(user.uid)) as User;

    const canCreateMore =
      existingUser?.subscription?.maxWorkspaces >
      existingUser?.workspaces.length;

    if (!canCreateMore) {
      throw new Error(
        "You've reached the maximum number of workspaces for your subscription plan. Please upgrade to create more workspaces.",
      );
    }

    const newWorkspace = await createWorkspace({
      name: name.trim(),
      ownerId: user.uid,
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
    if (!existingUser?.workspaces.length) {
      await updateUser(user.uid, {
        defaultWorkspace: newWorkspace.id,
      });
    }
    // Convert the server timestamp to Date for the return value
    return newWorkspace;
  } catch (error) {
    console.error(`Error getting plans:`, error);
    throw error;
  }
}
