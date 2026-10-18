import { Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Item } from '../models/Item.js';
import { RequestModel } from '../models/Request.js';
import { DonationPickup } from '../models/DonationPickup.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { formatItem } from './itemController.js';
import { formatRequest } from './requestController.js';

export const getAdminStats = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [totalItems, pendingItems, totalUsers, activeRequests] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      RequestModel.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      success: true,
      stats: {
        totalItems,
        pendingItems,
        totalUsers,
        activeRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Aggregate items listed per user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const itemsListed = await Item.countDocuments({ owner: u._id });
        return {
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone || 'N/A',
          department: u.department || 'General',
          itemsListed,
          createdAt: u.createdAt,
        };
      })
    );

    res.json({
      success: true,
      count: usersWithCounts.length,
      users: usersWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const approveItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }

    item.status = 'approved';
    await item.save();

    res.json({
      success: true,
      message: 'Item approved successfully.',
      item: formatItem(item),
    });
  } catch (error) {
    next(error);
  }
};

export const rejectItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }

    item.status = 'rejected';
    await item.save();

    res.json({
      success: true,
      message: 'Item rejected.',
      item: formatItem(item),
    });
  } catch (error) {
    next(error);
  }
};

export const getDatabaseOverview = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [users, items, requests, pickups] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }),
      Item.find().sort({ createdAt: -1 }),
      RequestModel.find().populate('item', 'title category').sort({ createdAt: -1 }),
      DonationPickup.find().sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      database: {
        engine: 'MongoDB',
        collections: {
          users: users.map((u) => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            phone: u.phone,
            department: u.department,
            createdAt: u.createdAt,
          })),
          items: items.map(formatItem),
          requests: requests.map(formatRequest),
          pickups: pickups.map((p) => ({
            id: p._id.toString(),
            ngoName: p.ngoName,
            contactNumber: p.contactNumber,
            pickupDate: p.pickupDate,
            status: p.status,
            itemCount: p.items.length,
            createdAt: p.createdAt,
          })),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
