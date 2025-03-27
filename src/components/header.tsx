"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Menu, X, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export function Header() {
  const { firebaseUser, workspaces, defaultWorkspace, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/workspace");
  const isWorkspacesEmpty = workspaces.length === 0;
  return (
    <header className="border-b px-4 md:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <span>NVC-Bot</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium hover:underline"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:underline"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium hover:underline"
            >
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:underline">
              FAQ
            </Link>
          </nav>
        )}

        {isDashboard && !isWorkspacesEmpty && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:underline"
            >
              Dashboard
            </Link>
            {defaultWorkspace && (
              <>
                <Link
                  href={`/workspace/${defaultWorkspace.id}/settings`}
                  className="text-sm font-medium hover:underline"
                >
                  Settings
                </Link>
                <Link
                  href={`/workspace/${defaultWorkspace.id}/analytics`}
                  className="text-sm font-medium hover:underline"
                >
                  Analytics
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {firebaseUser ? (
            <>
              <span className="text-sm">{firebaseUser.email}</span>
              {isDashboard ? (
                <>
                  {!isWorkspacesEmpty && (
                    <Link href="/workspace/new">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New Workspace
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 border-t">
          {!isDashboard ? (
            <nav className="flex flex-col space-y-3">
              <Link
                href="/#features"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#pricing"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>
          ) : (
            <nav className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {defaultWorkspace && !isWorkspacesEmpty && (
                <>
                  <Link
                    href={`/workspace/${defaultWorkspace.id}/settings`}
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href={`/workspace/${defaultWorkspace.id}/analytics`}
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                </>
              )}
              {workspaces.length > 0 && (
                <Link
                  href="/workspace/new"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Workspace
                </Link>
              )}
            </nav>
          )}

          <div className="pt-4 border-t">
            {firebaseUser ? (
              <>
                <div className="text-sm mb-3">{firebaseUser.email}</div>
                {isDashboard ? (
                  <div className="flex flex-col space-y-2">
                    {!isWorkspacesEmpty && (
                      <Link
                        href="/workspace/new"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-1" />
                          New Workspace
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
