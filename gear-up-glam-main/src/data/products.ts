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
    name: "Titāna sacīkšu izplūde",
    brand: "Akrapovič",
    model: "ZX-10R",
    type: "Izplūde",
    category: "Izplūde",
    price: 1299.99,
    originalPrice: 1599.99,
    image: exhaustImage,
    stock: 7,
    fitment: ["Kawasaki ZX-10R", "BMW S1000RR"],
    description: "Viegls titāna izpūtējs, kas nodrošina ātrāku gāzes reakciju, mazāku svaru un sacīkšu skaņu.",
  },
  {
    id: "seed-2",
    name: "Brembo sacīkšu bremžu komplekts",
    brand: "Brembo",
    model: "Panigale V4",
    type: "Bremzes",
    category: "Bremzes",
    price: 849.99,
    image: brakesImage,
    stock: 11,
    fitment: ["Ducati Panigale V4", "Yamaha R1"],
    description: "Augstas saķeres bremžu komplekts ar stabilu apstāšanās jaudu smagas sacīkšu bremzēšanas laikā.",
  },
  {
    id: "seed-3",
    name: "Öhlins TTX GP piekare",
    brand: "Öhlins",
    model: "S1000RR",
    type: "Piekare",
    category: "Piekare",
    price: 2199.99,
    originalPrice: 2499.99,
    image: suspensionImage,
    stock: 4,
    fitment: ["BMW S1000RR", "Kawasaki ZX-10R"],
    description: "Pilnībā regulējama kartridža piekare ar sacīkšu amortizācijas kontrolei precīzai priekšējās daļas atsauksmei.",
  },
  {
    id: "seed-4",
    name: "Oglekļa šķiedras sacīkšu virsbūve",
    brand: "Ilmberger",
    model: "R1",
    type: "Virssēde",
    category: "Virssēde",
    price: 1899.99,
    image: fairingsImage,
    stock: 5,
    fitment: ["Yamaha R1", "Ducati Panigale V4"],
    description: "Iepriekš urbta oglekļa šķiedras virsbūve ar sacīkšu ģeometriju, siltuma aizsardzību un ātru piekļuvi servisiem.",
  },
  {
    id: "seed-5",
    name: "Veiktspējas gaisa filtrs",
    brand: "Sprint Filter",
    model: "RSV4",
    type: "Dzinējs",
    category: "Dzinējs",
    price: 149.99,
    image: exhaustImage,
    stock: 18,
    fitment: ["Aprilia RSV4", "BMW S1000RR"],
    description: "Mazgājams gaisa filtrs ar lielu plūsmu, kas uzlabo ieplūdes elpošanu un aizsargā dzinēju uz ceļa un trasē.",
  },
  {
    id: "seed-6",
    name: "LED lukturu komplekts",
    brand: "Rizoma",
    model: "MT-10",
    type: "Apgaismojums",
    category: "Apgaismojums",
    price: 299.99,
    originalPrice: 349.99,
    image: brakesImage,
    stock: 0,
    fitment: ["Yamaha MT-10", "Kawasaki Z900"],
    description: "Kompakts LED komplekts ar asāku nakts redzamību un gatavu pieslēgumu ielas motocikliem.",
  },
];

export const productBrands = Array.from(new Set(products.map((product) => product.brand))).sort();
export const productModels = Array.from(new Set(products.map((product) => product.model))).sort();
export const productTypes = Array.from(new Set(products.map((product) => product.type))).sort();
