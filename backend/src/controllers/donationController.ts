import { Response, NextFunction } from 'express';
import { Item } from '../models/Item.js';
import { DonationPickup } from '../models/DonationPickup.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { formatItem } from './itemController.js';

export const getAllDonations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    let filter: Record<string, any> = { type: 'donate' };

    // Regular users see their own donation listings; NGO or Admin can see all approved donation items
    if (req.user.role === 'user') {
      filter.owner = req.user._id;
    } else {
      filter.status = 'approved';
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items: items.map(formatItem),
    });
  } catch (error) {
    next(error);
  }
};

export const requestPickup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { itemIds, ngoName, contactNumber, pickupDate, notes } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please select at least one item for donation pickup.',
      });
      return;
    }

    if (!ngoName || !contactNumber || !pickupDate) {
      res.status(400).json({
        success: false,
        message: 'Please provide NGO name, contact number, and scheduled pickup date.',
      });
      return;
    }

    // Verify items exist
    const items = await Item.find({ _id: { $in: itemIds } });
    if (items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'None of the selected items were found.',
      });
      return;
    }

    const pickup = await DonationPickup.create({
      items: items.map((i) => i._id),
      requester: req.user._id,
      ngoName,
      contactNumber,
      pickupDate,
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Pickup request submitted successfully! Partner NGO will coordinate within 24 hours.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

export const getPickups = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    let filter: Record<string, any> = {};
    if (req.user.role === 'user') {
      filter.requester = req.user._id;
    }

    const pickups = await DonationPickup.find(filter)
      .populate('items')
      .populate('requester', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    next(error);
  }
};
