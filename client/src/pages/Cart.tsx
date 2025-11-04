import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const generateId = () => {
  const g: any = (globalThis as any);
  if (g && g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID();
    }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    pinCode: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    address: "",
    city: "",
    pinCode: "",
    phone: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    setUser(saved ? JSON.parse(saved) : null);
    const handler = () => {
      const s = localStorage.getItem('user');
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  const validateForm = () => {
    const errors = {
      fullName: "",
      address: "",
      city: "",
      pinCode: "",
      phone: "",
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = "Name should contain only letters";
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (formData.address.trim().length < 10) {
      errors.address = "Address should be at least 10 characters";
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city)) {
      errors.city = "City should contain only letters";
      isValid = false;
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = "PIN code is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      errors.pinCode = "PIN code must be 6 digits";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }

    try {
      // Save order locally for demo
      const order = {
        id: generateId(),
        user_id: user.id,
        full_name: formData.fullName,
        address: formData.address,
        city: formData.city,
        pin_code: formData.pinCode,
        phone: formData.phone,
        items: JSON.parse(JSON.stringify(cartItems)),
        total,
        status: "placed",
        created_at: new Date().toISOString(),
      };
      const raw = localStorage.getItem('ls_orders');
      const orders = raw ? JSON.parse(raw) : [];
      orders.push(order);
      localStorage.setItem('ls_orders', JSON.stringify(orders));

      toast.success("Order placed successfully!");
      clearCart();
      setIsCheckoutOpen(false);
      setFormData({
        fullName: "",
        address: "",
        city: "",
        pinCode: "",
        phone: "",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  const handleCancelOrder = () => {
    setShowCancelDialog(false);
    setIsCheckoutOpen(false);
    setFormData({
      fullName: "",
      address: "",
      city: "",
      pinCode: "",
      phone: "",
    });
    setFormErrors({
      fullName: "",
      address: "",
      city: "",
      pinCode: "",
      phone: "",
    });
    toast.info("Checkout cancelled");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>
          <Button onClick={() => navigate("/shop")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        ₹{item.price} per {item.unit}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium text-primary">FREE</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Checkout</DialogTitle>
                      <DialogDescription>
                        Enter your delivery details to complete your order
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            setFormErrors({ ...formErrors, fullName: "" });
                          }}
                          className={formErrors.fullName ? "border-destructive" : ""}
                        />
                        {formErrors.fullName && (
                          <p className="text-sm text-destructive">{formErrors.fullName}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number * (10 digits)</Label>
                        <Input
                          id="phone"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setFormData({ ...formData, phone: value });
                            setFormErrors({ ...formErrors, phone: "" });
                          }}
                          className={formErrors.phone ? "border-destructive" : ""}
                          maxLength={10}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-destructive">{formErrors.phone}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street, Area"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({ ...formData, address: e.target.value });
                            setFormErrors({ ...formErrors, address: "" });
                          }}
                          className={formErrors.address ? "border-destructive" : ""}
                        />
                        {formErrors.address && (
                          <p className="text-sm text-destructive">{formErrors.address}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={(e) => {
                              setFormData({ ...formData, city: e.target.value });
                              setFormErrors({ ...formErrors, city: "" });
                            }}
                            className={formErrors.city ? "border-destructive" : ""}
                          />
                          {formErrors.city && (
                            <p className="text-sm text-destructive">{formErrors.city}</p>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="pinCode">PIN Code * (6 digits)</Label>
                          <Input
                            id="pinCode"
                            placeholder="400001"
                            value={formData.pinCode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setFormData({ ...formData, pinCode: value });
                              setFormErrors({ ...formErrors, pinCode: "" });
                            }}
                            className={formErrors.pinCode ? "border-destructive" : ""}
                            maxLength={6}
                          />
                          {formErrors.pinCode && (
                            <p className="text-sm text-destructive">{formErrors.pinCode}</p>
                          )}
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Subtotal</span>
                          <span className="font-medium">₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Delivery</span>
                          <span className="font-medium text-green-600">FREE</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-2xl font-bold text-primary">
                              ₹{total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handlePlaceOrder} className="flex-1" size="lg">
                        Place Order
                      </Button>
                      <Button
                        onClick={() => setShowCancelDialog(true)}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this order? All entered information
                        will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Checkout</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelOrder}>
                        Yes, Cancel Order
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
