import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  serviceType: string;
  variant: string;
  date: Date;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  amount: number;
  customerId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  isEmergency: boolean;
  address: string;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    serviceType: { type: String, required: true },
    variant: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'in-progress', 'completed', 'rejected'],
      default: 'pending',
    },
    amount: { type: Number, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    isEmergency: { type: Boolean, default: false },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
