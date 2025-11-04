import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { products as localProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Camera, Mic, MicOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseEnabled } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import type { Product as LocalProduct } from "@/data/products";

const Shop = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [isListening, setIsListening] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Set category from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setCategoryFilter(category);
    }
  }, [searchParams]);

  // Voice search setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        toast({
          title: "Voice search",
          description: `Searching for: ${transcript}`,
        });
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        toast({
          title: "Error",
          description: "Voice recognition failed. Please try again.",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not supported",
        description: "Voice search is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak the product you want to search for",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupabaseEnabled) {
      toast({
        title: "Feature unavailable",
        description: "Visual search requires Supabase to be configured.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing image...",
      description: "Analyzing product image with AI",
    });

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // Call AI to analyze the image
        const { data, error } = await supabase.functions.invoke('analyze-product-image', {
          body: { image: base64Image }
        });

        if (error) throw error;

        if (data?.productName) {
          setSearchTerm(data.productName);
          setIsVisualSearchOpen(false);
          toast({
            title: "Visual search complete!",
            description: `Found products matching: ${data.productName}`,
          });
        } else {
          throw new Error("Could not identify product");
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze image",
        variant: "destructive",
      });
      setIsVisualSearchOpen(false);
    }
  };

  const { data: apiProducts, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 60_000,
  });

  // Map API products (server schema) to local Product shape expected by UI
  const mapApiToLocal = (p: any): LocalProduct => ({
    id: p._id || p.id || String(p.name),
    name: p.name,
    description: p.description || "",
    price: Number(p.price) || 0,
    unit: p.unit || "kg",
    category: p.category || "General",
    image: p.imageUrl || "/placeholder.svg",
    inStock: typeof p.inStock === "boolean" ? p.inStock : true,
    discount: p.discount ?? undefined,
  });

  const sourceProducts: LocalProduct[] = Array.isArray(apiProducts) && apiProducts.length > 0
    ? apiProducts.map((product) => ({ ...product, ...mapApiToLocal(product) }))
    : localProducts;

  const categories = ["All", ...Array.from(new Set(sourceProducts.map((p) => p.category)))];

  let filteredProducts = sourceProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  if (sortBy === "Name") {
    filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "Price: Low to High") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "Price: High to Low") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shop All Products</h1>
        <p className="text-muted-foreground mb-8">Discover our full range of fresh, organic groceries</p>

        {isLoading && (
          <div className="text-sm text-muted-foreground mb-4">Loading products from server...</div>
        )}
        {isError && (
          <div className="text-sm text-muted-foreground mb-4">Using local demo products (API unavailable)</div>
        )}

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products or use voice/camera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-24"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceSearch}
                className={`h-8 w-8 p-0 ${isListening ? 'text-red-500 animate-pulse' : ''}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisualSearchOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Name">Name</SelectItem>
                <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
                <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">Showing {filteredProducts.length} products</p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}

        {/* Visual Search Modal */}
        {isVisualSearchOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border rounded-lg p-6 max-w-md w-full relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setIsVisualSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-bold mb-4">Visual Product Search</h3>
              <p className="text-muted-foreground mb-6">Upload or take a photo of the product you're looking for</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.removeAttribute('capture');
                      input.click();
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
