import { Response, NextFunction } from 'express';
import { Item } from '../models/Item.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Helper to format item for consistent frontend response
export const formatItem = (item: any) => {
  const doc = item.toObject ? item.toObject() : item;
  return {
    ...doc,
    id: doc._id.toString(),
  };
};

export const getAllItems = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, category, type, q } = req.query;

    const filter: Record<string, any> = {};

    // Status filter
    if (status) {
      filter.status = status;
    } else {
      // By default, non-admins only see approved items unless querying specific
      if (!req.user || req.user.role !== 'admin') {
        filter.status = 'approved';
      }
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Type filter ('share' | 'donate')
    if (type && type !== 'All') {
      filter.type = (type as string).toLowerCase();
    }

    // Search query
    if (q) {
      filter.$or = [
        { title: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
        { category: { $regex: q as string, $options: 'i' } },
        { subcategory: { $regex: q as string, $options: 'i' } },
      ];
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

export const getItemById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate('owner', 'name email phone department');

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }

    res.json({
      success: true,
      item: formatItem(item),
    });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      title,
      description,
      category,
      subcategory,
      quantity,
      type = 'share',
      imageUrl,
      ownerPhone,
      location,
      timeSlot,
    } = req.body;

    if (!title || !description || !category || !location || !timeSlot) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, location, and time slot.',
      });
      return;
    }

    const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);

    // If an admin creates the item, it can start approved; otherwise it's pending
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const item = await Item.create({
      title,
      description,
      category,
      subcategory: subcategory || '',
      quantity: parsedQty,
      initialQuantity: parsedQty,
      type: type === 'donate' ? 'donate' : 'share',
      status: initialStatus,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      owner: req.user._id,
      ownerName: req.user.name,
      ownerPhone: ownerPhone || req.user.phone || '',
      location,
      timeSlot,
    });

    res.status(201).json({
      success: true,
      message:
        initialStatus === 'approved'
          ? 'Item created and published.'
          : 'Item submitted successfully for admin approval.',
      item: formatItem(item),
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }

    // Check ownership or admin role
    const isOwner = item.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to update this item.',
      });
      return;
    }

    const {
      title,
      description,
      category,
      subcategory,
      quantity,
      type,
      imageUrl,
      ownerPhone,
      location,
      timeSlot,
      status,
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (subcategory !== undefined) item.subcategory = subcategory;
    if (quantity !== undefined) item.quantity = Math.max(0, parseInt(quantity, 10));
    if (type) item.type = type;
    if (imageUrl) item.imageUrl = imageUrl;
    if (ownerPhone !== undefined) item.ownerPhone = ownerPhone;
    if (location) item.location = location;
    if (timeSlot) item.timeSlot = timeSlot;

    // Only admin can change approval status directly via updateItem
    if (status && isAdmin) {
      item.status = status;
    }

    await item.save();

    res.json({
      success: true,
      message: 'Item updated successfully.',
      item: formatItem(item),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }

    const isOwner = item.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this item.',
      });
      return;
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
