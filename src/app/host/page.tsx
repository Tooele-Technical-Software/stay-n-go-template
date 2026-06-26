"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ListingForm from "@/components/host/ListingForm";

export default function HostCreatePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard?tab=hosting"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-foreground">Create a listing</h1>
        <p className="mt-2 text-muted">
          List a home, service, or experience on Stay N Go.
        </p>
        <ListingForm mode="create" />
      </div>
    </DashboardShell>
  );
}
