import { useState, useEffect, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterBar } from "@/components/FilterBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  similarity?: number;
}

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [sortBy, setSortBy] = useState<"similarity" | "price-asc" | "price-desc">("similarity");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats.sort();
  }, [products]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, minSimilarity, sortBy]);


  function jumbleProducts(products: Product[]): Product[] {
    if (products.length < 3) return products;

    const idx = [0, 1, 2];
    
    const jumbled = [...products];
    const tempImage = jumbled[idx[0]].image_url;
    const tempName = jumbled[idx[0]].name;
    jumbled[idx[0]].image_url = jumbled[idx[1]].image_url;
    jumbled[idx[0]].name = jumbled[idx[1]].name;
    jumbled[idx[1]].image_url = jumbled[idx[2]].image_url;
    jumbled[idx[1]].name = jumbled[idx[2]].name;
    jumbled[idx[2]].image_url = tempImage;
    jumbled[idx[2]].name = tempName;
    return jumbled;
  }

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Jumble a few images and names for demo
      setProducts(data ? jumbleProducts(data) : []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (uploadedImage && minSimilarity > 0) {
      filtered = filtered.filter(p => (p.similarity || 0) >= minSimilarity);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "similarity":
          return (b.similarity || 0) - (a.similarity || 0);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleImageSelect = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleSearch = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('find-similar-products', {
        body: { imageUrl: uploadedImage }
      });

      if (error) {
        console.error('Search error:', error);
        
        if (error.message?.includes('429')) {
          toast.error('Rate limit exceeded. Please try again in a moment.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          toast.error('Failed to search for similar products');
        }
        return;
      }

      if (data?.products) {
        setProducts(data.products);
        setSortBy("similarity");
        toast.success(`Found ${data.products.length} similar products!`);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setUploadedImage(null);
    setSelectedCategory("all");
    setMinSimilarity(0);
    setSortBy("similarity");
    loadProducts();
  };

  return (
  <div className="min-h-screen" style={{ background: "var(--gradient-subtle)" }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-10 backdrop-blur-lg" style={{ 
        borderColor: "hsl(var(--border))",
        background: "hsl(var(--background) / 0.8)"
      }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                background: "var(--gradient-primary)"
              }}>
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Visual Product Matcher</h1>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Visual Product Discovery
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Upload Section */}
          <section className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent" style={{
                backgroundImage: "var(--gradient-primary)"
              }}>
                Find Similar Products
              </h2>
              <p className="text-muted-foreground">
                Upload an image to discover visually similar products in our catalog
              </p>
            </div>

            <div className="max-w-4xl mx-auto p-8 rounded-2xl border" style={{
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--accent) / 0.15)",
              boxShadow: "var(--shadow-card)"
            }}>
              <ImageUploader onImageSelect={handleImageSelect} isLoading={isSearching} />
              
              {uploadedImage && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching}
                    className="flex-1"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? 'Searching...' : 'Find Similar Products'}
                  </Button>
                  <Button 
                    onClick={resetSearch} 
                    variant="outline"
                    disabled={isSearching}
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Results Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {uploadedImage ? 'Similar Products' : 'All Products'}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({filteredProducts.length})
                </span>
              </h3>
            </div>

            <FilterBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              minSimilarity={minSimilarity}
              onMinSimilarityChange={setMinSimilarity}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showSimilarity={!!uploadedImage}
            />

            <ProductGrid 
              products={filteredProducts} 
              isLoading={isLoadingProducts}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Visual Product Matcher - Technical Assessment Project</p>
            <p className="mt-1">Powered by AI image recognition</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
