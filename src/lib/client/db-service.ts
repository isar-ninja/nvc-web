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
  toFirestore: (user: User) => {
    const userData = { ...user };

    // Convert createdAt Date to Timestamp if needed
    if (userData.createdAt instanceof Date) {
      userData.createdAt = Timestamp.fromDate(userData.createdAt);
    }

    // Convert subscription.currentPeriodEnd Date to Timestamp if needed
    if (userData.subscription?.currentPeriodEnd instanceof Date) {
      userData.subscription = {
        ...userData.subscription,
        currentPeriodEnd: Timestamp.fromDate(
          userData.subscription.currentPeriodEnd,
        ),
      };
    }

    return userData;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): User => {
    const data = snapshot.data(options) as User;

    // Initialize the user object with default values for new fields
    const user: User = {
      ...data,
      uid: snapshot.id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt,
      usage: data.usage || { totalTranslations: {} },
    };

    // Convert subscription.currentPeriodEnd Timestamp to Date if needed
    if (data.subscription?.currentPeriodEnd instanceof Timestamp) {
      user.subscription.currentPeriodEnd =
        data.subscription.currentPeriodEnd.toDate();
    }

    return user;
  },
};

const workspaceConverter = {
  toFirestore: (workspace: Workspace) => ({
    ...workspace,
    createdAt:
      workspace.createdAt instanceof Date
        ? Timestamp.fromDate(workspace.createdAt)
        : workspace.createdAt,
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
    subscription: {
      planId: "free",
      status: "trialing",
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      billingCycle: "monthly",
      cancelAtPeriodEnd: false,
      maxTranslationsPerMonth: 100,
      maxWorkspaces: 1,
    },
    usage: { totalTranslations: {} },
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

export function getUserTranslationsThisMonth(user: User): number {
  const monthKey = getCurrentMonthKey();
  return user.usage?.totalTranslations?.[monthKey] || 0;
}

export function getRemainingTranslations(user: User): number {
  const translationsThisMonth = getUserTranslationsThisMonth(user);
  const maxTranslations = user.subscription?.maxTranslationsPerMonth || 100;
  return Math.max(0, maxTranslations - translationsThisMonth);
}

export async function canUserCreateMoreWorkspaces(
  user: User,
): Promise<boolean> {
  return (
    (user.workspaces?.length || 0) < (user.subscription?.maxWorkspaces || 1)
  );
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
