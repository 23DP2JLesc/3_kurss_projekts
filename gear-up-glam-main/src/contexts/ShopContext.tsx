import { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { ordersApi, cartApi } from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShopProduct } from "@/data/products";

interface CartItem extends ShopProduct {
  quantity: number;
  cartItemId?: string; // DB cart item ID
}

interface ShopContextType {
  cart: CartItem[];
  favorites: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: ShopProduct, quantity?: number) => void;
  toggleFavorite: (product: ShopProduct) => void;
  isFavorite: (id: string) => boolean;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  checkout: () => Promise<boolean>;
  syncCart: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | null>(null);

const CART_KEY = "motoparts_cart";
const FAVORITES_KEY = "motoparts_favorites";
const GUEST_HISTORY_KEY = "motoparts_guest_history";

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
    setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
    setIsInitialized(true);
  }, []);

  const syncCart = useCallback(async () => {
    if (!user) return;
    try {
      const response = await cartApi.getCart();
      const items = response?.items || [];
      const dbCart = items.map((item: any) => ({
        ...item.product,
        fitment: Array.isArray(item.product.fitment) ? item.product.fitment : JSON.parse(item.product.fitment || "[]"),
        quantity: item.quantity,
        cartItemId: item.id, // Save cartItemId!
      }));
      setCart(dbCart);
    } catch (err) {
      console.error("Failed to sync cart:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user && isInitialized) {
      syncCart();
    }
  }, [user, isInitialized, syncCart]);

  useEffect(() => {
    if (!user && isInitialized) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, user, isInitialized]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!user && isInitialized) {
      setCart([]);
    }
  }, [user, isInitialized]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = async (product: ShopProduct, quantity: number = 1) => {
    if (product.stock <= 0) {
      toast.error("Šī detaļa pašlaik nav noliktavā.");
      return;
    }

    if (user) {
      try {
        const response = await cartApi.addItem(product.id, quantity);
        // Resync to get cartItemIds
        await syncCart();
        toast.success(`${product.name} ir pievienots grozam.`);
      } catch (err) {
        toast.error("Neizdevās pievienot grozam.");
      }
    } else {
      setCart((items) => {
        const existing = items.find((item) => item.id === product.id);
        if (existing) {
          return items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item,
          );
        }
        return [...items, { ...product, quantity }];
      });
      toast.success(`${product.name} ir pievienots grozam.`);
    }
  };

  const updateCartQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (user) {
      try {
        const item = cart.find((i) => i.id === id);
        if (item?.cartItemId) {
          await cartApi.updateItem(item.cartItemId, quantity);
        }
        setCart((items) =>
          items.map((item) => item.id === id ? { ...item, quantity } : item),
        );
      } catch (err) {
        toast.error("Neizdevās atjaunināt daudzumu.");
      }
    } else {
      setCart((items) =>
        items.map((item) => item.id === id ? { ...item, quantity } : item),
      );
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      try {
        const item = cart.find((i) => i.id === id);
        if (item?.cartItemId) {
          await cartApi.removeItem(item.cartItemId); // Use cartItemId!
        }
        setCart((items) => items.filter((item) => item.id !== id));
      } catch (err) {
        toast.error("Neizdevās noņemt preci.");
      }
    } else {
      setCart((items) => items.filter((item) => item.id !== id));
    }
  };

  const toggleFavorite = (product: ShopProduct) => {
    setFavorites((items) =>
      items.includes(product.id)
        ? items.filter((id) => id !== product.id)
        : [...items, product.id],
    );
    toast.success(favorites.includes(product.id) ? "Noņemts no vēlmju saraksta." : "Pievienots vēlmju sarakstam.");
  };

  const checkout = async () => {
    if (cart.length === 0) return false;

    if (!user) {
      const currentHistory = JSON.parse(localStorage.getItem(GUEST_HISTORY_KEY) || "[]");
      const purchasedItems = cart.map((item) => ({
        id: crypto.randomUUID(),
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
        purchased_at: new Date().toISOString(),
      }));
      localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify([...purchasedItems, ...currentHistory]));
      setCart([]);
      toast.success("Apmaksa pabeigta — tavs produkts ir iegādāts.");
      return true;
    }

    try {
      await ordersApi.create(
        cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      );
      await cartApi.clearCart();
    } catch (err) {
      toast.error("Norēķini neizdevās. Lūdzu, mēģini vēlreiz.");
      return false;
    }

    setCart([]);
    toast.success("Apmaksa pabeigta — tavs produkts ir iegādāts.");
    return true;
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
      updateCartQuantity,
      checkout,
      syncCart,
    }),
    [cart, favorites, cartCount, cartTotal, user],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
};