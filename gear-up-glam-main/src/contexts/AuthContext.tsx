import React, { createContext, useContext, useState } from "react";
import { authApi, setAuthToken, clearAuthToken } from "@/integrations/api/client";

interface AuthContextType {
  user: any;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const register = async (email: string, password: string, displayName: string) => {
    const res = await authApi.register(email, password, displayName);

    if (res.token) {
      setAuthToken(res.token);
    }

    if (res.user) {
      setUser(res.user);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);

    if (res.token) {
      setAuthToken(res.token);
    }

    if (res.user) {
      setUser(res.user);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);