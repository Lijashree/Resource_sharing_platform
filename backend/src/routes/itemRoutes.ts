import { Router } from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getAllItems);
router.get('/:id', optionalAuth, getItemById);
router.post('/', verifyToken, createItem);
router.put('/:id', verifyToken, updateItem);
router.delete('/:id', verifyToken, deleteItem);

export default router;
