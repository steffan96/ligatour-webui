import React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType, GoogleUser } from "../api/interfaces/auth";
import axiosInstance from '../router/axios';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<GoogleUser>("/api/user/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login  = (): void => { window.location.href = `${process.env.REACT_APP_BASE_URL}/api/auth/google/login`; };
  const logout = (): void => { window.location.href = `${process.env.REACT_APP_BASE_URL}/api/auth/google/logout`; };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}