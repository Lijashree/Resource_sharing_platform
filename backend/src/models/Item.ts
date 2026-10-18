import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  quantity: number;
  initialQuantity: number;
  type: 'share' | 'donate';
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string;
  owner: mongoose.Types.ObjectId;
  ownerName: string;
  ownerPhone?: string;
  location: string;
  timeSlot: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 1,
    },
    initialQuantity: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      enum: ['share', 'donate'],
      default: 'share',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Item must belong to an owner'],
      index: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    ownerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Available time slot is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for searching and filtering
ItemSchema.index({ title: 'text', description: 'text' });
ItemSchema.index({ category: 1, type: 1, status: 1 });

export const Item = mongoose.model<IItem>('Item', ItemSchema);
