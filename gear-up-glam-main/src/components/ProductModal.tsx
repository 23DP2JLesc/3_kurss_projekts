import { X, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { reviewsApi } from "@/integrations/api/client";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    id: string;
    brand: string;
    model: string;
    type: string;
    stock: number;
    fitment: string[];
    description: string;
  } | null;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    if (!product) return;
    try {
      const data = await reviewsApi.getAll(product.id);
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    }
  };

  const submitReview = async () => {
    if (!product || !newComment.trim()) return;
    setSubmitting(true);
    try {
      await reviewsApi.create(product.id, { rating: newRating, comment: newComment.trim() });
      setNewComment("");
      setNewRating(5);
      fetchReviews();
    } catch (e: any) {
      alert(e.message);
    }
    setSubmitting(false);
  };

  const deleteReview = async (reviewId: string) => {
    if (!product) return;
    await reviewsApi.delete(product.id, reviewId);
    fetchReviews();
  };

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (!isOpen || !product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative aspect-square bg-secondary overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded">
                  -{discount}% ATLAIDE
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-8 flex flex-col">
              <span className="text-primary uppercase tracking-wider text-sm font-medium">
                {product.brand} · {product.model} · {product.type}
              </span>
              <h2 className="font-display text-3xl mt-2">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({reviews.length} atsauksmes)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.fitment.map((fit) => (
                  <span key={fit} className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-muted-foreground">
                    {fit}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 py-4 border-t border-b border-border">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Bezmaksas piegāde</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">2 gadu garantija</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">30 dienu atgriešana</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 btn-racing" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock > 0 ? "Pievienot grozam" : "Nav noliktavā"}
                </Button>
                <Button variant="outline" size="icon" className="border-border hover:border-primary" onClick={() => toggleFavorite(product)}>
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {product.stock > 0 ? `${product.stock} noliktavā - nosūtīsim 24 stundu laikā` : "Pašlaik nav noliktavā"}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="p-8 border-t border-border">
            <h3 className="font-display text-2xl mb-6">Klientu atsauksmes</h3>

            {/* Add Review */}
            {user ? (
              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="font-semibold mb-3">Atstāt atsauksmi</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        star <= (hoverRating || newRating) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary"
                  rows={3}
                  placeholder="Dalies ar savu pieredzi par šo produktu..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button className="mt-2 gap-2" onClick={submitReview} disabled={submitting || !newComment.trim()}>
                  <Send className="h-4 w-4" />
                  {submitting ? "Iesniedz..." : "Iesniegt atsauksmi"}
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground mb-6">Lūdzu, pieslēdzies, lai atstātu atsauksmi.</p>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Vēl nav atsauksmes. Esi pirmais!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{r.user.displayName}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-3 w-3 ${star <= r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                        {(user?.id === r.user.id || user?.role?.toLowerCase() === "admin") && (
                          <button onClick={() => deleteReview(r.id)} className="text-xs text-destructive hover:underline">
                            Dzēst
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;