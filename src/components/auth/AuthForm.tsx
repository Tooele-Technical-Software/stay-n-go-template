"use client";

import { useState } from "react";
import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import ThemeToggle from "@/components/ThemeToggle";
import { ApiError } from "@/lib/api";
import { inputClassName, labelClassName } from "@/lib/form-classes";
import { useAuth } from "@/context/AuthProvider";

type Mode = "login" | "signup";

export default function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to connect to the server. Is the API running?");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <ThemeToggle />
        </div>
        <LogoLink className="inline-flex items-center gap-2" size="lg" />
        <p className="mt-3 text-muted">
          {mode === "login"
            ? "Welcome back — sign in to your account"
            : "Create an account to get started"}
        </p>
      </div>

      <div className="mb-6 flex rounded-full border border-primary/20 bg-card p-1 shadow-sm">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
            mode === "login"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-primary"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-primary"
          }`}
        >
          Sign up
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-primary/15 bg-card p-8 shadow-md shadow-primary/5"
      >
        {mode === "signup" && (
          <div className="mb-5">
            <label htmlFor="name" className={labelClassName}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClassName}
              placeholder="Jane Guest"
            />
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className={labelClassName}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : 1}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="font-medium text-primary hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
