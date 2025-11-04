import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Package, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: OrderItem[];
  full_name: string;
  address: string;
  city: string;
  pin_code: string;
  phone: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [orders, setOrders] = useState<Order[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : null;
    setUser(u);
    if (u?.id) {
      loadProfile(u.id);
      loadOrders(u.id);
    }
    setLoading(false);

    const handler = () => {
      const s = localStorage.getItem('user');
      const nu = s ? JSON.parse(s) : null;
      setUser(nu);
      if (nu?.id) {
        loadProfile(nu.id);
        loadOrders(nu.id);
      }
    };
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  const loadProfile = async (_userId: string) => {
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : null;
    const profileData = {
      name: u?.name || "",
      email: u?.email || "",
      phone: u?.phone || "",
      address: u?.address || "",
    };
    setProfile(profileData);
    setEditedProfile(profileData);
    setAvatarUrl(u?.avatar_url || null);
  };

  const loadOrders = async (userId: string) => {
    const raw = localStorage.getItem('ls_orders');
    const all: Order[] = raw ? JSON.parse(raw) : [];
    const mine = all
      .filter(o => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setOrders(mine);
  };

  const handleSave = async () => {
    if (!user) return;
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : {};
    const updated = {
      ...u,
      name: editedProfile.name,
      email: editedProfile.email,
      phone: editedProfile.phone,
      address: editedProfile.address,
    };
    localStorage.setItem('user', JSON.stringify(updated));
    window.dispatchEvent(new Event('auth-changed'));
    setUser(updated);
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) {
      toast.error("You must be logged in to cancel an order");
      return;
    }
    const raw = localStorage.getItem('ls_orders');
    const all: Order[] = raw ? JSON.parse(raw) : [];
    const target = all.find(o => o.id === orderId && o.user_id === user.id);
    if (!target) {
      toast.error("Order not found");
      return;
    }
    if (target.status !== 'pending' && target.status !== 'placed') {
      toast.error("Only pending orders can be cancelled");
      return;
    }
    const updated = all.map(o => o.id === orderId ? { ...o, status: 'cancelled', cancelled_at: new Date().toISOString() as any } : o);
    localStorage.setItem('ls_orders', JSON.stringify(updated));
    toast.success("Order cancelled successfully");
    await loadOrders(user.id);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (_event: React.ChangeEvent<HTMLInputElement>) => {
    toast.error("Avatar upload is disabled in local mode");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 mb-4 bg-primary text-primary-foreground text-2xl">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={profile.name || "User"} />
                      ) : (
                        <AvatarFallback>{getInitials(profile.name || "U")}</AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-3 right-0 rounded-full w-8 h-8 p-0"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{profile.name || "Guest User"}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground break-all">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{profile.address}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-bold text-xl">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-bold text-xl">₹{totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      value={editedProfile.address}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle>Order History</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-secondary/20 p-6 rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "PPP")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {order.items.length} item(s)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-2xl">₹{Number(order.total).toFixed(2)}</p>
                            <p className={`text-sm font-medium capitalize ${
                              order.status === 'cancelled' ? 'text-destructive' : 'text-green-600'
                            }`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          {order.items.map((item: any, idx: number) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {item.name} x {item.quantity}
                            </p>
                          ))}
                        </div>
                        {order.status === 'pending' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-4"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-semibold mb-2">No orders yet</p>
                        <p className="text-muted-foreground mb-6">Start shopping to see your order history here</p>
                        <Button onClick={() => window.location.href = '/shop'}>
                          Browse Products
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
