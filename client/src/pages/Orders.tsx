import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowLeft, MapPinned, ChevronDown, ChevronUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  user_id: string;
  full_name: string;
  address: string;
  city: string;
  pin_code: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('user');
    setUser(saved ? JSON.parse(saved) : null);
    const raw = localStorage.getItem('ls_orders');
    const all: Order[] = raw ? JSON.parse(raw) : [];
    setOrders(all);
  }, []);

  const myOrders = useMemo(() => {
    if (!user) return [] as Order[];
    return orders
      .filter(o => o.user_id === user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, user]);

  const getStage = (created_at: string) => {
    const elapsedMs = Date.now() - new Date(created_at).getTime();
    const h = elapsedMs / 36e5;
    if (h < 0.5) return 0; // Placed
    if (h < 2) return 1;   // Packed
    if (h < 6) return 2;   // Out for delivery
    return 3;              // Delivered
  };

  const stageLabels = ["Placed", "Packed", "Out for delivery", "Delivered"];

  const canCancel = (order: Order) => {
    // allow cancel if not already cancelled and not delivered
    const delivered = getStage(order.created_at) >= 3;
    return order.status !== "cancelled" && !delivered;
  };

  const cancelOrder = (orderId: string) => {
    const raw = localStorage.getItem('ls_orders');
    const all: Order[] = raw ? JSON.parse(raw) : [];
    const updated = all.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o);
    localStorage.setItem('ls_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Sign in to view orders</h2>
          <p className="text-muted-foreground mb-6">Your placed orders will appear here once you sign in.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}> 
              <ArrowLeft className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  if (myOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Place your first order and it will show up here.</p>
          <Button onClick={() => navigate("/shop")}>
            <ArrowLeft className="mr-2 h-4 w-4 rotate-180" /> Go to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {myOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Order ID</div>
                    <div className="font-mono text-sm">{order.id}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="uppercase">{order.status}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                    <div className="text-xl font-bold">₹{order.total.toFixed(2)}</div>
                    {canCancel(order) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Cancel Order</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will mark the order as cancelled. You can place a new order anytime.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Order</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cancelOrder(order.id)}>Cancel Order</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="font-semibold mb-2">Delivery Details</div>
                    <div className="text-sm">
                      <div>{order.full_name}</div>
                      <div>{order.address}</div>
                      <div>{order.city} - {order.pin_code}</div>
                      <div>Phone: {order.phone}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-2">Items</div>
                    <div className="space-y-2">
                      {order.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-3">
                          <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover bg-secondary/20" />
                          <div className="flex-1">
                            <div className="font-medium">{it.name}</div>
                            <div className="text-xs text-muted-foreground">{it.quantity} × ₹{it.price} / {it.unit}</div>
                          </div>
                          <div className="font-medium">₹{(it.price * it.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    disabled={order.status === 'cancelled' || getStage(order.created_at) >= 3}
                    onClick={() => setExpanded((e) => ({ ...e, [order.id]: !e[order.id] }))}
                  >
                    <MapPinned className="mr-2 h-4 w-4" />
                    {order.status === 'cancelled' ? 'Order Cancelled' : 'Track Order'}
                    {expanded[order.id] ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>

                  {expanded[order.id] && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Delivery Progress</div>
                        <div className="flex items-center gap-2">
                          {stageLabels.map((label, idx) => {
                            const current = getStage(order.created_at);
                            const active = idx <= current;
                            return (
                              <div key={label} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
                                {idx < stageLabels.length - 1 && (
                                  <div className={`h-0.5 w-10 ${idx < current ? 'bg-primary' : 'bg-muted'}`}></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Current status: {stageLabels[getStage(order.created_at)]}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Live Map (approximate)</div>
                        <div className="rounded overflow-hidden border">
                          <iframe
                            title={`map-${order.id}`}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(order.address + ', ' + order.city)}&output=embed`}
                            className="w-full h-64"
                            loading="lazy"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
