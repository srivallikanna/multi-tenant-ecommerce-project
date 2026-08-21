import express from "express";
import {
  getAllProducts,
  getProductById,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, isVendor } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/detail/:id", getProductById);

// Vendor Protected routes
router.get("/vendor/my-products", protect, isVendor, getVendorProducts);
router.post("/", protect, isVendor, createProduct);
router.put("/:id", protect, isVendor, updateProduct);
router.delete("/:id", protect, isVendor, deleteProduct);

export default router;
