"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { inputClassName, labelClassName } from "@/lib/form-classes";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import type { User } from "@/types/auth";

export default function ProfilePanel({ user }: { user: User }) {
  const { updateProfile, changePassword } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user.name, user.email]);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const profileDirty = name !== user.name || email !== user.email;

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setProfileSaving(true);

    try {
      await updateProfile({
        ...(name !== user.name ? { name } : {}),
        ...(email !== user.email ? { email } : {}),
      });
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(
        err instanceof ApiError ? err.message : "Could not update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch (err) {
      setPasswordError(
        err instanceof ApiError ? err.message : "Could not update password."
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h2 className="mb-6 text-xl font-semibold text-foreground">Profile</h2>
        <div className="overflow-hidden rounded-2xl border border-primary/15 bg-card">
          <div className="border-b border-primary/10 bg-accent px-6 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted">Member since {memberSince}</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5 p-6">
            <div>
              <label htmlFor="profile-name" className={labelClassName}>
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="profile-email" className={labelClassName}>
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div className="rounded-xl bg-accent/60 px-4 py-3">
              <p className="text-xs text-muted">Account ID</p>
              <p className="truncate font-mono text-sm text-foreground/80">{user.id}</p>
            </div>

            {profileError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {profileError}
              </p>
            )}
            {profileMessage && (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-400">
                {profileMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={!profileDirty || profileSaving}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profileSaving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Password</h2>
        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-5 rounded-2xl border border-primary/15 bg-card p-6"
        >
          <div>
            <label htmlFor="current-password" className={labelClassName}>
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="new-password" className={labelClassName}>
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className={labelClassName}>
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClassName}
            />
          </div>

          {passwordError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {passwordError}
            </p>
          )}
          {passwordMessage && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-400">
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Appearance</h2>
        <div className="rounded-2xl border border-primary/15 bg-card p-6">
          <p className="mb-4 text-sm text-muted">
            Choose how Stay N Go looks on your device.
          </p>
          <div className="flex gap-2 rounded-full border border-primary/15 bg-accent p-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                theme === "light"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-primary"
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                theme === "dark"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-primary"
              }`}
            >
              Dark
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Currently using {isDark ? "dark" : "light"} mode.
          </p>
        </div>
      </div>
    </div>
  );
}
