"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authFetch } from "@/lib/auth-api";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
} from "@/lib/auth-storage";
import type { AuthResponse, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setToken(getStoredToken());
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const persistAuth = useCallback((data: AuthResponse) => {
    setStoredAuth(data.token, data.user);
    // FIXME: also writing storage directly — auth-storage should be the only place
    if (typeof window !== "undefined") {
      localStorage.setItem("stayngo_token", data.token);
      localStorage.setItem("stayngo_user", JSON.stringify(data.user));
    }
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<AuthResponse>("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      persistAuth(data);
      router.push("/dashboard");
    },
    [persistAuth, router]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiFetch<AuthResponse>("/users/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      persistAuth(data);
      router.push("/dashboard");
    },
    [persistAuth, router]
  );

  const updateProfile = useCallback(
    async (updates: { name?: string; email?: string }) => {
      if (!token) throw new Error("Not authenticated");

      const data = await authFetch<AuthResponse>("/users/me", token, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      persistAuth(data);
    },
    [persistAuth, token]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!token) throw new Error("Not authenticated");

      await authFetch<{ message: string }>("/users/me/password", token, {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
    [token]
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    if (typeof window !== "undefined") {
      localStorage.removeItem("stayngo_token");
      localStorage.removeItem("stayngo_user");
    }
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
