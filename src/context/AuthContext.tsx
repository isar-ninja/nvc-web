"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// List of protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];
// List of auth routes (login, register) that should redirect to dashboard if logged in
const AUTH_ROUTES = ['/login', '/register'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Handle route protection after auth state is determined
      if (!loading) {
        // If user is authenticated and trying to access auth pages, redirect to dashboard
        if (currentUser && AUTH_ROUTES.includes(pathname)) {
          router.push('/dashboard');
        }

        // If user is not authenticated and trying to access protected routes, redirect to login
        if (!currentUser && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, loading, router]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/dashboard');
  };

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    router.push('/dashboard');
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/dashboard');
  };

  // Show loading state while determining authentication
  if (loading) {
    // You can customize this loading state
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // For protected routes, if user is not authenticated, don't render children
  if (!user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return null; // Return nothing, the useEffect will handle redirection
  }

  // For auth routes, if user is authenticated, don't render children
  if (user && AUTH_ROUTES.includes(pathname)) {
    return null; // Return nothing, the useEffect will handle redirection
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithGoogle }}
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
