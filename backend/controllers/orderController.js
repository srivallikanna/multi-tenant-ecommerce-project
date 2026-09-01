import Order from "../models/order.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// In-memory fallback orders array
let memoryOrders = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Create Order (Customer)
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, customerName, customerEmail } = req.body;
    const customerId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items cannot be empty" });
    }

    if (isDbConnected()) {
      const order = await Order.create({
        customerId,
        customerName: customerName || "Customer",
        customerEmail: customerEmail || "customer@example.com",
        items,
        totalAmount,
        shippingAddress: shippingAddress || "Default Delivery Address",
        status: "Pending",
      });
      return res.status(201).json({ success: true, message: "Order placed successfully", order });
    } else {
      const newOrder = {
        _id: "ord_" + Date.now(),
        customerId: String(customerId),
        customerName: customerName || "Customer",
        customerEmail: customerEmail || "customer@example.com",
        items,
        totalAmount,
        shippingAddress: shippingAddress || "Default Delivery Address",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      memoryOrders.unshift(newOrder);
      return res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customer Orders
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;

    if (isDbConnected()) {
      const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    } else {
      const orders = memoryOrders.filter((o) => String(o.customerId) === String(customerId));
      return res.status(200).json({ success: true, orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Orders (Orders containing vendor's products or vendor's items)
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.id;

    if (isDbConnected()) {
      const orders = await Order.find({ "items.vendorId": vendorId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    } else {
      // In-Memory search or return all orders if vendorId matches or all vendor orders
      const orders = memoryOrders.filter((o) =>
        o.items.some((item) => String(item.vendorId) === String(vendorId) || !item.vendorId)
      );
      return res.status(200).json({ success: true, orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Vendor)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const order = await Order.findById(id);
      if (order) {
        order.status = status;
        await order.save();
        return res.status(200).json({ success: true, message: "Order status updated", order });
      }
    }

    const index = memoryOrders.findIndex((o) => String(o._id) === String(id));
    if (index !== -1) {
      memoryOrders[index].status = status;
      return res.status(200).json({
        success: true,
        message: "Order status updated",
        order: memoryOrders[index],
      });
    }

    return res.status(404).json({ success: false, message: "Order not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
