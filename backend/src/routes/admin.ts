import { RequestHandler } from "express";
import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Booking from '../models/Booking';
import Complaint from '../models/Complaint';
import AgentProfile from '../models/AgentProfile';
import Review from '../models/Review';

const router = Router();

// All admin routes require authentication
router.use(authenticate as any, requireRole('admin') as any);

// GET /api/admin/dashboard
router.get('/dashboard', async (req: any, res: any) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalBookings = await Booking.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0);

    const activeServices = await Booking.countDocuments({ status: 'in-progress' });
    const activeAgents = await AgentProfile.countDocuments({ available: true });

    const allReviews = await Review.find();
    const avgSatisfaction = allReviews.length > 0
      ? Math.round((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10) / 10
      : 0;

    res.json({
      stats: {
        totalUsers,
        totalAgents,
        totalBookings,
        pendingComplaints,
      },
      revenue: totalRevenue,
      activeServices,
      activeAgents,
      satisfaction: avgSatisfaction,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req: any, res: any) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => ({
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      status: u.isVerified ? 'active' : 'pending',
      joined: u.createdAt,
    }));

    res.json(formattedUsers);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load users', error: error.message });
  }
});

// GET /api/admin/agents/pending
router.get('/agents/pending', async (req: any, res: any) => {
  try {
    const agentProfiles = await AgentProfile.find()
      .populate('userId', 'fullName email isVerified');

    const agents = agentProfiles.map((a) => {
      const user = a.userId as any;
      return {
        id: a._id,
        userId: user._id,
        name: user.fullName,
        email: user.email,
        specialization: a.specialization,
        status: user.isVerified ? 'verified' : 'pending',
        documents: a.documents,
        rating: a.rating,
        completedJobs: a.completedJobs,
      };
    });

    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load agents', error: error.message });
  }
});

// PUT /api/admin/agents/:id/verify
router.put('/agents/:id/verify', async (req: any, res: any) => {
  try {
    const { action } = req.body; // 'verified' or 'rejected'
    const profile = await AgentProfile.findById(req.params.id);

    if (!profile) {
      res.status(404).json({ message: 'Agent profile not found' });
      return;
    }

    await User.findByIdAndUpdate(profile.userId, {
      isVerified: action === 'verified',
    });

    res.json({ message: `Agent ${action}` });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to verify agent', error: error.message });
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (req: any, res: any) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'fullName')
      .populate('agentId', 'fullName')
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      id: b._id,
      customerName: (b.customerId as any)?.fullName || 'Unknown',
      agentName: (b.agentId as any)?.fullName || 'Unassigned',
      serviceType: b.serviceType,
      variant: b.variant,
      date: b.date,
      status: b.status,
      amount: b.amount,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load bookings', error: error.message });
  }
});

// GET /api/admin/complaints
router.get('/complaints', async (req: any, res: any) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'fullName')
      .sort({ createdAt: -1 });

    const formatted = complaints.map((c) => ({
      id: c._id,
      subject: c.subject,
      description: c.description,
      status: c.status,
      date: c.createdAt,
      userName: (c.userId as any)?.fullName || 'Unknown',
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load complaints', error: error.message });
  }
});

// PUT /api/admin/complaints/:id
router.put('/complaints/:id', async (req: any, res: any) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }

    res.json({ message: `Complaint status updated to ${status}`, complaint });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
});

// GET /api/admin/analytics
router.get('/analytics', async (req: any, res: any) => {
  try {
    // Bookings by category
    const bookingsByCategory = await Booking.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly revenue (last 4 months)
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: fourMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 4 },
    ]);

    const categories = bookingsByCategory.map((b) => ({
      label: b._id,
      value: b.count,
    }));

    const revenue = monthlyRevenue.map((r) => {
      const [year, month] = r._id.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        month: date.toLocaleDateString('en-US', { month: 'long' }),
        amount: r.amount,
      };
    });

    res.json({ categories, revenue });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load analytics', error: error.message });
  }
});

export default router;
