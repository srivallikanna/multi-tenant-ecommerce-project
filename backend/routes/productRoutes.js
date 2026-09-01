import express from 'express';
import { createProduct, getProducts } from '../controllers/productControllers.js';

const router = express.Router();

router.post('/add', createProduct);
router.get('/', getProducts);

import {
  getAllProducts,
  getProductById,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, isVendor } from "../middleware/authMiddleware.js";


// Public routes
router.get("/", getAllProducts);
router.get("/detail/:id", getProductById);

// Vendor Protected routes
router.get("/vendor/my-products", protect, isVendor, getVendorProducts);
router.post("/", protect, isVendor, createProduct);
router.put("/:id", protect, isVendor, updateProduct);
router.delete("/:id", protect, isVendor, deleteProduct);

export default router;
