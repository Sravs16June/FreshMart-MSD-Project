import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingCart, Star, Award, Package, Heart } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/shop")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg"
            />
            {product.discount && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-lg px-3 py-1">
                {product.discount}% OFF
              </Badge>
            )}
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              {product.category}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.rating} rating
                    {product.reviews ? ` • ${product.reviews} reviews` : ""})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              {product.discount ? (
                <>
                  <span className="text-4xl font-bold text-primary">
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  <span className="text-2xl text-muted-foreground line-through">
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              )}
              <span className="text-lg text-muted-foreground">per {product.unit}</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Product Details</h3>
              <div className="grid gap-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-medium">{product.unit}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Availability</span>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Nutritional Information */}
          {product.nutritionalInfo && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Nutritional Info</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories</span>
                    <span className="font-medium">
                      {product.nutritionalInfo.calories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-medium">{product.nutritionalInfo.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-medium">{product.nutritionalInfo.carbs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fat</span>
                    <span className="font-medium">{product.nutritionalInfo.fat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Benefits */}
          {product.benefits && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Health Benefits</h3>
                </div>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Storage Instructions */}
          {product.storageInstructions && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Storage</h3>
                </div>
                <p className="text-muted-foreground">{product.storageInstructions}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" onClick={() => navigate("/shop")}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
