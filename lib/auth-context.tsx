"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, MembershipLevel } from "./types";
import { seedUsers } from "./seed-data";

// Permission hierarchy: lower index = higher authority
const LEVEL_HIERARCHY: MembershipLevel[] = [
  "مشرف عام",
  "مدير إقليمي",
  "مدير مجلس",
  "عضو",
  "زائر",
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessKey: string) => { success: boolean; error?: string };
  logout: () => void;
  hasPermission: (requiredLevel: MembershipLevel) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((accessKey: string) => {
    const found = seedUsers.find((u) => u.access_key === accessKey.trim().toUpperCase());
    if (!found) {
      return { success: false, error: "مفتاح الوصول غير صالح. يرجى التحقق والمحاولة مرة أخرى." };
    }
    setUser(found);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (requiredLevel: MembershipLevel) => {
      if (!user) return false;
      const userIndex = LEVEL_HIERARCHY.indexOf(user.membership_level);
      const requiredIndex = LEVEL_HIERARCHY.indexOf(requiredLevel);
      return userIndex <= requiredIndex;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
