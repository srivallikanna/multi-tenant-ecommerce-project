import { sendOrderConfirmationEmail } from "../services/emailService.js";

const AVAILABLE_COUPONS = [
  { code: 'WELCOME50', type: 'FLAT', discount: 50, minOrder: 199, maxDiscount: 50, description: 'Flat ₹50 OFF on first order' },
  { code: 'SAVE20', type: 'PERCENTAGE', discount: 20, minOrder: 399, maxDiscount: 300, description: '20% OFF up to ₹300' },
  { code: 'MEGA30', type: 'PERCENTAGE', discount: 30, minOrder: 899, maxDiscount: 600, description: '30% OFF up to ₹600' },
  { code: 'FREESHIP', type: 'FREE_SHIPPING', discount: 40, minOrder: 0, maxDiscount: 40, description: 'Free Doorstep Shipping' },
  { code: 'FLAT100', type: 'FLAT', discount: 100, minOrder: 499, maxDiscount: 100, description: 'Flat ₹100 OFF on orders > ₹499' }
];

// Generate Real-time UPI Intent & QR Parameters
export const generateUpiIntent = async (req, res) => {
  try {
    const { amount, orderId, customerName } = req.body;
    const finalAmount = Number(amount || 0).toFixed(2);
    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const vpa = "multitenant.store@okhdfcbank";
    const payeeName = "MultiTenant Store";

    const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR&tn=Order_${orderId || txnId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

    return res.status(200).json({
      success: true,
      transactionId: txnId,
      vpa,
      payeeName,
      amount: finalAmount,
      currency: "INR",
      upiUri,
      qrUrl,
      deepLinks: {
        gpay: upiUri,
        phonepe: upiUri,
        paytm: upiUri,
        bhim: upiUri,
        cred: upiUri
      },
      expiresInSeconds: 300
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Payment / UTR simulation
export const verifyPayment = async (req, res) => {
  try {
    const { paymentMethod, transactionId, utr, amount } = req.body;

    return res.status(200).json({
      success: true,
      status: "COMPLETED",
      paymentMethod: paymentMethod || "UPI",
      transactionId: transactionId || `TXN_${Date.now()}`,
      utr: utr || `UTR${Date.now().toString().slice(-8)}`,
      verifiedAt: new Date().toISOString(),
      message: "Payment successfully verified and confirmed"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Validate Coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const cleanCode = String(code || '').trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      return res.status(400).json({ success: false, message: `Coupon "${cleanCode}" is invalid.` });
    }

    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Min cart value of ₹${coupon.minOrder} required for coupon ${coupon.code}.`
      });
    }

    let discountAmount = 0;
    if (coupon.type === 'FLAT') {
      discountAmount = Math.min(coupon.discount, subtotal);
    } else if (coupon.type === 'PERCENTAGE') {
      const raw = (subtotal * coupon.discount) / 100;
      discountAmount = Math.min(raw, coupon.maxDiscount);
    } else if (coupon.type === 'FREE_SHIPPING') {
      discountAmount = 40;
    }

    return res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountAmount: Math.round(discountAmount * 100) / 100,
        type: coupon.type
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Available Coupons
export const getAvailableCoupons = async (req, res) => {
  return res.status(200).json({
    success: true,
    coupons: AVAILABLE_COUPONS
  });
};

// Stripe Payment Gateway Session Generator
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, customerName, customerEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided for checkout" });
    }

    const sessionId = "cs_stripe_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

    // Trigger Nodemailer transactional email
    await sendOrderConfirmationEmail({
      customerEmail: customerEmail || "customer@example.com",
      customerName: customerName || "Customer",
      orderId: sessionId,
      totalAmount,
      items,
    });

    return res.status(200).json({
      success: true,
      message: "Stripe checkout session initialized successfully",
      sessionId,
      url: `http://localhost:5173/cart?status=success&session_id=${sessionId}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
