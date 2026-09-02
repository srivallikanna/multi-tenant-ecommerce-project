import express from "express";
import {
  createCheckoutSession,
  generateUpiIntent,
  verifyPayment,
  validateCoupon,
  getAvailableCoupons,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/upi-intent", generateUpiIntent);
router.post("/verify-payment", verifyPayment);
router.post("/validate-coupon", validateCoupon);
router.get("/coupons", getAvailableCoupons);

export default router;
