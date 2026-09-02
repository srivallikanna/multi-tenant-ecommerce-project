import Order from "../models/order.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// In-memory fallback orders array
let memoryOrders = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Create Order (Customer)
export const createOrder = async (req, res) => {
  try {
    const {
      _id,
      items,
      totalAmount,
      totalPrice,
      shippingAddress,
      address,
      paymentMethod,
      coupon,
      customerName,
      customerEmail,
    } = req.body;

    const customerId = req.user?.id || req.body.customerId || 'cust_' + Date.now();

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items cannot be empty" });
    }

    const orderId = _id || "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const resolvedAddress =
      typeof shippingAddress === "string"
        ? shippingAddress
        : address
        ? `${address.fullName || ''}, ${address.address || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''} (Ph: ${address.mobile || ''})`
        : "Standard Delivery Address";

    if (isDbConnected()) {
      try {
        const order = await Order.create({
          customerId,
          customerName: customerName || (address && address.fullName) || "Valued Customer",
          customerEmail: customerEmail || "customer@example.com",
          items: items.map((it) => ({
            productId: it.productId || it._id || "prod_default",
            name: it.name,
            price: it.price,
            quantity: it.quantity || 1,
            image: it.image,
            vendorId: it.vendorId,
          })),
          totalAmount: totalAmount || totalPrice || 0,
          shippingAddress: resolvedAddress,
          status: "Pending",
        });
        return res.status(201).json({ success: true, message: "Order placed successfully", order });
      } catch (dbErr) {
        console.warn("DB Create Order fallback to memory:", dbErr.message);
      }
    }

    const newOrder = {
      _id: orderId,
      customerId: String(customerId),
      customerName: customerName || (address && address.fullName) || "Valued Customer",
      customerEmail: customerEmail || "customer@example.com",
      items: items.map((it) => ({
        _id: it._id || it.productId || "prod_item",
        productId: it.productId || it._id || "prod_default",
        name: it.name,
        price: it.price,
        quantity: it.quantity || 1,
        image: it.image,
        vendorName: it.vendorName || "Verified Store",
      })),
      totalAmount: totalAmount || totalPrice || 0,
      shippingAddress: resolvedAddress,
      addressObj: address,
      paymentMethod: paymentMethod || "UPI (Verified)",
      coupon: coupon || null,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    memoryOrders.unshift(newOrder);
    return res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customer Orders
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user?.id;

    if (isDbConnected() && customerId) {
      const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.status(200).json({ success: true, orders });
      }
    }

    return res.status(200).json({ success: true, orders: memoryOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Orders
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user?.id;

    if (isDbConnected() && vendorId) {
      const orders = await Order.find({ "items.vendorId": vendorId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    } else {
      return res.status(200).json({ success: true, orders: memoryOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Vendor/Admin)
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
