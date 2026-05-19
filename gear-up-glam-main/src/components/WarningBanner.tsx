import { useEffect, useState } from "react";
import { profileApi } from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { AlertTriangle, X } from "lucide-react";

export const WarningBanner = () => {
  const { user } = useAuth();
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWarning(null);
      return;
    }
    fetchWarning();
  }, [user]);

  const fetchWarning = async () => {
    try {
      const profile = await profileApi.get();
      setWarning(profile.warningMessage || null);
    } catch (error) {
      setWarning(null);
    }
  };

  const acknowledge = async () => {
    setWarning(null);
  };

  if (!warning) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-destructive/10 border-b border-destructive/40 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
        <div className="flex-1 text-sm">
          <span className="font-semibold text-destructive">Administratora brīdinājums: </span>
          {warning}
        </div>
        <Button size="sm" variant="outline" onClick={acknowledge} className="gap-1">
          <X className="h-4 w-4" /> Saprotu
        </Button>
      </div>
    </div>
  );
};