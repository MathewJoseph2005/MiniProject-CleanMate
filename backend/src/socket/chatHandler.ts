import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import ChatMessage from '../models/ChatMessage';
import User from '../models/User';

// AI Chatbot responses for cleaning services
const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! 👋 Welcome to CleanMate AI Assistant. How can I help you today?",
    "Hi there! I'm your CleanMate assistant. Ask me anything about our cleaning services!",
  ],
  pricing: [
    "Our pricing depends on the type of service:\n• Standard Cleaning: ₹18/sq ft\n• Deep Cleaning: ₹25/sq ft\n• Emergency Cleaning: ₹35/sq ft\n\nFor a custom quote, try our Cost Estimator tool!",
  ],
  services: [
    "We offer three main service categories:\n🏠 **House Cleaning** — Residential deep cleaning\n🏢 **Office Cleaning** — Commercial workspace cleaning\n🏭 **Commercial Cleaning** — Large-scale industrial cleaning\n\nEach comes in Standard, Deep Cleaning, and Emergency variants.",
  ],
  booking: [
    "To book a service:\n1. Go to 'Book Service' in the sidebar\n2. Choose your service category and variant\n3. Toggle Emergency if needed\n4. Confirm your booking!\n\nAn agent will be assigned shortly after.",
  ],
  tracking: [
    "You can track your service in real-time through the 'Service Tracking' page. It shows four stages:\n✅ Requested → ✅ Approved → 🔄 In Progress → ⏳ Completed",
  ],
  complaint: [
    "Sorry to hear you're having trouble! You can file a complaint through:\n1. Go to 'Complaints' in the sidebar\n2. Describe your issue\n3. Submit the form\n\nOur team will review it promptly.",
  ],
  fallback: [
    "I'm not sure I understand. I can help with:\n• Service information\n• Pricing & estimates\n• Booking guidance\n• Service tracking\n• Filing complaints\n\nCould you rephrase your question?",
    "That's a great question! Let me help you. Could you tell me more about what you need? I can assist with bookings, pricing, or service information.",
  ],
};

function getAiResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(lowerMsg)) {
    return AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)];
  }
  if (/\b(price|cost|rate|charge|fee|how much|estimate)\b/.test(lowerMsg)) {
    return AI_RESPONSES.pricing[0];
  }
  if (/\b(service|clean|offer|what do you|type)\b/.test(lowerMsg)) {
    return AI_RESPONSES.services[0];
  }
  if (/\b(book|schedule|reserve|appointment)\b/.test(lowerMsg)) {
    return AI_RESPONSES.booking[0];
  }
  if (/\b(track|status|where|progress|update)\b/.test(lowerMsg)) {
    return AI_RESPONSES.tracking[0];
  }
  if (/\b(complaint|issue|problem|trouble|wrong|bad)\b/.test(lowerMsg)) {
    return AI_RESPONSES.complaint[0];
  }

  return AI_RESPONSES.fallback[Math.floor(Math.random() * AI_RESPONSES.fallback.length)];
}

export const setupChatHandlers = (io: Server): void => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`🔌 User connected: ${user.fullName} (${user._id})`);

    // Join user's personal room
    socket.join(`user_${user._id}`);

    // Join a chat room
    socket.on('join_room', async (roomId: string) => {
      socket.join(roomId);
      console.log(`📝 ${user.fullName} joined room: ${roomId}`);

      // Mark messages as read where user is not the sender
      await ChatMessage.updateMany(
        { roomId, senderId: { $ne: user._id }, status: 'sent' },
        { $set: { status: 'read' } }
      );

      // Notify others in the room that messages have been read
      io.to(roomId).emit('messages_read', { roomId, userId: user._id });

      // Send chat history
      const history = await ChatMessage.find({ roomId })
        .sort({ createdAt: 1 })
        .limit(50)
        .populate('senderId', 'fullName avatar');

      socket.emit('chat_history', history);
    });

    // Send a message
    socket.on('send_message', async (data: { roomId: string; text: string; receiverId?: string }) => {
      try {
        // Check if there are other users in the room
        const roomSockets = await io.in(data.roomId).fetchSockets();
        const otherUsersInRoom = roomSockets.some(s => (s as any).user?._id.toString() !== user._id.toString());
        
        const status = otherUsersInRoom ? 'read' : 'sent';

        const message = await ChatMessage.create({
          senderId: user._id,
          receiverId: data.receiverId,
          roomId: data.roomId,
          text: data.text,
          isAiMessage: false,
          status: status,
        });

        const populated = await message.populate('senderId', 'fullName avatar');

        // Broadcast to the room (to EVERYONE including the sender)
        console.log(`✉️ Broadcasting message to room: ${data.roomId} with status: ${status}`);
        io.to(data.roomId).emit('new_message', {
          _id: populated._id,
          senderId: populated.senderId,
          text: populated.text,
          roomId: populated.roomId,
          isAiMessage: false,
          status: populated.status,
          createdAt: populated.createdAt,
        });

        // If it's the AI chatbot room, generate a response
        if (data.roomId.startsWith('ai_')) {
          setTimeout(async () => {
            const aiResponse = getAiResponse(data.text);

            const aiMessage = await ChatMessage.create({
              senderId: user._id,
              roomId: data.roomId,
              text: aiResponse,
              isAiMessage: true,
              status: 'read',
            });

            io.to(data.roomId).emit('new_message', {
              _id: aiMessage._id,
              senderId: { _id: 'ai_bot', fullName: 'CleanMate AI', avatar: null },
              text: aiMessage.text,
              roomId: aiMessage.roomId,
              isAiMessage: true,
              status: 'read',
              createdAt: aiMessage.createdAt,
            });
          }, 1000);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: user._id,
        userName: user.fullName,
        isTyping: data.isTyping,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${user.fullName}`);
    });
  });
};
