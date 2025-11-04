import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const handleAddToCart = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
      <div className="relative overflow-hidden">
        {product.discount && (
          <Badge className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground">
            {product.discount}% OFF
          </Badge>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
          onClick={() => navigate(`/product/${product.id}`)}
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3
            className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-baseline gap-2">
            {product.discount ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  ₹{finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
            )}
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            onClick={() => navigate(`/product/${product.id}`)}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
