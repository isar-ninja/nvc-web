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
import { createCookie, deleteCookie } from "@/actions/auth-actions";
import { getWorkspacesAction } from "@/actions/workspace-actions";
import { createUserAction, getUserAction } from "@/actions/user-actions";
import { Loader2 } from "lucide-react";

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
  refreshWorkspaces: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// List of protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/workspace", "/profile", "/settings"];
// List of auth routes (login, register) that should redirect to dashboard if logged in
const AUTH_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<
    (FirebaseUser & AccessToken) | null
  >(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [defaultWorkspace, setDefaultWorkspace] = useState<Workspace | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserData = async () => {
    try {
      // Get user data from Firestore
      let userRecord = await getUserAction();
      if (userRecord) {
        setUserData(userRecord);
      } else {
        // Call the server-side API to create the user
        userRecord = await createUserAction();
        setUserData(userRecord);
      }

      // Fetch user workspaces
      const userWorkspaces = await getWorkspacesAction();
      setWorkspaces(userWorkspaces);

      // Set default workspace
      if (userRecord?.defaultWorkspace) {
        const defaultWs = userWorkspaces.find(
          (ws) => ws.id === userRecord?.defaultWorkspace,
        );
        setDefaultWorkspace(defaultWs || null);
      } else if (userWorkspaces.length > 0) {
        setDefaultWorkspace(userWorkspaces[0]);
      }

      return { userRecord, userWorkspaces };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { userRecord: null, userWorkspaces: [] };
    }
  };

  const refreshUserData = async () => {
    if (firebaseUser) {
      await fetchUserData();
    }
  };

  async function refreshWorkspaces() {
    if (firebaseUser) {
      const userWorkspaces = await getWorkspacesAction();
      setWorkspaces(userWorkspaces);
      if (userData?.defaultWorkspace) {
        const defaultWs = userWorkspaces.find(
          (ws) => ws.id === userData?.defaultWorkspace,
        );
        setDefaultWorkspace(defaultWs || null);
      } else if (userWorkspaces.length > 0) {
        setDefaultWorkspace(userWorkspaces[0]);
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {
        // console.log("fbUser:", fbUser);
        const userWithToken = fbUser as FirebaseUser & AccessToken;
        setFirebaseUser(userWithToken);

        if (fbUser) {
          await createCookie(userWithToken.accessToken);
          await fetchUserData();
        } else {
          // If logged out, clear the session cookie
          deleteCookie();
          setUserData(null);
          setWorkspaces([]);
          setDefaultWorkspace(null);
        }

        setLoading(false);
        setInitialAuthCheckComplete(true);
      },
    );

    return () => unsubscribe();
  }, []);

  // Handle routing after auth state and initial data load is complete
  useEffect(() => {
    if (!initialAuthCheckComplete) return;

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    // if (firebaseUser && AUTH_ROUTES.includes(pathname)) {
    //   router.push("/dashboard");
    // }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (
      !firebaseUser &&
      PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    ) {
      router.push("/login");
    }
  }, [
    pathname,
    initialAuthCheckComplete,
    firebaseUser,
    workspaces.length,
    router,
  ]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const { userWorkspaces, userRecord } = await fetchUserData();

      if (!userRecord?.displayName) {
        return router.push("/onboarding/company");
      }
      // Redirect to dashboard if user has workspaces, otherwise to workspace creation
      if (userWorkspaces.length > 0) {
        router.push("/dashboard");
      } else {
        router.push("/workspace/new");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await fetchUserData();
      router.push("/workspace/new");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    await deleteCookie();
    router.push("/");
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const { userWorkspaces, userRecord } = await fetchUserData();

      // Redirect to dashboard if user has workspaces, otherwise to workspace creation
      if (!userRecord?.displayName) {
        return router.push("/onboarding/company");
      }
      if (userWorkspaces.length > 0) {
        router.push("/dashboard");
      } else {
        console.log("heheheheheh");
        router.push("/workspace/new");
      }
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Show better loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading your account...</p>
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
        refreshWorkspaces,
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
