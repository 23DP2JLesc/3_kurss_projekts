import ProductCard from "./ProductCard";
import { useProducts, resolveImage } from "@/hooks/useProducts";

const FeaturedProducts = () => {
  const { products } = useProducts();
  return (
    <section id="products" className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary uppercase tracking-wider text-sm font-medium">
              Featured Collection
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Top Sellers</h2>
          </div>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            View All Products
            <span className="text-primary">→</span>
          </a>
        </div>

        {/* Glow Line */}
        <div className="glow-line mb-12" />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={resolveImage(product.image)}
              name={product.name}
              brand={product.brand}
              model={product.model}
              type={product.type}
              category={product.category}
              price={Number(product.price)}
              originalPrice={product.original_price ? Number(product.original_price) : undefined}
              stock={product.stock}
              fitment={product.fitment}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
