"use client";

import { useAuth } from "@/context/AuthProvider";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
    >
      Log out
    </button>
  );
}
