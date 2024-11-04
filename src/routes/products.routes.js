import { Router } from 'express';
import {
  createProducts,
  deleteProductsById,
  getProducts,
  getProductsById,
  updateProductsById,
} from '../controllers/products.controllers.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductsById);
router.post('/', createProducts);
router.put('/:id', updateProductsById);
router.delete('/:id', deleteProductsById);

export default router;
