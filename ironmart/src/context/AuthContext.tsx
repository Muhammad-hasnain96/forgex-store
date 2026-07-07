"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  cartCount: number;
  refreshAuth: () => Promise<void>;
  refreshCart: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string } | { user: User }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string } | { user: User }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user || user.role !== "customer") {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.count ?? 0);
      }
    } catch {
      setCartCount(0);
    }
  }, [user]);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Login failed." };
    setUser(data.user);
    await refreshCart();
    return { user: data.user as User };
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Signup failed." };
    setUser(data.user);
    await refreshCart();
    return { user: data.user as User };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, cartCount, refreshAuth, refreshCart, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
