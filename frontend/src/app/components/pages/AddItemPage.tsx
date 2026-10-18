import { useState } from "react";
import { Upload, Image as ImageIcon, BookOpen, Laptop, Cpu, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { api, getCurrentUser } from "../../utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function AddItemPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [selectedType, setSelectedType] = useState<"share" | "donate">("share");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 1,
    phone: "",
    location: "",
    timeSlot: "",
  });

  const categories = [
    "Laptops",
    "Books",
    "Aptitude Books",
    "Project Components",
  ];

  const subcategories = [
    "Sensors",
    "Arduino Board",
    "Raspberry Pi",
    "Jumper Wires",
    "Breadboard",
    "Resistors",
    "LEDs",
    "Motors",
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Laptops":
        return Laptop;
      case "Books":
      case "Aptitude Books":
        return BookOpen;
      case "Project Components":
        return Cpu;
      default:
        return Wrench;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.items.create({
        title: formData.title,
        description: formData.description,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        type: selectedType,
        quantity: formData.quantity,
        location: formData.location,
        timeSlot: formData.timeSlot,
        imageUrl: imagePreview || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        ownerName: currentUser?.name || "",
        ownerPhone: formData.phone,
      });

      toast.success("Item submitted for admin approval!");
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl text-foreground">Add New Item</h1>
        <p className="mt-2 text-muted-foreground">
          Share or donate items with your campus community
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="mb-2 block text-card-foreground">Item Name</label>
            <input
              type="text"
              placeholder="e.g., Calculus Textbook, Study Lamp"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-card-foreground">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              required
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a category</option>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category);
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Subcategory - Only show if Project Components is selected */}
          {selectedCategory === "Project Components" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="mb-2 block text-card-foreground">Subcategory</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-card-foreground">Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
              required
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-6">
            <h3 className="mb-4 text-lg text-card-foreground">Pickup Details</h3>
            <div className="space-y-5">
              {/* Contact Number */}
              <div>
                <label className="mb-2 block text-card-foreground">
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Your contact number will only be visible after request approval
                </p>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="mb-2 block text-card-foreground">
                  Pickup Location
                </label>
                <select
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select pickup location</option>
                  <option value="Main Library">Main Library</option>
                  <option value="Engineering Block">Engineering Block</option>
                  <option value="Science Lab">Science Lab</option>
                  <option value="Hostel A">Hostel A</option>
                  <option value="Hostel B">Hostel B</option>
                  <option value="Hostel C">Hostel C</option>
                  <option value="Student Center">Student Center</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Sports Complex">Sports Complex</option>
                </select>
              </div>

              {/* Available Time Slot */}
              <div>
                <label className="mb-2 block text-card-foreground">
                  Available Time Slot
                </label>
                <select
                  required
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select preferred time</option>
                  <option value="9 AM - 11 AM">9 AM - 11 AM</option>
                  <option value="11 AM - 1 PM">11 AM - 1 PM</option>
                  <option value="1 PM - 3 PM">1 PM - 3 PM</option>
                  <option value="3 PM - 5 PM">3 PM - 5 PM</option>
                  <option value="5 PM - 7 PM">5 PM - 7 PM</option>
                  <option value="7 PM - 9 PM">7 PM - 9 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="mb-3 block text-card-foreground">Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedType("share")}
                className={`flex-1 rounded-lg border-2 px-6 py-4 transition-all ${
                  selectedType === "share"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-card-foreground hover:border-primary/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg">Share</div>
                  <div className="mt-1 text-sm opacity-75">
                    Lend temporarily
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("donate")}
                className={`flex-1 rounded-lg border-2 px-6 py-4 transition-all ${
                  selectedType === "donate"
                    ? "border-secondary bg-secondary/5 text-secondary"
                    : "border-border bg-card text-card-foreground hover:border-secondary/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg">Donate</div>
                  <div className="mt-1 text-sm opacity-75">
                    Give away permanently
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-card-foreground">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the item's condition, features, and any other relevant details..."
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="mb-2 block text-card-foreground">
              Upload Image
            </label>
            {imagePreview ? (
              <div className="relative rounded-lg border border-border overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview("")}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-lg px-3 py-1 text-sm hover:bg-destructive/90"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-border bg-muted p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/80">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  PNG, JPG or JPEG (max. 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Adding Item..." : "Add Item"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}