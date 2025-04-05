"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Plus, Globe } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "@/components/lang-switch";

export function Header(props: { dict: any }) {
  const { firebaseUser, workspaces, defaultWorkspace, logout } = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dict } = props;

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isDashboard =
    pathname.includes("/dashboard") || pathname.includes("/workspace");
  const isWorkspacesEmpty = workspaces.length === 0;

  return (
    <div className="relative border-b px-4 md:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <Image
              priority
              alt="Goodspeech Logo"
              height={40}
              width={120}
              src="/logo.svg"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${lang}#features`}
              className="text-sm font-medium hover:underline"
            >
              {dict.navigation.features}
            </Link>
            <Link
              href={`/${lang}#how-it-works`}
              className="text-sm font-medium hover:underline"
            >
              {dict.navigation.howItWorks}
            </Link>
            <Link
              href={`/${lang}#pricing`}
              className="text-sm font-medium hover:underline"
            >
              {dict.navigation.pricing}
            </Link>
            <Link href={`/${lang}#faq`} className="text-sm font-medium hover:underline">
              {dict.navigation.faq}
            </Link>
          </nav>
        )}

        {isDashboard && !isWorkspacesEmpty && false && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${lang}/dashboard`}
              className="text-sm font-medium hover:underline"
            >
              {dict.navigation.dashboard}
            </Link>
            {defaultWorkspace && (
              <>
                <Link
                  href={`/${lang}/workspace/${defaultWorkspace?.id}/settings`}
                  className="text-sm font-medium hover:underline"
                >
                  {dict.navigation.settings}
                </Link>
                <Link
                  href={`/${lang}/workspace/${defaultWorkspace?.id}/analytics`}
                  className="text-sm font-medium hover:underline"
                >
                  {dict.navigation.analytics}
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Desktop Auth Buttons and Language Switcher */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 mr-2 border-r pr-4">
            <Globe className="h-4 w-4 text-slate-400" />
            <LanguageSwitcher />
          </div>

          {firebaseUser ? (
            <>
              {/* <span className="text-sm">{firebaseUser.email}</span> */}
              {isDashboard ? (
                <>
                  {!isWorkspacesEmpty && (
                    <Link href={`/${lang}/workspace/new`}>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        {dict.actions.newWorkspace}
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    {dict.actions.logout}
                  </Button>
                </>
              ) : (
                <>
                  <Link href={`/${lang}/dashboard`}>
                    <Button variant="outline">
                      {dict.navigation.dashboard}
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    {dict.actions.logout}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Link href={`/${lang}/login`}>
                <Button variant="outline">{dict.actions.login}</Button>
              </Link>
              <Link href={`/${lang}/register`}>
                <Button>{dict.actions.signUp}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {/* Language Switcher for Mobile */}
          <div className="mr-4 flex items-center">
            <Globe className="h-4 w-4 text-slate-400 mr-1" />
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={dict.aria.toggleMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 border-t">
          {!isDashboard ? (
            <nav className="flex flex-col space-y-3">
              <Link
                href={`/${lang}#features`}
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.navigation.features}
              </Link>
              <Link
                href={`/${lang}#how-it-works`}
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.navigation.howItWorks}
              </Link>
              <Link
                href={`/${lang}#pricing`}
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.navigation.pricing}
              </Link>
              <Link
                href={`/${lang}#faq`}
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.navigation.faq}
              </Link>
            </nav>
          ) : (
            <nav className="flex flex-col space-y-3">
              <Link
                href={`/${lang}/dashboard`}
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.navigation.dashboard}
              </Link>
              {defaultWorkspace && !isWorkspacesEmpty && (
                <>
                  <Link
                    href={`/${lang}/workspace/${defaultWorkspace.id}/settings`}
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dict.navigation.settings}
                  </Link>
                  <Link
                    href={`/${lang}/workspace/${defaultWorkspace.id}/analytics`}
                    className="text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dict.navigation.analytics}
                  </Link>
                </>
              )}
              {workspaces.length > 0 && (
                <Link
                  href={`/${lang}/workspace/new`}
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dict.actions.newWorkspace}
                </Link>
              )}
            </nav>
          )}

          <div className="pt-4 border-t">
            {firebaseUser ? (
              <>
                {/* <div className="text-sm mb-3">{firebaseUser.email}</div> */}
                {isDashboard ? (
                  <div className="flex flex-col space-y-2">
                    {!isWorkspacesEmpty && (
                      <Link
                        href={`/${lang}/workspace/new`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-1" />
                          {dict.actions.newWorkspace}
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      {dict.actions.logout}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/${lang}/dashboard`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        {dict.navigation.dashboard}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      {dict.actions.logout}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href={`/${lang}/login`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {dict.actions.login}
                  </Button>
                </Link>
                <Link href={`/${lang}/register`} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">{dict.actions.signUp}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
