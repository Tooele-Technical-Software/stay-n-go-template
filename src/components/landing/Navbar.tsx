"use client";

import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthProvider";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-primary/15 bg-card/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <LogoLink />

        {!user && !isLoading && (
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/host"
            className="hidden rounded-full border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:inline"
          >
            Host a place
          </Link>
          {!isLoading && user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-primary-dark"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
