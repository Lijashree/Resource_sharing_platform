import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  request: any;
}

export function TermsModal({ isOpen, onClose, onAccept, request }: TermsModalProps) {
  if (!isOpen || !request) return null;

  const itemType = request.item?.type || "share";
  const itemTitle = request.itemTitle || request.item?.title || "this item";

  const shareTerms = [
    "I understand this is a temporary sharing arrangement",
    "I will return the item in the same condition",
    "I will respect the owner's pickup location and time slot",
    "I will communicate promptly with the owner",
    "I am responsible for the item during the sharing period",
    "I will return the item by the agreed date",
  ];

  const donateTerms = [
    "I understand this is a permanent donation",
    "I will collect the item from the specified location",
    "I will respect the donor's preferred time slot",
    "Once collected, the item becomes my responsibility",
    "I will not resell or misuse the donated item",
    "I appreciate the donor's generosity and sustainability effort",
  ];

  const terms = itemType === "share" ? shareTerms : donateTerms;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
            className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-2xl text-card-foreground">Terms & Conditions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  For {itemType === "share" ? "sharing" : "receiving donation"}: <span className="text-primary">{itemTitle}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6">
              {/* Terms List */}
              <div className="space-y-4">
                <h3 className="text-lg text-card-foreground font-medium">
                  By accepting, you agree to:
                </h3>
                <div className="space-y-3">
                  {terms.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-card-foreground">{term}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="rounded-lg border border-accent bg-accent/5 p-4">
                <h4 className="text-sm font-medium text-card-foreground mb-2">Important Information</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Contact information will be shared upon acceptance</li>
                  <li>• Please coordinate pickup details with the owner</li>
                  <li>• Report any issues to admin@reusehub.com</li>
                  {itemType === "share" && (
                    <li>• The owner may request the item back at any reasonable time</li>
                  )}
                  {itemType === "donate" && (
                    <li>• This is a permanent transfer - items cannot be returned</li>
                  )}
                </ul>
              </div>

              {/* Code of Conduct */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="text-sm font-medium text-primary mb-2">🌱 ReuseHub Code of Conduct</h4>
                <p className="text-sm text-muted-foreground">
                  ReuseHub promotes sustainability and community trust. By participating, you agree to treat all users with respect, 
                  maintain the quality of shared items, and contribute to a positive campus environment. Violations may result in 
                  account suspension.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-border bg-card px-6 py-3 text-card-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={onAccept}
                className="flex-1 rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Accept & Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}