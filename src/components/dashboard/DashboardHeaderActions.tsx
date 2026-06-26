"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import LogoutButton from "@/components/auth/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProfileAvatar({
  href = "/dashboard?tab=profile",
}: {
  href?: string;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return null;

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <Link
      href={href}
      title="Your account"
      aria-label="Go to your account"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-sm shadow-primary/25 ring-2 ring-card transition-all hover:bg-primary-dark hover:shadow-md"
    >
      {initial}
    </Link>
  );
}

export function DashboardHeaderActions() {
  const pathname = usePathname();
  const onExplore = pathname === "/explore";
  const onHost = pathname === "/host";

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {!onExplore && (
        <Link
          href="/explore"
          className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
        >
          Explore
        </Link>
      )}
      {!onHost && (
        <Link
          href="/host"
          className="hidden rounded-full border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:inline"
        >
          Host a place
        </Link>
      )}
      <ThemeToggle />
      <ProfileAvatar />
      <LogoutButton />
    </div>
  );
}
