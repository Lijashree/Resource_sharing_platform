import { Router } from 'express';
import {
  getAllDonations,
  requestPickup,
  getPickups,
} from '../controllers/donationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken);

router.get('/', getAllDonations);
router.post('/pickup', requestPickup);
router.get('/pickups', getPickups);

export default router;
