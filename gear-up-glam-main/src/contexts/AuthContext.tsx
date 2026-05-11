import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, setAuthToken, clearAuthToken } from "@/integrations/api/client";

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    displayName?: string;
    avatarUrl?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const decoded = JSON.parse(
          atob(token.split(".")[1]) // JWT payload is second part
        );
        setUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });
      } catch (e) {
        // Invalid token, clear it
        clearAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const response = await authApi.register(email, password, displayName);
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authApi.login(email, password);
      if (response.token) {
        setAuthToken(response.token);
        setUser(response.user);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      setUser(null);
      clearAuthToken();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
