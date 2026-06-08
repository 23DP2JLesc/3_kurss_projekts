import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, setAuthToken, clearAuthToken } from "@/integrations/api/client";

interface AuthContextType {
  user: any;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    const res = await authApi.register(email, password, displayName);
    if (res.token) setAuthToken(res.token);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res.token) setAuthToken(res.token);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuthToken();
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);