import { ShoppingCart, Menu, X, User, LogOut, History, Trash2, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { useUserRole } from "@/hooks/useUserRole";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, cartCount, cartTotal, removeFromCart, checkout } = useShop();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const completed = await checkout();
    if (completed) {
      setCartOpen(false);
      navigate("/history");
    }
  };

  const navLinks = [
    { label: "Veikals", href: "/shop" },
    { label: "Par mums", href: "/about" },
    { label: "Kontakti", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <span className="font-display text-2xl text-primary-foreground">M</span>
            </div>
            <span className="font-display text-2xl tracking-wider">MOTOPARTS</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <DarkModeToggle />

            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors">
                  <User className="h-5 w-5" />
                </button>
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate("/history"); setProfileOpen(false); }}
                      className="w-full px-4 py-3 text-sm text-left text-muted-foreground hover:text-primary hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <History className="h-4 w-4" /> Iepirkumu vēsture
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { navigate("/admin"); setProfileOpen(false); }}
                        className="w-full px-4 py-3 text-sm text-left text-primary hover:bg-muted transition-colors flex items-center gap-2 font-semibold"
                      >
                        <Shield className="h-4 w-4" /> Administrācija
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full px-4 py-3 text-sm text-left text-muted-foreground hover:text-destructive hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Iziet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="gap-2 font-semibold">
                  <User className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}

            <div className="relative">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen((open) => !open)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              {cartOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-border font-semibold">Cart</div>
                  {cart.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">Your cart is empty.</div>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 border-b border-border px-4 py-3">
                            <img src={item.image} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty {item.quantity} · ${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove item">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex justify-between font-semibold"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
                        <Button className="w-full btn-racing" onClick={handleCheckout}>Pay & Complete Purchase</Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-3 text-lg font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
