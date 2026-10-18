import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

interface PickupDetailsProps {
  ownerName: string;
  contactNumber: string;
  pickupLocation: string;
  timeSlot: string;
}

export function PickupDetails({
  ownerName,
  contactNumber,
  pickupLocation,
  timeSlot,
}: PickupDetailsProps) {
  const handleCall = () => {
    window.location.href = `tel:${contactNumber}`;
  };

  const handleMessage = () => {
    window.location.href = `sms:${contactNumber}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
          <h4 className="text-sm text-primary">Pickup Details</h4>
        </div>

        <div className="space-y-3">
          {/* Owner Name */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs text-primary">
                  {ownerName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="text-sm text-card-foreground">{ownerName}</p>
            </div>
          </div>

          {/* Contact Number */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Contact Number</p>
              <p className="text-sm text-card-foreground">{contactNumber}</p>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Pickup Location</p>
              <p className="text-sm text-card-foreground">{pickupLocation}</p>
            </div>
          </div>

          {/* Time Slot */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Available Time</p>
              <p className="text-sm text-card-foreground">{timeSlot}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleCall}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            Call
          </button>
          <button
            onClick={handleMessage}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary bg-card px-4 py-2.5 text-sm text-primary transition-colors hover:bg-primary/5"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </button>
        </div>
      </div>
    </motion.div>
  );
}
