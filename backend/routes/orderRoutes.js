import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, optionalAuth, isVendor } from "../middleware/authMiddleware.js";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

const router = express.Router();

// Compatibility routes for user order lookup & simple placement
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/place", async (req, res) => {
  try {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ message: "User ID and Address are required" });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address,
      status: "Placed",
    });
    await order.save();
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to place order" });
  }
});

// Full controller routes
router.post("/", optionalAuth, createOrder);
router.get("/my-orders", optionalAuth, getCustomerOrders);
router.get("/vendor-orders", protect, isVendor, getVendorOrders);
router.put("/:id/status", protect, isVendor, updateOrderStatus);

export default router;
