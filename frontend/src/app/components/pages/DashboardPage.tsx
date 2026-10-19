import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Package, Users, TrendingUp, Heart } from "lucide-react";
import { QuantitySelector } from "../QuantitySelector";
import { api } from "../../utils/api";
import { toast } from "sonner";
import { RequestTermsModal } from "../ui/RequestTermsModal";

export function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeUsers: 0,
    itemsShared: 0,
    donations: 0,
  });

  useEffect(() => {
    loadItems();
    loadStats();
  }, []);

  const loadItems = async () => {
    try {
      const data = await api.items.getAll({ status: "approved" });
      setItems(data.items);

      // Initialize quantities to 1 for each item
      const quantities = {};
      data.items.forEach((item: any) => {
        quantities[item.id] = 1;
      });
      setSelectedQuantities(quantities);
    } catch (error: any) {
      toast.error(error.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const impactData = await api.impact.getStats();
      setStats({
        totalItems: impactData.totalItems || 0,
        activeUsers: impactData.activeUsers || 0,
        itemsShared: impactData.itemsShared || 0,
        donations: impactData.donations || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleRequestClick = (item: any) => {
    setSelectedItem(item);
    setShowTermsModal(true);
  };

  const handleAcceptTerms = async () => {
    if (!selectedItem) return;
    
    try {
      const quantity = selectedQuantities[selectedItem.id] || 1;
      await api.requests.create(selectedItem.id, quantity, "I'd like to request this item");
      toast.success("Request sent successfully!");
      setShowTermsModal(false);
      setSelectedItem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [itemId]: quantity }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back to ReuseHub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: stats.totalItems, icon: Package, color: "text-primary" },
          { label: "Active Users", value: stats.activeUsers, icon: Users, color: "text-secondary" },
          { label: "Items Shared", value: stats.itemsShared, icon: TrendingUp, color: "text-accent" },
          { label: "Donations", value: stats.donations, icon: Heart, color: "text-[#d62828]" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl text-card-foreground">{stat.value}</p>
                </div>
                <Icon className={`h-10 w-10 ${stat.color}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Items */}
      <div>
        <h2 className="mb-6 text-xl text-foreground">Available Items</h2>
        
        {items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No items available yet. Check back soon!</p>
            <p className="mt-2 text-sm text-muted-foreground">Items need admin approval before appearing here.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400";
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg text-card-foreground">{item.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.type === "share"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {item.type === "share" ? "Share" : "Donate"}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Available: {item.quantity}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <QuantitySelector
                      quantity={selectedQuantities[item.id] || 1}
                      onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                      maxQuantity={item.quantity}
                    />
                  </div>
                  <button
                    onClick={() => handleRequestClick(item)}
                    className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Get this Item
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Request Terms Modal */}
      <RequestTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
        item={selectedItem}
      />
    </div>
  );
}