import { RequestHandler } from "express";
import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import Booking from '../models/Booking';
import AgentProfile from '../models/AgentProfile';

const router = Router();

// All agent routes require authentication
router.use(authenticate as any, requireRole('agent') as any);

// GET /api/agent/dashboard
router.get('/dashboard', async (req: any, res: any) => {
  try {
    const userId = req.user!._id;
    const profile = await AgentProfile.findOne({ userId });

    const bookings = await Booking.find({ agentId: userId });
    const pendingBookings = await Booking.find({ agentId: userId, status: 'pending' });
    const activeBookings = bookings.filter((b) => b.status === 'in-progress');
    const completedBookings = bookings.filter((b) => b.status === 'completed');

    // Requests without an assigned agent yet (available for pickup)
    const unassignedRequests = await Booking.find({ status: 'pending', agentId: { $exists: false } })
      .populate('customerId', 'fullName address')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        pendingRequests: pendingBookings.length + unassignedRequests.length,
        activeJobs: activeBookings.length,
        completedJobs: profile?.completedJobs || completedBookings.length,
        rating: profile?.rating || 0,
      },
      recentRequests: unassignedRequests,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
});

// GET /api/agent/requests
router.get('/requests', async (req: any, res: any) => {
  try {
    const userId = req.user!._id;

    // Get bookings assigned to this agent OR unassigned pending bookings
    const requests = await Booking.find({
      $or: [
        { agentId: userId },
        { status: 'pending', agentId: { $exists: false } },
      ],
    })
      .populate('customerId', 'fullName address phone')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map((r) => {
      const customer = r.customerId as any;
      return {
        id: r._id,
        customerName: customer?.fullName || 'Unknown',
        serviceType: r.serviceType,
        variant: r.variant,
        date: r.date,
        status: r.status,
        address: r.address || customer?.address || '',
        amount: r.amount,
      };
    });

    res.json(formattedRequests);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to load requests', error: error.message });
  }
});

// PUT /api/agent/requests/:id
router.put('/requests/:id', async (req: any, res: any) => {
  try {
    const { action } = req.body; // 'approved' or 'rejected'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    booking.status = action;
    if (action === 'approved') {
      booking.agentId = req.user!._id;
    }
    await booking.save();

    res.json({ message: `Request ${action}`, booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update request', error: error.message });
  }
});

// PUT /api/agent/availability
router.put('/availability', async (req: any, res: any) => {
  try {
    const { available } = req.body;
    let profile = await AgentProfile.findOne({ userId: req.user!._id });

    if (!profile) {
      profile = await AgentProfile.create({ userId: req.user!._id, available });
    } else {
      profile.available = available;
      await profile.save();
    }

    res.json({ message: `Availability set to ${available}`, available: profile.available });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
});

// GET /api/agent/availability
router.get('/availability', async (req: any, res: any) => {
  try {
    const profile = await AgentProfile.findOne({ userId: req.user!._id });
    res.json({ available: profile?.available ?? true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get availability', error: error.message });
  }
});

// POST /api/agent/attendance
router.post('/attendance', async (req: any, res: any) => {
  try {
    let profile = await AgentProfile.findOne({ userId: req.user!._id });
    if (!profile) {
      profile = await AgentProfile.create({ userId: req.user!._id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyMarked = profile.attendance.some((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

    if (alreadyMarked) {
      res.json({ message: 'Attendance already marked for today', marked: true });
      return;
    }

    profile.attendance.push(new Date());
    await profile.save();

    res.json({ message: 'Attendance marked', marked: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
});

// GET /api/agent/attendance
router.get('/attendance', async (req: any, res: any) => {
  try {
    const profile = await AgentProfile.findOne({ userId: req.user!._id });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const markedToday = profile?.attendance.some((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    }) || false;

    res.json({
      markedToday,
      attendance: profile?.attendance || [],
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get attendance', error: error.message });
  }
});

// POST /api/agent/portfolio
router.post('/portfolio', upload.array('images', 6), async (req: any, res: any) => {
  try {
    let profile = await AgentProfile.findOne({ userId: req.user!._id });
    if (!profile) {
      profile = await AgentProfile.create({ userId: req.user!._id });
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    profile.portfolioImages.push(...imageUrls);
    await profile.save();

    res.json({ message: 'Images uploaded', images: profile.portfolioImages });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to upload portfolio', error: error.message });
  }
});

// GET /api/agent/portfolio
router.get('/portfolio', async (req: any, res: any) => {
  try {
    const profile = await AgentProfile.findOne({ userId: req.user!._id });
    res.json({ images: profile?.portfolioImages || [] });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get portfolio', error: error.message });
  }
});

// POST /api/agent/documents
router.post('/documents', upload.single('document'), async (req: any, res: any) => {
  try {
    let profile = await AgentProfile.findOne({ userId: req.user!._id });
    if (!profile) {
      profile = await AgentProfile.create({ userId: req.user!._id });
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    profile.documents.push({
      type: req.body.documentType || 'General',
      url: `/uploads/${file.filename}`,
      status: 'pending',
    });
    await profile.save();

    res.json({ message: 'Document uploaded', documents: profile.documents });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
});

// GET /api/agent/documents
router.get('/documents', async (req: any, res: any) => {
  try {
    const profile = await AgentProfile.findOne({ userId: req.user!._id });
    res.json({ documents: profile?.documents || [] });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get documents', error: error.message });
  }
});

// PUT /api/agent/bookings/:id/status
router.put('/bookings/:id/status', async (req: any, res: any) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({
      _id: req.params.id,
      agentId: req.user!._id,
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    booking.status = status;
    await booking.save();

    // Update completed jobs count if completed
    if (status === 'completed') {
      await AgentProfile.findOneAndUpdate(
        { userId: req.user!._id },
        { $inc: { completedJobs: 1 } }
      );
    }

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

// GET /api/agent/profile
router.get('/profile', async (req: any, res: any) => {
  try {
    const profile = await AgentProfile.findOne({ userId: req.user!._id });
    res.json(profile || {});
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

// PUT /api/agent/profile
router.put('/profile', async (req: any, res: any) => {
  try {
    const { specialization } = req.body;
    let profile = await AgentProfile.findOne({ userId: req.user!._id });

    if (!profile) {
      profile = await AgentProfile.create({
        userId: req.user!._id,
        specialization,
      });
    } else {
      if (specialization) profile.specialization = specialization;
      await profile.save();
    }

    res.json({ message: 'Profile updated', profile });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

export default router;
