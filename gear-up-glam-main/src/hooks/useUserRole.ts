import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    // Check role from user object (set during auth)
    setIsAdmin(user.role?.toLowerCase() === "admin");
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
};
