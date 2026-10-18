import mongoose, { Document, Schema } from 'mongoose';

export interface IDonationPickup extends Document {
  _id: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[];
  requester: mongoose.Types.ObjectId;
  ngoName: string;
  contactNumber: string;
  pickupDate: string;
  notes?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const DonationPickupSchema = new Schema<IDonationPickup>(
  {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
    ],
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ngoName: {
      type: String,
      required: [true, 'NGO Name is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    pickupDate: {
      type: String,
      required: [true, 'Pickup date is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const DonationPickup = mongoose.model<IDonationPickup>(
  'DonationPickup',
  DonationPickupSchema
);
