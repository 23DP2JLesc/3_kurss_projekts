import { useState } from "react";
import Header from "@/components/Header";
import SearchFilter from "@/components/SearchFilter";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <SearchFilter onProductSelect={setSelectedProduct} />
      </main>
      <Footer />
      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Shop;