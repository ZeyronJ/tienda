import { Router } from 'express';
import {
  createOrders,
  deleteOrdersById,
  getOrders,
  getOrdersById,
  getOrdersByUserId,
} from '../controllers/orders.controllers.js';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrdersById);
router.get('/user/:id', getOrdersByUserId);
router.post('/', createOrders);
// router.put('/:id');
router.delete('/:id', deleteOrdersById);

export default router;
