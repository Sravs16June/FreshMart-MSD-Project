import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Home, Store, ChefHat, User, Package, LogIn, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/shop", icon: Store, label: "Shop" },
    { path: "/recipes", icon: ChefHat, label: "Recipes" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/cart", icon: ShoppingCart, label: "Cart" },
  ];

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Package className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">FreshMart</span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isCart = item.path === "/cart";
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all font-medium ${
                    isActive
                      ? isCart 
                        ? "bg-[#FF7A59] hover:bg-[#FF6B47] text-white"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">{item.label}</span>
                  {isCart && cartItemCount > 0 && (
                    <Badge variant={isActive ? "secondary" : "default"} className="ml-1 min-w-[20px] h-5 flex items-center justify-center">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
            
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="gap-2 ml-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2 ml-2">
                  <LogIn className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
