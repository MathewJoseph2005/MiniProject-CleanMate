import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  available: boolean;
  rating: number;
  completedJobs: number;
  attendance: Date[];
  portfolioImages: string[];
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  createdAt: Date;
}

const agentProfileSchema = new Schema<IAgentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, default: 'General Cleaning' },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    completedJobs: { type: Number, default: 0 },
    attendance: [{ type: Date }],
    portfolioImages: [{ type: String }],
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IAgentProfile>('AgentProfile', agentProfileSchema);
