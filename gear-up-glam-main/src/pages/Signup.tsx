import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !displayName.trim()) {
      toast({ title: "Kļūda", description: "Lūdzu, aizpildi visus laukus.", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Kļūda", description: "Parolei jābūt vismaz 6 rakstzīmēm.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await register(email, password, displayName);
      toast({
        title: "Konts izveidots!",
        description: "Laipni lūdzam MOTOPARTS! Tagad esi pieslēdzies.",
      });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Reģistrācija neizdevās", description: error.message || "Nevarēja izveidot kontu", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
              <span className="font-display text-3xl text-primary-foreground">M</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl mt-4">Pievienojies MOTOPARTS</h1>
          <p className="text-muted-foreground mt-2">Izveido savu kontu, lai sāktu iepirkties</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="bg-card border border-border rounded-xl p-8 space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Vārds"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="pl-11 py-6 bg-background border-border"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="E-pasta adrese"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 py-6 bg-background border-border"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Parole (vismaz 6 rakstzīmes)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 py-6 bg-background border-border"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full py-6 text-lg font-semibold gap-2">
            {loading ? "Veidojam kontu..." : "Izveidot kontu"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </Button>
        </form>

        <p className="text-center mt-6 text-muted-foreground">
          Jau ir konts?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Pieslēdzies
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            ← Atpakaļ uz veikalu
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
