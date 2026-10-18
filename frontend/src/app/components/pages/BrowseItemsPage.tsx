import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { QuantitySelector } from "../QuantitySelector";
import { api } from "../../utils/api";
import { toast } from "sonner";
import { RequestTermsModal } from "../ui/RequestTermsModal";

const categories = ["All", "Laptops", "Books", "Aptitude Books", "Project Components"];
const types = ["All", "Share", "Donate"];

export function BrowseItemsPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadItems();
  }, [selectedCategory, selectedType, searchQuery]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.items.getAll({
        status: "approved",
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        type: selectedType !== "All" ? selectedType.toLowerCase() : undefined,
        q: searchQuery || undefined,
      });
      setAllItems(data.items);
      
      // Initialize quantities
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-foreground">Browse Items</h1>
        <p className="mt-2 text-muted-foreground">
          Discover and get items shared by the community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="text-lg text-card-foreground">Filters</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-input-background py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="mb-2 block text-sm text-card-foreground">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                  selectedCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:border-primary/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="mb-2 block text-sm text-card-foreground">Type</label>
          <div className="flex gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-all ${
                  selectedType === type
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:border-primary/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading items...</p>
          </div>
        </div>
      ) : allItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No items found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {allItems.length} {allItems.length === 1 ? "item" : "items"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allItems.map((item: any, index) => (
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
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg text-card-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    by {item.ownerName}
                  </p>
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
                  <div className="mt-3">
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
        </div>
      )}
      <RequestTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
        item={selectedItem}
      />
    </div>
  );
}