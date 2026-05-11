# Frontend Migration Guide: Supabase → Custom Node.js API

Complete guide to replace Supabase calls with your new Express.js API in the React frontend.

## Overview

**What's Changing:**
- ❌ Supabase auth (signUp, signInWithPassword) → JWT-based auth
- ❌ Supabase database queries → REST API calls
- ✅ AuthContext → Keep structure, change implementation
- ✅ ShopContext → Keep structure, change implementation

**Token Storage:**
- Tokens stored in `localStorage` with key `auth_token`
- Sent in `Authorization: Bearer <token>` header on API requests

---

## 1. Update Environment Variables

In your **frontend** project, update (or create) `.env.local`:

```env
# OLD (Supabase)
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...

# NEW
VITE_API_URL=http://localhost:3000
```

Update `vite.config.ts` if needed to expose this variable.

---

## 2. Replace Supabase Client

### **Delete:**
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts` (keep as reference if needed)
- `src/integrations/supabase/` folder

### **Create New API Client:**

Create `src/integrations/api/client.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
}

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    apiFetch<ApiResponse<any>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email: string, password: string) =>
    apiFetch<ApiResponse<any>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => {
    clearAuthToken();
    return apiFetch('/api/auth/logout', { method: 'POST' });
  },
};

// Products API
export const productsApi = {
  getAll: (filters?: { category?: string; brand?: string; search?: string }) =>
    apiFetch('/api/products', {
      method: 'GET',
    }),

  getById: (id: string) =>
    apiFetch(`/api/products/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/api/products/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  getAll: () =>
    apiFetch('/api/orders', { method: 'GET' }),

  create: (items: any[]) =>
    apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};

// Profile API
export const profileApi = {
  get: () =>
    apiFetch('/api/profile', { method: 'GET' }),

  update: (data: any) =>
    apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Users API (admin)
export const usersApi = {
  getAll: () =>
    apiFetch('/api/users', { method: 'GET' }),

  updateRole: (id: string, role: string) =>
    apiFetch(`/api/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  banUser: (id: string, banned: boolean) =>
    apiFetch(`/api/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ banned }),
    }),
};
```

---

## 3. Update AuthContext

Replace `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, setAuthToken, clearAuthToken } from "@/integrations/api/client";
import { toast } from "sonner";

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
      // Optionally verify token is still valid by fetching profile
      // For now, assume token is valid
      const decoded = JSON.parse(
        atob(token.split(".")[1]) // JWT payload is second part
      );
      setUser({
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });
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
        toast.success("Account created successfully!");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
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
        toast.success("Logged in successfully!");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
      clearAuthToken();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      clearAuthToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 4. Update ShopContext

Replace `src/contexts/ShopContext.tsx` - Cart/Checkout logic:

```typescript
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi } from "@/integrations/api/client";
import { ShopProduct } from "@/data/products";

interface CartItem extends ShopProduct {
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  favorites: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: ShopProduct) => void;
  toggleFavorite: (product: ShopProduct) => void;
  isFavorite: (id: string) => boolean;
  removeFromCart: (id: string) => void;
  checkout: () => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | null>(null);

const CART_KEY = "motoparts_cart";
const FAVORITES_KEY = "motoparts_favorites";

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load cart and favorites from localStorage
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
    setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: ShopProduct) => {
    if (product.stock <= 0) {
      toast.error("This part is currently out of stock.");
      return;
    }

    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart.`);
  };

  const toggleFavorite = (product: ShopProduct) => {
    setFavorites((items) =>
      items.includes(product.id)
        ? items.filter((id) => id !== product.id)
        : [...items, product.id]
    );
    toast.success(
      favorites.includes(product.id)
        ? "Removed from wishlist."
        : "Saved to wishlist."
    );
  };

  const removeFromCart = (id: string) => {
    setCart((items) => items.filter((item) => item.id !== id));
  };

  const checkout = async () => {
    if (cart.length === 0) return false;

    if (!user) {
      toast.error("Please log in to checkout.");
      return false;
    }

    try {
      // Send order to API
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await ordersApi.create(orderItems);

      // Clear cart on success
      setCart([]);
      toast.success("Payment complete — your order has been placed.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Checkout failed. Please try again."
      );
      return false;
    }
  };

  const value = useMemo(
    () => ({
      cart,
      favorites,
      cartCount,
      cartTotal,
      addToCart,
      toggleFavorite,
      isFavorite: (id: string) => favorites.includes(id),
      removeFromCart,
      checkout,
    }),
    [cart, favorites, cartCount, cartTotal]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
};
```

---

## 5. Update Page Components

### **Login.tsx** Changes:

```typescript
// OLD
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// NEW
const { login } = useAuth();
await login(email, password);
navigate("/");
```

### **Signup.tsx** Changes:

```typescript
// OLD
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { display_name: displayName } },
});

// NEW
const { register } = useAuth();
await register(email, password, displayName);
navigate("/login");
```

### **Shop.tsx** Changes (if fetching products):

```typescript
// OLD
const { data: products } = await supabase
  .from("products")
  .select("*");

// NEW
import { productsApi } from "@/integrations/api/client";
const response = await productsApi.getAll();
const products = response.data;
```

---

## 6. Update Header/Navigation

If Header has logout button:

```typescript
// OLD
await supabase.auth.signOut();

// NEW
const { signOut } = useAuth();
await signOut();
```

---

## 7. Testing Checklist

After migration, test:

- [ ] **Register** - Create new account
- [ ] **Login** - Sign in with credentials
- [ ] **Get Products** - Load product list
- [ ] **Filter Products** - By category, brand, search
- [ ] **Add to Cart** - Add item, verify count updates
- [ ] **Checkout** - Create order (must be logged in)
- [ ] **View Orders** - ShoppingHistory page shows orders
- [ ] **Logout** - Sign out and verify token removed
- [ ] **Token Refresh** - Check localStorage has `auth_token`

**Test with Postman/cURL:**

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'

# Save the token from response

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Get profile (use token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/profile
```

---

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Token missing or expired. Check localStorage `auth_token`. |
| **CORS errors** | Backend CORS misconfigured. Check `FRONTEND_URL` in .env. |
| **"No auth token"** | Register/login first to get token. |
| **Products show undefined** | Parse `fitment` from JSON in API response. |
| **Checkout fails** | Ensure user is logged in before checkout. |

---

## 9. What Was Left Unchanged

These files should NOT change much:
- ✅ Product data structure (`ShopProduct` interface)
- ✅ Components (ProductCard, etc.) - they use context
- ✅ Tailwind CSS & UI components
- ✅ Routing (React Router)

---

## 10. Next Steps

1. **Test thoroughly** with multiple users
2. **Deploy backend** to production server
3. **Update VITE_API_URL** in production frontend `.env`
4. **Add payment processing** (Stripe/PayPal) in order creation
5. **Monitor logs** for API errors

You're all set! 🚀
