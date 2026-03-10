import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComplaint>('Complaint', complaintSchema);
