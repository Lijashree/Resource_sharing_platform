import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  approveItem,
  rejectItem,
  getDatabaseOverview,
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/items/:id/approve', approveItem);
router.put('/items/:id/reject', rejectItem);
router.get('/database', getDatabaseOverview);

export default router;
