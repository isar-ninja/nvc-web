import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  Timestamp,
  QueryDocumentSnapshot,
  SnapshotOptions,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { User, Workspace, Plan } from "@/lib/shared/models";

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
      // Ensure usage exists with translations object
      usage: data.usage || { translations: {} },
    } as Workspace;
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

export async function getUserWorkspaces(userId: string) {
  const workspacesRef = collection(db, "workspaces").withConverter(
    workspaceConverter,
  );
  const q = query(workspacesRef, where("ownerId", "==", userId));
  const querySnapshot = await getDocs(q);

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

// Utility functions for translation tracking
export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getTranslationsThisMonth(workspace: Workspace): number {
  const monthKey = getCurrentMonthKey();
  return workspace.usage?.translations?.[monthKey] || 0;
}

export async function getWorkspaceBySlackTeamId(
  slackTeamId: string,
): Promise<Workspace | null> {
  const workspacesRef = collection(db, "workspaces").withConverter(
    workspaceConverter,
  );
  const q = query(
    workspacesRef,
    where("settings.slackTeamId", "==", slackTeamId),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return querySnapshot.docs[0].data();
}
