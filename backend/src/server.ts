import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import path from 'path';
import dotenv from 'dotenv';

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import connectDB from './config/db';
import configurePassport from './config/passport';
import { setupChatHandlers } from './socket/chatHandler';

// Import routes
import authRoutes from './routes/auth';
import customerRoutes from './routes/customer';
import agentRoutes from './routes/agent';
import adminRoutes from './routes/admin';
import mapsRoutes from './routes/maps';

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Static files for uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Configure Passport
configurePassport();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/maps', mapsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup Socket.IO chat handlers
setupChatHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 CleanMate Backend running on port ${PORT}`);
      console.log(`📡 Socket.IO ready for connections`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, server, io };
