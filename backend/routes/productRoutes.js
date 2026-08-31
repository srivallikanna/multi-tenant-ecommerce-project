import express from 'express';
import { createProduct, getProducts } from '../controllers/productControllers.js';

const router = express.Router();

router.post('/add', createProduct);
router.get('/', getProducts);

export default router;