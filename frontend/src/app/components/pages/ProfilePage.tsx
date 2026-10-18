import { useState, useEffect } from "react";
import { User, Mail, Phone, Building, Shield, Lock, Save, Calendar, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { api, getCurrentUser } from "../../utils/api";
import { toast } from "sonner";

export function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await api.auth.getMe();
      setUserProfile(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Fallback to local storage user if offline
      const local = getCurrentUser();
      if (local) {
        setUserProfile(local);
        setFormData({
          name: local.name || "",
          email: local.email || "",
          phone: local.phone || "",
          department: local.department || "",
          password: "",
          confirmPassword: "",
        });
      }
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const updatePayload: any = {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const res = await api.auth.updateProfile(updatePayload);
      setUserProfile(res.user);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">User Profile & Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal details, campus affiliation, and security preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm md:col-span-1 flex flex-col items-center text-center space-y-4"
        >
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              {userProfile?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-card-foreground">{userProfile?.name}</h2>
            <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
          </div>

          <div className="w-full space-y-2 pt-4 border-t border-border text-left text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Role:</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase text-primary">
                <Shield className="h-3 w-3" />
                {userProfile?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium text-foreground">{userProfile?.department || "General"}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium text-foreground">{userProfile?.phone || "Not set"}</span>
            </div>
            {userProfile?.createdAt && (
              <div className="flex items-center justify-between py-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Member since:
                </span>
                <span>{new Date(userProfile.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-8 shadow-sm md:col-span-2"
        >
          <h2 className="text-xl font-semibold text-card-foreground mb-6">Account Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-input-background py-2.5 pl-11 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-lg border border-border bg-muted/40 py-2.5 pl-11 pr-4 text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Campus institutional email cannot be changed</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full rounded-lg border border-border bg-input-background py-2.5 pl-11 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full rounded-lg border border-border bg-input-background py-2.5 pl-11 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Change Password (optional)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-muted-foreground">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full rounded-lg border border-border bg-input-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-muted-foreground">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="w-full rounded-lg border border-border bg-input-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
