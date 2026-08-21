import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, isVendor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getCustomerOrders);
router.get("/vendor-orders", protect, isVendor, getVendorOrders);
router.put("/:id/status", protect, isVendor, updateOrderStatus);

export default router;
