import { X, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RequestTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  item: any;
}

export function RequestTermsModal({ isOpen, onClose, onAccept, item }: RequestTermsModalProps) {
  if (!isOpen || !item) return null;

  const itemType = item.type || "share";
  const itemTitle = item.title || "this item";

  const shareTerms = [
    "I understand this is a temporary sharing arrangement and will return the item by the agreed date",
    "I will treat the item with care and use it only for its intended purpose",
    "I will return the item in the same condition I received it",
    "I am fully responsible for any damage, loss, or theft during the sharing period",
    "If the item is damaged, I will repair it or compensate the owner at fair market value",
    "I will respect the owner's pickup location and agreed time slot",
    "I will communicate promptly with the owner about any issues or delays",
    "I understand that failure to return or damaging the item may result in account suspension",
  ];

  const donateTerms = [
    "I understand this is a permanent donation and the item will not be returned",
    "I will collect the item from the specified location at the agreed time",
    "I accept the item in its current condition as described",
    "Once collected, I take full responsibility for the item",
    "I will not resell or misuse the donated item",
    "I will use the item for its intended purpose or donate it further if not needed",
    "I appreciate the donor's generosity and commitment to sustainability",
    "I understand this is a one-time transfer with no warranty or guarantees",
  ];

  const terms = itemType === "share" ? shareTerms : donateTerms;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-2xl text-card-foreground">Terms & Conditions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  For {itemType === "share" ? "borrowing" : "receiving"}: <span className="text-primary font-medium">{itemTitle}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
              {/* Terms List */}
              <div className="space-y-4">
                <h3 className="text-lg text-card-foreground font-medium">
                  By requesting this item, you agree to:
                </h3>
                <div className="space-y-3">
                  {terms.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-card-foreground leading-relaxed">{term}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Damage Responsibility - IMPORTANT */}
              {itemType === "share" && (
                <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-semibold text-destructive mb-2">
                        ⚠️ Damage Responsibility Policy
                      </h4>
                      <div className="space-y-2 text-sm text-card-foreground">
                        <p>
                          <strong>You are fully liable for any damage, loss, or theft of the item during the borrowing period.</strong>
                        </p>
                        <p>
                          • If you return the item damaged, you must either <strong>repair it to its original condition</strong> or 
                          <strong> compensate the owner</strong> for the full replacement/repair cost.
                        </p>
                        <p>
                          • If the item is lost or stolen, you must <strong>compensate the owner at fair market value</strong>.
                        </p>
                        <p>
                          • The owner will assess the item's condition upon return. Disputes will be mediated by ReuseHub admins.
                        </p>
                        <p>
                          • Failure to take responsibility may result in <strong>permanent account suspension</strong> and 
                          potential legal action.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Information */}
              <div className="rounded-lg border border-accent bg-accent/5 p-4">
                <h4 className="text-sm font-medium text-card-foreground mb-2">📋 Important Information</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Your request will be sent to the item owner for approval</li>
                  <li>• Contact information will be shared only after the owner approves your request</li>
                  <li>• Please coordinate pickup details directly with the owner</li>
                  <li>• Report any issues or disputes to admin@reusehub.com</li>
                  {itemType === "share" && (
                    <>
                      <li>• Take photos of the item before and after use as proof of condition</li>
                      <li>• The owner may request the item back at any reasonable time with 24-hour notice</li>
                    </>
                  )}
                  {itemType === "donate" && (
                    <li>• This is a permanent transfer - donated items cannot be returned to the donor</li>
                  )}
                </ul>
              </div>

              {/* Code of Conduct */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="text-sm font-medium text-primary mb-2">🌱 ReuseHub Code of Conduct</h4>
                <p className="text-sm text-muted-foreground">
                  ReuseHub is built on trust, sustainability, and community values. By participating, you agree to:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Treat all users with respect and honesty</li>
                  <li>• Maintain the quality and integrity of shared resources</li>
                  <li>• Communicate promptly and professionally</li>
                  <li>• Support our mission of reducing waste and building community</li>
                  <li>• Report violations or suspicious activity to platform admins</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Violations of this code may result in <strong>account suspension or termination</strong>.
                </p>
              </div>

              {/* Legal Notice */}
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Legal Notice:</strong> By clicking "Accept & Request," you acknowledge that you have read, 
                  understood, and agree to be bound by these terms and conditions. This constitutes a binding agreement 
                  between you and the item owner, facilitated by ReuseHub. ReuseHub acts as a platform facilitator and 
                  is not responsible for disputes between users, though we will assist in mediation when requested.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 flex gap-3 bg-muted/20">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-border bg-card px-6 py-3 text-card-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={onAccept}
                className="flex-1 rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90 font-medium"
              >
                Accept & Get this Item
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
