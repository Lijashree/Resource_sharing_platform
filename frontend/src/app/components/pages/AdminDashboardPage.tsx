import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, X, Trash2, Users, Package, Inbox, TrendingUp } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  category: string;
  type: string;
  quantity: number;
  owner?: string;
  ownerName: string;
  status: "pending" | "approved" | "rejected";
  imageUrl: string;
  createdAt: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  itemsListed: number;
  createdAt: string;
}

export function AdminDashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"items" | "users">("items");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingItems: 0,
    totalUsers: 0,
    activeRequests: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [itemsData, statsData, usersData] = await Promise.all([
        api.items.getAll({}), // Gets all items for admin
        api.admin.getStats(),
        api.admin.getAllUsers(),
      ]);

      setItems(itemsData.items || []);
      if (statsData.stats) {
        setStats(statsData.stats);
      }
      if (usersData.users) {
        setUsers(usersData.users);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.admin.approveItem(id);
      toast.success("Item approved successfully!");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve item");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.admin.rejectItem(id);
      toast.success("Item rejected");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject item");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      await api.items.delete(id);
      toast.success("Item removed from database");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time oversight of campus items, requests, and registered community members
        </p>
      </div>

      {/* Real Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: stats.totalItems, icon: Package, color: "text-primary" },
          { label: "Pending Approval", value: stats.pendingItems, icon: Inbox, color: "text-accent" },
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-secondary" },
          { label: "Active Requests", value: stats.activeRequests, icon: TrendingUp, color: "text-[#52b788]" },
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("items")}
          className={`px-6 py-3 transition-colors ${
            activeTab === "items"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Items Management ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {/* Items Table */}
      {activeTab === "items" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          {items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No items in the system yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Item</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Owner</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                            alt={item.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400";
                            }}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-card-foreground">{item.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-card-foreground">{item.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs capitalize ${
                            item.type === "share"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-card-foreground">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-card-foreground">{item.ownerName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs capitalize ${
                            item.status === "approved"
                              ? "bg-primary/10 text-primary"
                              : item.status === "rejected"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {item.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="rounded-lg bg-destructive p-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="rounded-lg bg-muted p-2 text-destructive transition-colors hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          {users.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No registered users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Email</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Role</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Department</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Items Listed</th>
                    <th className="px-6 py-4 text-left text-sm text-muted-foreground">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4 text-sm font-medium text-card-foreground">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs uppercase font-medium ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "ngo"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{u.department || "General"}</td>
                      <td className="px-6 py-4 text-sm text-card-foreground font-semibold">{u.itemsListed}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}