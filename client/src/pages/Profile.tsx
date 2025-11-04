import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Package, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
        await loadOrders(session.user.id);
      }
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
        loadOrders(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userEmail = sessionData.session?.user?.email || "";

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile");
      return;
    }

    if (data) {
      const profileData = {
        name: data.full_name || "",
        email: userEmail,
        phone: data.phone || "",
        address: data.address || "",
      };
      setProfile(profileData);
      setEditedProfile(profileData);
      setAvatarUrl(data.avatar_url);
    } else {
      // Create initial profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: "",
          phone: "",
          address: "",
        });

      if (!insertError) {
        const initialProfile = {
          name: "",
          email: userEmail,
          phone: "",
          address: "",
        };
        setProfile(initialProfile);
        setEditedProfile(initialProfile);
      }
    }
  };

  const loadOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      return;
    }

    // Parse items from JSON
    const parsedOrders = (data || []).map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    setOrders(parsedOrders as Order[]);
  };

  const handleSave = async () => {
    if (!user) return;

    const updates = {
      full_name: editedProfile.name,
      phone: editedProfile.phone,
      address: editedProfile.address,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...updates
      }, { 
        onConflict: 'id' 
      });

    if (error) {
      toast.error("Failed to update profile");
      console.error('Error updating profile:', error);
      return;
    }

    setProfile(editedProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) {
      toast.error("You must be logged in to cancel an order");
      return;
    }

    try {
      const { data: orderData, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!orderData) {
        toast.error("Order not found");
        return;
      }

      if (orderData.status !== 'pending') {
        toast.error("Only pending orders can be cancelled");
        return;
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success("Order cancelled successfully");
      await loadOrders(user.id);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error("Failed to cancel order");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user) {
      toast.error("Please select a file");
      return;
    }

    const file = event.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploading(true);

    try {
      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error(updateError.message);
      }

      // Delete old avatar if exists
      if (avatarUrl) {
        try {
          const oldPath = avatarUrl.split('/avatars/')[1];
          if (oldPath) {
            await supabase.storage.from('avatars').remove([oldPath]);
          }
        } catch (deleteError) {
          console.log('Old avatar deletion failed (non-critical):', deleteError);
        }
      }

      setAvatarUrl(urlData.publicUrl);
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
