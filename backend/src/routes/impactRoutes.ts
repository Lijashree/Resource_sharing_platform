import { Router } from 'express';
import { getImpactStats } from '../controllers/impactController.js';

const router = Router();

router.get('/stats', getImpactStats);

export default router;
