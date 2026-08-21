import { sendOrderConfirmationEmail } from "../services/emailService.js";

// Stripe Payment Gateway Session Generator
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, customerName, customerEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided for checkout" });
    }

    // Stripe checkout session simulation payload
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
