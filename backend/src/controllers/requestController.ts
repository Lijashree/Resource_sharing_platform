import { Response, NextFunction } from 'express';
import { RequestModel } from '../models/Request.js';
import { Item } from '../models/Item.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const formatRequest = (reqDoc: any) => {
  const doc = reqDoc.toObject ? reqDoc.toObject() : reqDoc;
  return {
    ...doc,
    id: doc._id.toString(),
    itemId: doc.item?._id ? doc.item._id.toString() : (doc.item?.toString() || doc.itemId),
    requesterId: doc.requester?._id ? doc.requester._id.toString() : (doc.requester?.toString() || doc.requesterId),
  };
};

export const createRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { itemId, requestedQuantity = 1, message = '' } = req.body;

    if (!itemId) {
      res.status(400).json({ success: false, message: 'Item ID is required.' });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }

    if (item.status !== 'approved') {
      res.status(400).json({
        success: false,
        message: 'This item is not currently approved for requests.',
      });
      return;
    }

    // Prevent requesting own item
    if (item.owner.toString() === req.user._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'You cannot request your own item.',
      });
      return;
    }

    const qty = Math.max(1, parseInt(requestedQuantity, 10) || 1);

    if (item.quantity < qty) {
      res.status(400).json({
        success: false,
        message: `Requested quantity (${qty}) exceeds available inventory (${item.quantity}).`,
      });
      return;
    }

    // Check if user already has a pending request for this item
    const existingPending = await RequestModel.findOne({
      item: item._id,
      requester: req.user._id,
      status: 'pending',
    });

    if (existingPending) {
      res.status(400).json({
        success: false,
        message: 'You already have a pending request for this item.',
      });
      return;
    }

    const newRequest = await RequestModel.create({
      item: item._id,
      itemTitle: item.title,
      itemOwner: item.owner,
      requester: req.user._id,
      requesterName: req.user.name,
      requestedQuantity: qty,
      message,
      status: 'pending',
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    });

    // Populate item before returning
    const populated = await RequestModel.findById(newRequest._id)
      .populate('item')
      .populate('requester', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Request sent successfully!',
      request: formatRequest(populated),
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const requests = await RequestModel.find({ requester: req.user._id })
      .populate('item')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests: requests.map(formatRequest),
    });
  } catch (error) {
    next(error);
  }
};

export const getReceivedRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const requests = await RequestModel.find({ itemOwner: req.user._id })
      .populate('item')
      .populate('requester', 'name email phone department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests: requests.map(formatRequest),
    });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (
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
    const request = await RequestModel.findById(id).populate('item');

    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found.' });
      return;
    }

    const isOwner = request.itemOwner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this request.',
      });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: `Request is already ${request.status}.`,
      });
      return;
    }

    const item = await Item.findById(request.item);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item no longer exists.' });
      return;
    }

    if (item.quantity < request.requestedQuantity) {
      res.status(400).json({
        success: false,
        message: `Insufficient inventory: available (${item.quantity}) is less than requested (${request.requestedQuantity}).`,
      });
      return;
    }

    // Decrement item quantity safely
    item.quantity = Math.max(0, item.quantity - request.requestedQuantity);
    await item.save();

    request.status = 'approved';
    await request.save();

    const updated = await RequestModel.findById(request._id).populate('item');

    res.json({
      success: true,
      message: 'Request approved successfully.',
      request: formatRequest(updated),
    });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (
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
    const request = await RequestModel.findById(id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found.' });
      return;
    }

    const isOwner = request.itemOwner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this request.',
      });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: `Request is already ${request.status}.`,
      });
      return;
    }

    request.status = 'rejected';
    await request.save();

    const updated = await RequestModel.findById(request._id).populate('item');

    res.json({
      success: true,
      message: 'Request rejected.',
      request: formatRequest(updated),
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (
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
    const request = await RequestModel.findById(id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found.' });
      return;
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests.',
      });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: `Cannot cancel request with status ${request.status}.`,
      });
      return;
    }

    request.status = 'cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Request cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};
