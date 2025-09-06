// components/auth/auth-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Allow 'admin' | 'user' plus any string to be flexible with roles.
type Role = "admin" | "user" | (string & {});
export type User = {
  email: string;
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  setUser: (u: User | null) => void;
  login: (email: string, name: string, role?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ Give useState a generic so the setter accepts User | null
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Optional: hydrate from localStorage (safe no-op on server)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("auth.user");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as User;
      setUser(parsed);
      setIsAdmin(parsed.role === "admin");
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("auth.user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth.user");
    }
  }, [user]);

  const login = (email: string, name: string, role: string = "user") => {
    const nextUser: User = { email, name, role: role as Role };
    setUser(nextUser);
    setIsAdmin(nextUser.role === "admin");
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
