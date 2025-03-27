import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { db } from "./firebase";
import { User, Workspace, Plan } from "@/lib/shared/models";

export const memberRoles = ["owner", "admin", "member"] as const;
export type MemberRole = (typeof memberRoles)[number];

// Define workspace member interface
export interface WorkspaceMember {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: MemberRole;
  joinedAt: Date | number;
  invitedBy?: string; // UID of the user who invited this member
  lastActive?: Date | number;
  settings?: {
    notifications?: boolean;
    // Add other member-specific settings as needed
  };
}

// FireStore Converters
const userConverter = {
  toFirestore: (user: User) => ({
    ...user,
    createdAt:
      user.createdAt instanceof Date
        ? Timestamp.fromDate(user.createdAt)
        : user.createdAt,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): User => {
    const data = snapshot.data(options);
    return {
      ...data,
      uid: snapshot.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt,
    } as User;
  },
};

const workspaceConverter = {
  toFirestore: (workspace: Workspace) => ({
    ...workspace,
    createdAt:
      workspace.createdAt instanceof Date
        ? Timestamp.fromDate(workspace.createdAt)
        : workspace.createdAt,
    subscription: {
      ...workspace.subscription,
      currentPeriodEnd:
        workspace.subscription.currentPeriodEnd instanceof Date
          ? Timestamp.fromDate(workspace.subscription.currentPeriodEnd)
          : workspace.subscription.currentPeriodEnd,
    },
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Workspace => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt,
      subscription: {
        ...data.subscription,
        currentPeriodEnd:
          data.subscription.currentPeriodEnd instanceof Timestamp
            ? data.subscription.currentPeriodEnd.toDate()
            : data.subscription.currentPeriodEnd,
      },
    } as Workspace;
  },
};

const memberConverter = {
  toFirestore: (member: WorkspaceMember) => ({
    ...member,
    joinedAt:
      member.joinedAt instanceof Date
        ? Timestamp.fromDate(member.joinedAt)
        : member.joinedAt,
    lastActive:
      member.lastActive instanceof Date
        ? Timestamp.fromDate(member.lastActive)
        : member.lastActive,
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): WorkspaceMember => {
    const data = snapshot.data(options);
    return {
      ...data,
      joinedAt:
        data.joinedAt instanceof Timestamp
          ? data.joinedAt.toDate()
          : data.joinedAt,
      lastActive:
        data.lastActive instanceof Timestamp
          ? data.lastActive.toDate()
          : data.lastActive,
    } as WorkspaceMember;
  },
};

// User Functions
export async function createUser(uid: string, userData: Partial<User>) {
  const userRef = doc(db, "users", uid).withConverter(userConverter);
  const newUser: User = {
    uid,
    email: userData.email || "",
    displayName: userData.displayName || "",
    photoURL: userData.photoURL || "",
    workspaces: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, newUser);
  return newUser;
}

export async function getUser(uid: string) {
  const userRef = doc(db, "users", uid).withConverter(userConverter);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }

  return null;
}

export async function updateUser(uid: string, data: Partial<User>) {
  const userRef = doc(db, "users", uid).withConverter(userConverter);
  await updateDoc(userRef, data);
}

// Workspace Functions
export async function createWorkspace(
  workspaceData: Omit<Workspace, "id" | "createdAt" | "members"> & {
    owner: User;
  },
) {
  const workspacesRef = collection(db, "workspaces").withConverter(
    workspaceConverter,
  );
  const workspaceRef = doc(workspacesRef);

  const newWorkspace: Workspace = {
    id: workspaceRef.id,
    ...workspaceData,
    members: [workspaceData.owner.uid],
    createdAt: serverTimestamp(),
  };

  await setDoc(workspaceRef, newWorkspace);

  const memberRef = doc(
    collection(workspaceRef, "members"),
    workspaceData.owner.uid,
  ).withConverter(memberConverter);

  const ownerMember: WorkspaceMember = {
    uid: workspaceData.owner.uid,
    email: workspaceData.owner.email,
    displayName: workspaceData.owner.displayName,
    photoURL: workspaceData.owner.photoURL,
    role: "owner" as MemberRole,
    joinedAt: serverTimestamp(),
  };
  await setDoc(memberRef, ownerMember);
  // Update user's workspaces array
  const userRef = doc(db, "users", workspaceData.ownerId).withConverter(
    userConverter,
  );
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const updatedWorkspaces = [...userData.workspaces, workspaceRef.id];
    await updateDoc(userRef, {
      workspaces: updatedWorkspaces,
      defaultWorkspace: userData.defaultWorkspace || workspaceRef.id,
    });
  }

  return newWorkspace;
}

export async function getWorkspace(id: string) {
  const workspaceRef = doc(db, "workspaces", id).withConverter(
    workspaceConverter,
  );
  const workspaceSnap = await getDoc(workspaceRef);

  if (workspaceSnap.exists()) {
    return workspaceSnap.data();
  }

  return null;
}

export async function updateWorkspace(id: string, data: Partial<Workspace>) {
  const workspaceRef = doc(db, "workspaces", id).withConverter(
    workspaceConverter,
  );
  await updateDoc(workspaceRef, data);
}

export async function getUserWorkspaces(userId: string) {
  const workspacesRef = collection(db, "workspaces").withConverter(
    workspaceConverter,
  );
  const q = query(workspacesRef, where("ownerId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data());
}

export async function getWorkspaceMembers(workspaceId: string) {
  const membersRef = collection(
    db,
    "workspaces",
    workspaceId,
    "members",
  ).withConverter(memberConverter);
  const querySnapshot = await getDocs(membersRef);

  return querySnapshot.docs.map((doc) => doc.data());
}

// Plan Functions
export async function getAvailablePlans() {
  const plansRef = collection(db, "plans");
  const querySnapshot = await getDocs(plansRef);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Plan[];
}
