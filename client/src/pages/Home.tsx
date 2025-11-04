import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield, Sparkles, Gift, Tag } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import heroBg from "@/assets/hero-bg.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const categories = ["Vegetables", "Fruits", "Bakery", "Dairy"];
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[500px] sm:h-[600px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Fresh, Organic <br />
              <span className="text-primary">Groceries Delivered</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl">
              Premium quality organic produce delivered to your doorstep. Farm-fresh,
              sustainable, and delicious.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/shop")} className="text-base">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/shop")} className="text-base">
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-border/40 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Organic</h3>
              <p className="text-muted-foreground">
                All our products are certified organic and sourced from local farms
              </p>
            </Card>
            <Card className="text-center p-8 border-border/40 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Same-day delivery available. Get your groceries when you need them
              </p>
            </Card>
            <Card className="text-center p-8 border-border/40 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                100% satisfaction guarantee or your money back, no questions asked
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <Sparkles className="inline-block h-8 w-8 mr-2 text-primary" />
              Special Offers
            </h2>
            <p className="text-muted-foreground">Limited time deals you don't want to miss!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-all hover:shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="font-semibold">Festival Special</Badge>
                </div>
                <CardTitle className="text-2xl">Diwali Dhamaka</CardTitle>
              </CardHeader>
              <div className="p-6">
                <p className="text-3xl font-bold text-primary mb-2">Up to 40% OFF</p>
                <p className="text-muted-foreground mb-4">On all sweets, dry fruits & festive items</p>
                <Button onClick={() => navigate("/shop")} className="w-full">Shop Now</Button>
              </div>
            </Card>
            <Card className="overflow-hidden border-2 border-orange-500/30 hover:border-orange-500/60 transition-all hover:shadow-xl">
              <CardHeader className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-5 w-5 text-orange-500" />
                  <Badge className="font-semibold bg-orange-500">Super Saver</Badge>
                </div>
                <CardTitle className="text-2xl">Weekend Deal</CardTitle>
              </CardHeader>
              <div className="p-6">
                <p className="text-3xl font-bold text-orange-500 mb-2">Buy 2 Get 1</p>
                <p className="text-muted-foreground mb-4">Free on all vegetables & fruits</p>
                <Button onClick={() => navigate("/shop")} variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">Grab Offer</Button>
              </div>
            </Card>
            <Card className="overflow-hidden border-2 border-green-500/30 hover:border-green-500/60 transition-all hover:shadow-xl">
              <CardHeader className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  <Badge className="font-semibold bg-green-500">Fresh Deal</Badge>
                </div>
                <CardTitle className="text-2xl">First Order</CardTitle>
              </CardHeader>
              <div className="p-6">
                <p className="text-3xl font-bold text-green-500 mb-2">₹200 OFF</p>
                <p className="text-muted-foreground mb-4">On orders above ₹999</p>
                <Button onClick={() => navigate("/shop")} variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white">Start Shopping</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="lg"
                onClick={() => navigate(`/shop?category=${category}`)}
                className="text-base font-medium"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Featured Products</h2>
            <Button
              variant="ghost"
              onClick={() => navigate("/shop")}
              className="text-base font-medium"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
