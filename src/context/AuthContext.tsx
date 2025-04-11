"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
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
import { auth, db } from "@/lib/client/firebase";
import { useParams, usePathname, useRouter } from "next/navigation";
import { User, Workspace } from "@/lib/shared/models";
import { createCookie, deleteCookie } from "@/actions/auth-actions";
import { getWorkspacesAction } from "@/actions/workspace-actions";
import { createUserAction, getUserAction } from "@/actions/user-actions";
import { LogoLoading } from "@/components/logo-loader";
import { doc, onSnapshot } from "firebase/firestore";

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

// List of protected routes that require authentication (without language prefix)
const PROTECTED_ROUTES = ["/dashboard", "/workspace", "/profile", "/settings"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<
    (FirebaseUser & AccessToken) | null
  >(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [defaultWorkspace, setDefaultWorkspace] = useState<Workspace | null>(
    null,
  );
  const [subscriptionListener, setSubscriptionListener] = useState<
    (() => void) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lang = (params.lang as string) || "en";

  useEffect(() => {
    // Only set up listener if we have a user and their subscription is pending
    if (
      firebaseUser &&
      userData &&
      userData.subscription &&
      userData.subscription.status === "pending"
    ) {
      // If we already have a listener, clean it up
      if (subscriptionListener) {
        subscriptionListener();
      }

      console.log("Setting up subscription listener for pending payment");

      // Create new listener for the user document
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const updatedUserData = docSnapshot.data() as User;

            // Check if subscription status has changed from pending
            if (
              updatedUserData.subscription &&
              updatedUserData.subscription.status !== "pending"
            ) {
              console.log(
                `Subscription status changed: ${updatedUserData.subscription.status}`,
              );

              // Update local user data
              setUserData(updatedUserData);

              // If status is now active, we can clean up the listener
              if (updatedUserData.subscription.status === "active") {
                console.log(
                  "Payment processed successfully, removing listener",
                );
                unsubscribe();
                setSubscriptionListener(null);
              }
            }
          }
        },
        (error) => {
          console.error("Error listening for subscription changes:", error);
        },
      );

      // Store the unsubscribe function
      setSubscriptionListener(() => unsubscribe);

      // Clean up listener when component unmounts
      return () => {
        unsubscribe();
        setSubscriptionListener(null);
      };
    } else if (
      subscriptionListener &&
      userData?.subscription?.status !== "pending"
    ) {
      // If we have a listener but subscription is no longer pending, clean it up
      console.log("Removing subscription listener - no longer needed");
      subscriptionListener();
      setSubscriptionListener(null);
    }
  }, [
    firebaseUser,
    userData?.subscription?.status,
    subscriptionListener,
    userData,
  ]);

  // Helper function to get localized route
  const getLocalizedRoute = useCallback(
    (route: string) => {
      return `/${lang}${route}`;
    },
    [lang],
  );

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

    // Check if current path (without language prefix) is a protected route
    const pathWithoutLang = pathname.replace(new RegExp(`^/${lang}`), "");

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (
      !firebaseUser &&
      PROTECTED_ROUTES.some((route) => pathWithoutLang.startsWith(route))
    ) {
      router.push(getLocalizedRoute("/login"));
    }
  }, [
    pathname,
    initialAuthCheckComplete,
    getLocalizedRoute,
    firebaseUser,
    workspaces.length,
    router,
    lang,
  ]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(true);
      await fetchUserData();
      return router.push(getLocalizedRoute("/dashboard"));
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(true);
      await fetchUserData();
      router.push(getLocalizedRoute("/dashboard"));
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    await deleteCookie();
    router.push(getLocalizedRoute("/"));
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoading(true);
      await fetchUserData();
      router.push(getLocalizedRoute("/dashboard"));
    } catch (error) {
      setLoading(false);
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Show better loading state
  if (loading) {
    return (
      <div className="px-6 flex-1 flex min-h-screen flex-col items-center justify-center">
        <LogoLoading className="mb-8 w-full md:w-[400px]" full repeat />
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
