import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Recycle, Mail, Lock, Shield, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { api, getCurrentUser } from "../../utils/api";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // user | admin | ngo
  });

  // Check if user is already authenticated
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.role === "admin") {
        navigate("/app/admin");
      } else {
        navigate("/app/dashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
        await api.auth.signup(formData.email, formData.password, formData.name, formData.role);
        toast.success("Account created successfully! Please sign in.");
        setIsSignUp(false);
      } else {
        // Sign In
        const data = await api.auth.signin(formData.email, formData.password);
        toast.success(`Welcome back, ${data.user.name}!`);

        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/app/admin");
        } else {
          navigate("/app/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fillDemoAccount = (email: string, pass: string) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password: pass,
    }));
    setIsSignUp(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2 md:gap-12">
        {/* Illustration Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden flex-col justify-center md:flex"
        >
          <div className="flex h-full flex-col justify-center space-y-8">
            <div className="flex items-center gap-3">
              <Recycle className="h-14 w-14 text-primary" />
              <h1 className="text-5xl font-bold text-primary">ReuseHub</h1>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-semibold leading-tight text-foreground">
                Sustainable Campus Resource Sharing
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with students, faculty, and campus organizations to share textbooks,
                electronics, lab gear, and supplies. Reduce landfill waste and empower your community.
              </p>
            </div>

            {/* Quick Demo Credentials Widget */}
            <div className="rounded-xl border border-primary/20 bg-card/80 p-5 backdrop-blur shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Instant Demo Access</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("lijashree@college.edu", "admin123")}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="h-3 w-3" /> Admin (Lijashree)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("krishnapriya@college.edu", "user123")}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
                >
                  Student (Krishnapriya)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount("mithuna@college.edu", "user123")}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
                >
                  Student (Mithuna)
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center"
        >
          <div className="w-full rounded-2xl bg-card p-8 shadow-lg border border-border">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isSignUp
                  ? "Join the sustainable campus community"
                  : "Continue your sustainability journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-card-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lijashree"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-card-foreground">
                    Account Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="user">Student / Faculty Member</option>
                    <option value="admin">Campus Administrator</option>
                    <option value="ngo">Registered NGO Partner</option>
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-input-background py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-input-background py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold transition-colors hover:bg-primary/90 disabled:opacity-50"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? "Create ReuseHub Account"
                  : "Sign In to ReuseHub"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-primary hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}