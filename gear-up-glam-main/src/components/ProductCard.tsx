import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  brand?: string;
  model?: string;
  type?: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  fitment?: string[];
  description?: string;
  onProductSelect?: (p: any) => void;
}

const ProductCard = (product: ProductCardProps) => {
  const { id, image, name, brand, model, type, category, price, originalPrice, stock = 1, fitment = [], description, onProductSelect } = product;
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const shopProduct = { id, image, name, brand: brand || category, model: model || "Universal", type: type || category, category, price, originalPrice, stock, fitment, description: description || "" };

  return (
    <div className="card-racing group overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
            -{discount}%
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => toggleFavorite(shopProduct)} className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
            <Heart className={`h-4 w-4 ${isFavorite(id) ? "fill-primary text-primary" : ""}`} />
          </button>
          <button
            onClick={() => onProductSelect?.(shopProduct)}
            className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={() => addToCart(shopProduct)} disabled={stock <= 0} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            <ShoppingCart className="h-4 w-4" />
            {stock > 0 ? "Pievienot grozam" : "Nav noliktavā"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs text-primary uppercase tracking-wider font-medium">
          {brand ? `${brand} · ${model}` : category}
        </span>
        <h3 className="font-display text-lg mt-1 line-clamp-1">{name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Learn More Button */}
        <button
          onClick={() => onProductSelect?.(shopProduct)}
          className="w-full mt-4 py-2 px-4 border border-primary text-primary font-semibold rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default ProductCard;