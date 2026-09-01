import express from 'express';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';

const router = express.Router();

console.log("ORDER ROUTES LOADED");

// GET MY ORDERS
router.get('/user/:userId', async (req, res) => {
  console.log("GET MY ORDERS HIT:", req.params.userId);
  
  try {
    const orders = await Order.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get Orders Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PLACE ORDER
router.post('/place', async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    if (!address) {
      return res.status(400).json({
        message: 'Address is required'
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty'
      });
    }

    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address,
      status: 'Placed'
    });

    await order.save();

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order
    });

  } catch (error) {
    console.error('Order Error:', error);

    res.status(500).json({
      message: error.message || 'Failed to place order'
    });
  }
});

import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, isVendor } from "../middleware/authMiddleware.js";


router.post("/", protect, createOrder);
router.get("/my-orders", protect, getCustomerOrders);
router.get("/vendor-orders", protect, isVendor, getVendorOrders);
router.put("/:id/status", protect, isVendor, updateOrderStatus);

export default router;
