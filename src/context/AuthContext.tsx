"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/client/firebase";
import { usePathname, useRouter } from "next/navigation";
import { User, Workspace } from "@/lib/shared/models";
import {
  createUser,
  getUser,
  getUserWorkspaces,
} from "@/lib/client/db-service";

type AccessToken = { accessToken: string };

interface AuthContextProps {
  firebaseUser: (FirebaseUser & AccessToken) | null;
  userData: User | null;
  workspaces: Workspace[];
  defaultWorkspace: Workspace | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// List of protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/workspace", "/profile", "/settings"];
// List of auth routes (login, register) that should redirect to dashboard if logged in
const AUTH_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [defaultWorkspace, setDefaultWorkspace] = useState<Workspace | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserData = async (fbUser: FirebaseUser) => {
    try {
      // Get user data from Firestore
      let userRecord = await getUser(fbUser.uid);

      // If user doesn't exist in Firestore yet, create them
      if (!userRecord) {
        userRecord = await createUser(fbUser.uid, {
          email: fbUser.email || "",
          displayName: fbUser.displayName || "",
          photoURL: fbUser.photoURL || "",
        });
      }

      setUserData(userRecord);

      // Fetch user workspaces
      const userWorkspaces = await getUserWorkspaces(fbUser.uid);
      setWorkspaces(userWorkspaces);

      // Set default workspace
      if (userRecord.defaultWorkspace) {
        const defaultWs = userWorkspaces.find(
          (ws) => ws.id === userRecord?.defaultWorkspace,
        );
        setDefaultWorkspace(defaultWs || null);
      } else if (userWorkspaces.length > 0) {
        setDefaultWorkspace(userWorkspaces[0]);
      }

      return userRecord;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const refreshUserData = async () => {
    if (firebaseUser) {
      await fetchUserData(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          await fetchUserData(fbUser);
        } else {
          setUserData(null);
          setWorkspaces([]);
          setDefaultWorkspace(null);
        }

        setLoading(false);

        // Handle route protection after auth state is determined
        if (!loading) {
          // If user is authenticated and trying to access auth pages, redirect to dashboard
          if (fbUser && AUTH_ROUTES.includes(pathname)) {
            router.push("/dashboard");
          }

          // If user is not authenticated and trying to access protected routes, redirect to login
          if (
            !fbUser &&
            PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
          ) {
            router.push("/login");
          }

          // If user is authenticated but has no workspaces and is trying to access dashboard
          if (fbUser && workspaces.length === 0 && pathname === "/dashboard") {
            router.push("/workspace/new");
          }
        }
      },
    );

    return () => unsubscribe();
  }, [pathname, loading, router]);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await fetchUserData(userCredential.user);

    // Redirect to dashboard if user has workspaces, otherwise to workspace creation
    if (workspaces.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/workspace/new");
    }
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await fetchUserData(userCredential.user);
    router.push("/workspace/new");
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await fetchUserData(userCredential.user);

    // Redirect to dashboard if user has workspaces, otherwise to workspace creation
    if (workspaces.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/workspace/new");
    }
  };

  // Show loading state while determining authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        workspaces,
        defaultWorkspace,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
