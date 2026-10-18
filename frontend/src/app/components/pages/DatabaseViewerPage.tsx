import { useState, useEffect } from "react";
import { Database, RefreshCw, Download, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../../utils/api";
import { toast } from "sonner";

export function DatabaseViewerPage() {
  const [dbData, setDbData] = useState<any>({
    users: [],
    items: [],
    requests: [],
    pickups: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "items" | "requests" | "pickups">("users");

  const loadDatabase = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getDatabaseOverview();
      if (data.database?.collections) {
        setDbData(data.database.collections);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to query live database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  const exportData = () => {
    const dataStr = JSON.stringify(dbData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reusehub-mongodb-backup-${Date.now()}.json`;
    link.click();
    toast.success("Database snapshot exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl text-foreground flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Database Inspector
          </h1>
          <p className="mt-2 text-muted-foreground">
            Live real-time view of verified MongoDB collections and documents
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadDatabase}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Users Collection", count: dbData.users?.length || 0, key: "users" },
          { label: "Items Collection", count: dbData.items?.length || 0, key: "items" },
          { label: "Requests Collection", count: dbData.requests?.length || 0, key: "requests" },
          { label: "NGO Pickups", count: dbData.pickups?.length || 0, key: "pickups" },
        ].map((col, index) => (
          <motion.div
            key={col.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="text-sm text-muted-foreground">{col.label}</div>
            <div className="mt-2 text-3xl font-semibold text-card-foreground">{col.count}</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>MongoDB Verified</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collection Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {(["users", "items", "requests", "pickups"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 transition-colors capitalize whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab} ({dbData[tab]?.length || 0})
          </button>
        ))}
      </div>

      {/* Collection Records JSON Inspector */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-muted-foreground">
            collection: {activeTab} ({dbData[activeTab]?.length || 0} documents)
          </span>
          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
            Mongoose Schema Validated
          </span>
        </div>
        <pre className="overflow-auto text-xs sm:text-sm font-mono bg-muted/30 p-4 rounded-lg text-card-foreground max-h-[500px]">
          {JSON.stringify(dbData[activeTab] || [], null, 2)}
        </pre>
      </div>

      {/* Architecture Info */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span>🏗️</span> Production Database Architecture
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
          <div>
            <p className="mb-1"><strong>Database Engine:</strong> MongoDB (Atlas / Local MongoDB Service)</p>
            <p className="mb-1"><strong>ODM Framework:</strong> Mongoose 8 with TypeScript Type Safety</p>
            <p className="mb-1"><strong>Authentication:</strong> JWT (Stateless Bearer Tokens) & Bcryptjs</p>
          </div>
          <div>
            <p className="mb-1"><strong>Data Integrity:</strong> Atomic inventory checks & schema validation</p>
            <p className="mb-1"><strong>Indexes:</strong> Full-text item search and compound category indexes</p>
            <p className="mb-1"><strong>API Layer:</strong> Node.js & Express RESTful micro-endpoints</p>
          </div>
        </div>
      </div>
    </div>
  );
}
