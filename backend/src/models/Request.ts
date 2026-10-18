import mongoose, { Document, Schema } from 'mongoose';

export interface IRequest extends Document {
  _id: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  itemTitle: string;
  itemOwner: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  requesterName: string;
  requestedQuantity: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  termsAccepted: boolean;
  termsAcceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Request must refer to an item'],
      index: true,
    },
    itemTitle: {
      type: String,
      required: true,
      trim: true,
    },
    itemOwner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requesterName: {
      type: String,
      required: true,
      trim: true,
    },
    requestedQuantity: {
      type: Number,
      required: [true, 'Requested quantity is required'],
      min: [1, 'Requested quantity must be at least 1'],
      default: 1,
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    termsAccepted: {
      type: Boolean,
      default: true,
    },
    termsAcceptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

RequestSchema.index({ requester: 1, item: 1, status: 1 });

export const RequestModel = mongoose.model<IRequest>('Request', RequestSchema);
