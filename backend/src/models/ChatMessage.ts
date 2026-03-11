import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  roomId: string;
  text: string;
  isAiMessage: boolean;
  status: 'sent' | 'read';
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    roomId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    isAiMessage: { type: Boolean, default: false },
    status: { type: String, enum: ['sent', 'read'], default: 'sent' },
  },
  { timestamps: true }
);

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
