import exhaustImage from "@/assets/product-exhaust.jpg";
import brakesImage from "@/assets/product-brakes.jpg";
import suspensionImage from "@/assets/product-suspension.jpg";
import fairingsImage from "@/assets/product-fairings.jpg";

export interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  fitment: string[];
  description: string;
}

export const products: ShopProduct[] = [
  {
    id: "seed-1",
    name: "Titanium Racing Exhaust System",
    brand: "Akrapovič",
    model: "ZX-10R",
    type: "Exhaust",
    category: "Exhaust",
    price: 1299.99,
    originalPrice: 1599.99,
    image: exhaustImage,
    stock: 7,
    fitment: ["Kawasaki ZX-10R", "BMW S1000RR"],
    description: "Lightweight titanium race exhaust tuned for sharper throttle response, lower weight, and track-ready sound.",
  },
  {
    id: "seed-2",
    name: "Brembo Racing Brake Kit",
    brand: "Brembo",
    model: "Panigale V4",
    type: "Brakes",
    category: "Brakes",
    price: 849.99,
    image: brakesImage,
    stock: 11,
    fitment: ["Ducati Panigale V4", "Yamaha R1"],
    description: "High-bite caliper and rotor kit built for consistent stopping power under heavy race braking.",
  },
  {
    id: "seed-3",
    name: "Öhlins TTX GP Suspension Fork",
    brand: "Öhlins",
    model: "S1000RR",
    type: "Suspension",
    category: "Suspension",
    price: 2199.99,
    originalPrice: 2499.99,
    image: suspensionImage,
    stock: 4,
    fitment: ["BMW S1000RR", "Kawasaki ZX-10R"],
    description: "Fully adjustable cartridge suspension with GP-derived damping control for precise front-end feedback.",
  },
  {
    id: "seed-4",
    name: "Carbon Fiber Race Fairings",
    brand: "Ilmberger",
    model: "R1",
    type: "Bodywork",
    category: "Bodywork",
    price: 1899.99,
    image: fairingsImage,
    stock: 5,
    fitment: ["Yamaha R1", "Ducati Panigale V4"],
    description: "Pre-drilled carbon fairing set with race geometry, heat shielding, and fast service access.",
  },
  {
    id: "seed-5",
    name: "Performance Air Filter",
    brand: "Sprint Filter",
    model: "RSV4",
    type: "Engine",
    category: "Engine",
    price: 149.99,
    image: exhaustImage,
    stock: 18,
    fitment: ["Aprilia RSV4", "BMW S1000RR"],
    description: "Washable high-flow air filter that improves intake breathing while protecting the engine on road and track.",
  },
  {
    id: "seed-6",
    name: "LED Headlight Kit",
    brand: "Rizoma",
    model: "MT-10",
    type: "Lighting",
    category: "Lighting",
    price: 299.99,
    originalPrice: 349.99,
    image: brakesImage,
    stock: 0,
    fitment: ["Yamaha MT-10", "Kawasaki Z900"],
    description: "Compact LED conversion kit with sharper night visibility and plug-ready fitment for street builds.",
  },
];

export const productBrands = Array.from(new Set(products.map((product) => product.brand))).sort();
export const productModels = Array.from(new Set(products.map((product) => product.model))).sort();
export const productTypes = Array.from(new Set(products.map((product) => product.type))).sort();
