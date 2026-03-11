import { RequestHandler } from "express";
import { Router, Response } from 'express';
import axios from 'axios';
import { authenticate, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import AgentProfile from '../models/AgentProfile';

const router = Router();

router.use(authenticate as any);

// POST /api/maps/geocode
router.post('/geocode', async (req: any, res: any) => {
  try {
    const { address } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      // Fallback: return mock coordinates for development
      const mockCoords: Record<string, [number, number]> = {
        default: [12.9716, 77.5946], // Bangalore
      };
      res.json({
        lat: mockCoords.default[0],
        lng: mockCoords.default[1],
        formatted_address: address,
        source: 'mock',
      });
      return;
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    if (response.data.results.length === 0) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    const formatted_address = response.data.results[0].formatted_address;

    // Update user's location
    await User.findByIdAndUpdate(req.user!._id, {
      location: { type: 'Point', coordinates: [lng, lat] },
    });

    res.json({ lat, lng, formatted_address, source: 'google' });
  } catch (error: any) {
    res.status(500).json({ message: 'Geocoding failed', error: error.message });
  }
});

// GET /api/maps/reverse-geocode
router.get('/reverse-geocode', async (req: any, res: any) => {
  try {
    const { lat, lng } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      res.json({ formatted_address: 'Bangalore, Karnataka, India (Mock)' });
      return;
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (response.data.results.length === 0) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    const formatted_address = response.data.results[0].formatted_address;
    res.json({ formatted_address });
  } catch (error: any) {
    res.status(500).json({ message: 'Reverse geocoding failed', error: error.message });
  }
});

// GET /api/maps/nearby-agents
router.get('/nearby-agents', async (req: any, res: any) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const maxDistance = parseInt(req.query.distance as string) || 10000; // 10km default

    let agents;

    if (!isNaN(lat) && !isNaN(lng)) {
      // Find users near the coordinates
      const nearbyUsers = await User.find({
        role: 'agent',
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: maxDistance,
          },
        },
      });

      const userIds = nearbyUsers.map((u) => u._id);
      agents = await AgentProfile.find({ userId: { $in: userIds }, available: true })
        .populate('userId', 'fullName avatar address location');
    } else {
      // Return all available agents if no coordinates
      agents = await AgentProfile.find({ available: true })
        .populate('userId', 'fullName avatar address location');
    }

    const result = agents.map((a) => {
      const user = a.userId as any;
      return {
        id: a._id,
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

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to find nearby agents', error: error.message });
  }
});

export default router;
