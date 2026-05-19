import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  payment: { status: string; method: string } | null;
  items: OrderItem[];
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "completed") return (
    <span className="flex items-center gap-1 text-green-500 text-sm font-semibold">
      <CheckCircle className="h-4 w-4" /> Pabeigts
    </span>
  );
  if (status === "pending") return (
    <span className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
      <Clock className="h-4 w-4" /> Gaida
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-destructive text-sm font-semibold">
      <XCircle className="h-4 w-4" /> Atcelts
    </span>
  );
};

const ShoppingHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [guestHistory, setGuestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      setGuestHistory(JSON.parse(localStorage.getItem("motoparts_guest_history") || "[]"));
      setLoading(false);
    } else if (user) {
      fetchHistory();
    }
  }, [user, authLoading]);

  const fetchHistory = async () => {
    try {
      const response = await ordersApi.getAll();
      const rawOrders = Array.isArray(response) ? response : response.data || [];

      const parsed: Order[] = rawOrders.map((order: any) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        payment: order.payment || null,
        items: order.items.map((item: any) => ({
          id: item.id,
          product_name: item.product.name,
          product_image: item.product.image,
          price: item.price,
          quantity: item.quantity,
        })),
      }));

      setOrders(parsed);
    } catch (error) {
      console.error("Neizdevās ielādēt vēsturi:", error);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Ielādē...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-display text-3xl md:text-4xl">Iepirkumu vēsture</h1>
          </div>

          {/* Logged in user */}
          {user && (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-xl">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="font-display text-2xl mb-2">Vēl nav pirkumu</h2>
                  <p className="text-muted-foreground mb-6">Sāc iepirkties, lai redzētu savu pasūtījumu vēsturi šeit.</p>
                  <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Pārlūkot produktus
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
                      {/* Order Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Pasūtījuma ID</p>
                          <p className="font-mono text-sm">{order.id.slice(0, 16)}...</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Datums</p>
                          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Apmaksa</p>
                          <StatusBadge status={order.payment?.status || order.status} />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Kopā</p>
                          <p className="text-primary font-display text-lg">${order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="divide-y divide-border">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                            {item.product_image ? (
                              <img src={item.product_image} alt={item.product_name} className="w-16 h-16 rounded-lg object-cover" />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{item.product_name}</h3>
                              <p className="text-sm text-muted-foreground">Daudzums: {item.quantity}</p>
                            </div>
                            <span className="text-primary font-display">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Guest user */}
          {!user && (
            <>
              {guestHistory.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-xl">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="font-display text-2xl mb-2">Vēl nav pirkumu</h2>
                  <p className="text-muted-foreground mb-6">Sāc iepirkties, lai redzētu savu pasūtījumu vēsturi šeit.</p>
                  <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Pārlūkot produktus
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {guestHistory.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.product_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Daudzums: {item.quantity} · {new Date(item.purchased_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-primary font-display text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingHistory;