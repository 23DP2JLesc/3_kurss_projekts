import { useState, useEffect, useMemo } from "react";
import { Search, X, Clock, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import ProductCard from "./ProductCard";
import { useSearchParams } from "react-router-dom";
import { useProducts, resolveImage } from "@/hooks/useProducts";
import { categoriesApi } from "@/integrations/api/client";

const SEARCH_HISTORY_KEY = "motoparts_search_history";
const MAX_HISTORY = 5;

const SearchFilter = ({ onProductSelect }: { onProductSelect?: (p: any) => void }) => {
  const [searchParams] = useSearchParams();
  const { products: dbProducts } = useProducts();

  // All useState FIRST
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [bikeBrand, setBikeBrand] = useState("all");
  const [bikeModel, setBikeModel] = useState("all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(2500);

  // All useMemo AFTER useState
  const products = useMemo(
    () =>
      dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        model: p.model,
        type: p.type,
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        image: resolveImage(p.image),
        stock: p.stock,
        fitment: p.fitment,
        description: p.description,
      })),
    [dbProducts],
  );

  const bikeBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) =>
      p.fitment.forEach((f) => {
        const brand = f.split(" ")[0];
        if (brand) set.add(brand);
      })
    );
    return Array.from(set).sort();
  }, [products]);

  const bikeModels = useMemo(() => {
    if (bikeBrand === "all") return [];
    const set = new Set<string>();
    products.forEach((p) =>
      p.fitment.forEach((f) => {
        if (f.toLowerCase().startsWith(bikeBrand.toLowerCase())) {
          const modelName = f.split(" ").slice(1).join(" ");
          if (modelName) set.add(modelName);
        }
      })
    );
    return Array.from(set).sort();
  }, [products, bikeBrand]);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    categoriesApi.getAll().then((data: any) => {
      const cats = Array.isArray(data) ? data : data.data || [];
      setCategories(cats.map((c: any) => c.name));
    }).catch(() => {});
  }, []);

const productTypes = categories.length > 0 ? categories : Array.from(new Set(products.map((p) => p.type))).sort();

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.model.toLowerCase().includes(term) ||
        product.type.toLowerCase().includes(term);

      const matchesBikeBrand =
        bikeBrand === "all" ||
        product.fitment.some((f) =>
          f.toLowerCase().startsWith(bikeBrand.toLowerCase())
        );

      const matchesBikeModel =
        bikeModel === "all" ||
        product.fitment.some((f) => f.split(" ").slice(1).join(" ") === bikeModel);

      return (
        matchesSearch &&
        matchesBikeBrand &&
        matchesBikeModel &&
        (type === "all" || product.type === type) &&
        (availability === "all" ||
          (availability === "in-stock" ? product.stock > 0 : product.stock === 0)) &&
        product.price <= maxPrice
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "brand") return a.brand.localeCompare(b.brand);
      return String(a.id).localeCompare(String(b.id));
    });
  }, [searchTerm, bikeBrand, bikeModel, type, availability, maxPrice, sort, products]);

  // useEffect AFTER useMemo
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
      }
    }
  }, []);

  useEffect(() => {
    setType(searchParams.get("type") || "all");
  }, [searchParams]);

  useEffect(() => {
    setBikeModel("all");
  }, [bikeBrand]);

  const saveToHistory = (term: string) => {
    if (!term.trim()) return;
    const newHistory = [
      term,
      ...searchHistory.filter((h) => h.toLowerCase() !== term.toLowerCase()),
    ].slice(0, MAX_HISTORY);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setBikeBrand("all");
    setBikeModel("all");
    setType("all");
    setAvailability("all");
    setSort("featured");
    setMaxPrice(2500);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchBlur = () => {
    if (searchTerm.trim()) saveToHistory(searchTerm.trim());
    setTimeout(() => setShowHistory(false), 200);
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return (
    <section id="search" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-wider text-sm font-medium">
            Atrodi, kas tev nepieciešams
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">Meklēt produktus</h2>
        </div>

        {/* Search Input */}
        <div className="max-w-5xl mx-auto mb-8 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Meklēt pēc nosaukuma vai kategorijas..."
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setShowHistory(true)}
              onBlur={handleSearchBlur}
              className="w-full pl-12 pr-12 py-6 bg-card border-border focus:border-primary text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {showHistory && searchHistory.length > 0 && !searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Nesenie meklējumi
                </span>
                <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Notīrīt visu
                </button>
              </div>
              <ul>
                {searchHistory.map((term, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleHistoryClick(term)}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" /> {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-10 grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-5">
          <div className="md:col-span-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <SlidersHorizontal className="h-4 w-4" /> Veikala filtri
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Atiestatīt
            </Button>
          </div>

          <Select value={bikeBrand} onValueChange={setBikeBrand}>
            <SelectTrigger><SelectValue placeholder="Motocikla marka" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visas motociklu markas</SelectItem>
              {bikeBrands.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bikeModel} onValueChange={setBikeModel} disabled={bikeBrand === "all"}>
            <SelectTrigger>
              <SelectValue placeholder={bikeBrand === "all" ? "Vispirms izvēlies marku" : "Visi modeļi"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visi modeļi</SelectItem>
              {bikeModels.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Veids" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visi veidi</SelectItem>
              {productTypes.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger><SelectValue placeholder="Krājums" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Viss krājums</SelectItem>
              <SelectItem value="in-stock">Noliktavā</SelectItem>
              <SelectItem value="out-stock">Nav noliktavā</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue placeholder="Kārtot" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Ieteiktie</SelectItem>
              <SelectItem value="price-low">Cena augoši</SelectItem>
              <SelectItem value="price-high">Cena dilstoši</SelectItem>
              <SelectItem value="brand">Marka A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="md:col-span-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <Slider value={[maxPrice]} min={100} max={2500} step={50} onValueChange={([value]) => setMaxPrice(value)} />
            <span className="text-sm text-muted-foreground">Maks. ${maxPrice}</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            {searchTerm ? (
              <>Atrasts <span className="text-primary font-semibold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "produkts" : "produkti"} atbilstoši "{searchTerm}"</>
            ) : (
              <>Parādīti <span className="text-primary font-semibold">{filteredProducts.length}</span> no {products.length} produktiem</>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard {...product} onProductSelect={onProductSelect} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-2xl font-display text-muted-foreground mb-2">Produkti nav atrasti</p>
            <p className="text-muted-foreground">Mēģini pielāgot meklēšanas terminus vai pārlūkot kategorijas.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchFilter;