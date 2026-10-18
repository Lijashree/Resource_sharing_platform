import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Truck, MapPin, Calendar, Package, Heart } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";

const ngoPartners = [
  {
    name: "Campus Relief Foundation",
    description: "Supporting students in need with essential items",
    itemsReceived: 127,
  },
  {
    name: "Student Support Network",
    description: "Providing resources for academic success",
    itemsReceived: 93,
  },
  {
    name: "Wellness Initiative",
    description: "Promoting health and wellbeing on campus",
    itemsReceived: 64,
  },
];

export function NGODonationPage() {
  const [donationItems, setDonationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pickupDetails, setPickupDetails] = useState({
    ngoName: "",
    contactNumber: "",
    pickupDate: "",
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const data = await api.donations.getAll();
      setDonationItems(data.items);
    } catch (error: any) {
      toast.error(error.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPickup = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    if (!pickupDetails.ngoName || !pickupDetails.contactNumber || !pickupDetails.pickupDate) {
      toast.error("Please fill all pickup details");
      return;
    }

    try {
      await api.donations.requestPickup(
        selectedItems,
        pickupDetails.ngoName,
        pickupDetails.contactNumber,
        pickupDetails.pickupDate
      );
      toast.success("Pickup requested successfully! NGO will contact you within 24 hours.");
      setSelectedItems([]);
      setShowPickupForm(false);
      setPickupDetails({ ngoName: "", contactNumber: "", pickupDate: "" });
      loadDonations();
    } catch (error: any) {
      toast.error(error.message || "Failed to request pickup");
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-foreground">NGO Donations</h1>
        <p className="mt-2 text-muted-foreground">
          Track your donations and coordinate pickups with partner organizations
        </p>
      </div>

      {/* Request Pickup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg text-card-foreground">Ready to Donate?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Request a pickup from our partner NGOs for your donated items
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPickupForm(!showPickupForm)}
            className="whitespace-nowrap rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Request Pickup
          </button>
        </div>

        {/* Pickup Form */}
        {showPickupForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 space-y-4 border-t border-border pt-6"
          >
            <div>
              <label className="mb-2 block text-sm text-card-foreground">NGO Name</label>
              <select
                value={pickupDetails.ngoName}
                onChange={(e) => setPickupDetails({ ...pickupDetails, ngoName: e.target.value })}
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select NGO</option>
                {ngoPartners.map((ngo) => (
                  <option key={ngo.name} value={ngo.name}>
                    {ngo.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-card-foreground">Contact Number</label>
              <input
                type="tel"
                value={pickupDetails.contactNumber}
                onChange={(e) => setPickupDetails({ ...pickupDetails, contactNumber: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-card-foreground">Preferred Pickup Date</label>
              <input
                type="date"
                value={pickupDetails.pickupDate}
                onChange={(e) => setPickupDetails({ ...pickupDetails, pickupDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              onClick={handleRequestPickup}
              disabled={selectedItems.length === 0}
              className="w-full rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Pickup Request ({selectedItems.length} items selected)
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Your Donated Items */}
      <div>
        <h2 className="mb-6 text-2xl text-foreground">Your Donated Items</h2>
        
        {donationItems.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No donation items yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Items marked as "Donate" will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donationItems.map((item: any, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`overflow-hidden rounded-xl border bg-card shadow-sm transition-all ${
                  selectedItems.includes(item.id)
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg text-card-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quantity: {item.quantity}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.donationStatus === "delivered"
                          ? "bg-primary/10 text-primary"
                          : item.donationStatus === "pickup_scheduled"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {item.donationStatus === "delivered"
                        ? "Delivered"
                        : item.donationStatus === "pickup_scheduled"
                        ? "Pickup Scheduled"
                        : "Pending Pickup"}
                    </span>
                  </div>

                  {item.donationStatus === "pending_pickup" && (
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className={`mt-4 w-full rounded-lg px-4 py-2 text-sm transition-colors ${
                        selectedItems.includes(item.id)
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border bg-card text-card-foreground hover:border-primary/50"
                      }`}
                    >
                      {selectedItems.includes(item.id) ? "Selected ✓" : "Select for Pickup"}
                    </button>
                  )}

                  {item.ngoName && (
                    <div className="mt-3 rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">NGO: {item.ngoName}</p>
                      {item.pickupDate && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pickup: {new Date(item.pickupDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* NGO Partners */}
      <div>
        <h2 className="mb-6 text-2xl text-foreground">Our NGO Partners</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {ngoPartners.map((ngo, index) => (
            <motion.div
              key={ngo.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg text-card-foreground">{ngo.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ngo.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {ngo.itemsReceived} items received
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
