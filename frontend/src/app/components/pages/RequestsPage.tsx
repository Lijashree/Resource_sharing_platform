import { useState, useEffect } from "react";
import { Check, X, Clock, CheckCircle2, XCircle, Phone, MapPin, User } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../../utils/api";
import { toast } from "sonner";
import { TermsModal } from "../ui/TermsModal";

type RequestStatus = "pending" | "approved" | "rejected";

export function RequestsPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const [ownerData, userData] = await Promise.all([
        api.requests.getOwnerRequests(),
        api.requests.getUserRequests(),
      ]);
      setOwnerRequests(ownerData.requests);
      setUserRequests(userData.requests);
    } catch (error: any) {
      toast.error(error.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await api.requests.approve(requestId);
      toast.success("Request approved!");
      loadRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await api.requests.reject(requestId);
      toast.success("Request rejected");
      loadRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    }
  };

  const handleViewPickupDetails = (request: any) => {
    setSelectedRequest(request);
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    toast.success("Terms accepted! You can now view pickup details.");
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
            <Clock className="h-4 w-4" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-sm text-destructive">
            <XCircle className="h-4 w-4" />
            Rejected
          </span>
        );
    }
  };

  const requests = activeTab === "received" ? ownerRequests : userRequests;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-foreground">Requests</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your item requests and incoming requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-6 py-3 transition-colors ${
            activeTab === "received"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Received Requests
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`px-6 py-3 transition-colors ${
            activeTab === "sent"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sent Requests
        </button>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request: any, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`rounded-xl border bg-card p-6 shadow-sm ${
                request.status === "approved" ? "border-primary/30" : "border-border"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={request.item?.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"}
                    alt={request.itemTitle || request.item?.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg text-card-foreground">
                    {request.itemTitle || request.item?.title}
                  </h3>
                  
                  {activeTab === "received" ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Requested by <span className="text-foreground">{request.requesterName}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Owner: <span className="text-foreground">{request.item?.ownerName}</span>
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                      Qty: {request.requestedQuantity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {request.item?.category}
                    </span>
                  </div>

                  {request.message && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Message: {request.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(request.status)}

                  {activeTab === "received" && request.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/5"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup Details - Only shown when approved for sent requests */}
              {activeTab === "sent" && request.status === "approved" && request.item && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 rounded-lg bg-primary/5 p-5 border-l-4 border-primary"
                >
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                    <MapPin className="h-4 w-4" />
                    Pickup Details
                  </h4>
                  <div className="space-y-3 text-sm text-card-foreground">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Owner: {request.item.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>Contact: {request.item.ownerPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Location: {request.item.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Time: {request.item.timeSlot || "Not specified"}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={`tel:${request.item.ownerPhone}`}
                      className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      📞 Call Owner
                    </a>
                    <a
                      href={`sms:${request.item.ownerPhone}`}
                      className="flex-1 rounded-lg border border-primary px-4 py-2 text-center text-sm text-primary hover:bg-primary/10 transition-colors"
                    >
                      💬 Send Message
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTerms}
        request={selectedRequest}
      />
    </div>
  );
}