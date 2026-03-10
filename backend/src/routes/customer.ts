import { RequestHandler } from "express";
import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import Booking from '../models/Booking';
import User from '../models/User';
import AgentProfile from '../models/AgentProfile';
import Review from '../models/Review';
import Complaint from '../models/Complaint';

const router = Router();

// All customer routes require authentication
router.use(authenticate as any, requireRole('customer') as any);

// GET /api/customer/dashboard
router.get('/dashboard', async (req: any, res: any) => {
  try {
    const userId = req.user!._id;
    const bookings = await Booking.find({ customerId: userId });

    const active = bookings.filter((b) => b.status === 'in-progress' || b.status === 'approved').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const totalSpent = bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + b.amount, 0);

    const recentBookings = await Booking.find({ customerId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('agentId', 'fullName');

    res.json({
      stats: { active, completed, pending, totalSpent },
      recentBookings,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
});

// GET /api/customer/bookings
router.get('/bookings', async (req: any, res: any) => {
  try {
    const bookings = await Booking.find({ customerId: req.user!._id })
      .sort({ createdAt: -1 })
      .populate('agentId', 'fullName');
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load bookings', error: error.message });
  }
});

// POST /api/customer/bookings
router.post('/bookings', async (req: any, res: any) => {
  try {
    const { serviceType, variant, date, isEmergency, address } = req.body;

    // Calculate amount based on service type and variant
    let baseAmount = 150;
    if (variant === 'Deep Cleaning') baseAmount = 250;
    if (variant === 'Emergency') baseAmount = 450;
    if (serviceType === 'Office Cleaning') baseAmount *= 1.2;
    if (serviceType === 'Commercial Cleaning') baseAmount *= 1.8;
    if (isEmergency) baseAmount *= 1.5;

    const booking = await Booking.create({
      serviceType,
      variant,
      date: new Date(date),
      amount: Math.round(baseAmount),
      customerId: req.user!._id,
      isEmergency: isEmergency || false,
      address: address || req.user!.address,
    });

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// GET /api/customer/bookings/:id/tracking
router.get('/bookings/:id/tracking', async (req: any, res: any) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user!._id,
    }).populate('agentId', 'fullName');

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const statusOrder = ['pending', 'approved', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(booking.status);

    const steps = statusOrder.map((status, i) => ({
      label: status === 'in-progress' ? 'In Progress' :
             status.charAt(0).toUpperCase() + status.slice(1),
      status: i < currentIndex ? 'done' as const :
              i === currentIndex ? 'current' as const :
              'upcoming' as const,
    }));

    res.json({ booking, steps });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load tracking', error: error.message });
  }
});

// GET /api/customer/agents/nearby
router.get('/agents/nearby', async (req: any, res: any) => {
  try {
    const agents = await AgentProfile.find({ available: true })
      .populate('userId', 'fullName avatar address location')
      .sort({ rating: -1 });

    const formattedAgents = agents.map((a) => {
      const user = a.userId as any;
      return {
        id: a._id,
        userId: user._id,
        name: user.fullName,
        avatar: user.avatar,
        rating: a.rating,
        available: a.available,
        specialization: a.specialization,
        completedJobs: a.completedJobs,
        location: user.location,
        address: user.address,
      };
    });

    res.json(formattedAgents);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load agents', error: error.message });
  }
});

// POST /api/customer/reviews
router.post('/reviews', async (req: any, res: any) => {
  try {
    const { bookingId, agentId, rating, comment } = req.body;

    const review = await Review.create({
      bookingId,
      customerId: req.user!._id,
      agentId,
      rating,
      comment,
    });

    // Update agent rating
    if (agentId) {
      const reviews = await Review.find({ agentId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await AgentProfile.findOneAndUpdate(
        { userId: agentId },
        { rating: Math.round(avgRating * 10) / 10 }
      );
    }

    res.status(201).json({ message: 'Review submitted', review });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
});

// GET /api/customer/complaints
router.get('/complaints', async (req: any, res: any) => {
  try {
    const complaints = await Complaint.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load complaints', error: error.message });
  }
});

// POST /api/customer/complaints
router.post('/complaints', async (req: any, res: any) => {
  try {
    const { subject, description } = req.body;
    const complaint = await Complaint.create({
      subject,
      description,
      userId: req.user!._id,
    });
    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to submit complaint', error: error.message });
  }
});

// GET /api/customer/estimate
router.get('/estimate', async (req: any, res: any) => {
  try {
    const area = parseFloat(req.query.area as string) || 0;
    const serviceType = (req.query.serviceType as string) || 'House Cleaning';
    const variant = (req.query.variant as string) || 'Standard';

    let rate = 18; // Base rate per sq ft
    if (variant === 'Deep Cleaning') rate = 25;
    if (variant === 'Emergency') rate = 35;
    if (serviceType === 'Office Cleaning') rate *= 1.2;
    if (serviceType === 'Commercial Cleaning') rate *= 1.5;

    const estimate = Math.round(area * rate);
    res.json({ area, rate, estimate, serviceType, variant });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to calculate estimate', error: error.message });
  }
});

export default router;
