import { useEffect, useState, useCallback } from "react";
import { productsApi } from "@/integrations/api/client";
import exhaustImage from "@/assets/product-exhaust.jpg";
import brakesImage from "@/assets/product-brakes.jpg";
import suspensionImage from "@/assets/product-suspension.jpg";
import fairingsImage from "@/assets/product-fairings.jpg";
import chainImage from "@/assets/product-chain.jpg";
import handlebarsImage from "@/assets/product-handlebars.jpg";
import tiresImage from "@/assets/product-tires.jpg";
import ecuImage from "@/assets/product-ecu.jpg";

export interface DBProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  category: string;
  price: number;
  original_price: number | null;
  image: string;
  stock: number;
  fitment: string[];
  description: string;
}

const imageMap: Record<string, string> = {
  "/src/assets/product-exhaust.jpg": exhaustImage,
  "/src/assets/product-brakes.jpg": brakesImage,
  "/src/assets/product-suspension.jpg": suspensionImage,
  "/src/assets/product-fairings.jpg": fairingsImage,
  "/src/assets/product-chain.jpg": chainImage,
  "/src/assets/product-handlebars.jpg": handlebarsImage,
  "/src/assets/product-tires.jpg": tiresImage,
  "/src/assets/product-ecu.jpg": ecuImage,
};

export const resolveImage = (img: string) => imageMap[img] || img;

export const useProducts = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, refetch };
};
