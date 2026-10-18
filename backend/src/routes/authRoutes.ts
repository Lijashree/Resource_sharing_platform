import { Router } from 'express';
import { signup, signin, getMe, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

export default router;
