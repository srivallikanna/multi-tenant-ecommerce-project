import express from "express";
import {
  getPlatformStats,
  getRevenueAnalytics,
  getAllVendors,
  getVendorDetails,
  updateVendorStatus,
  getPayouts,
  updatePayoutStatus,
  getActivityLogs,
  postAnnouncement,
  updatePlatformSettings,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getPlatformStats);
router.get("/revenue", protect, isAdmin, getRevenueAnalytics);
router.get("/vendors", protect, isAdmin, getAllVendors);
router.get("/vendors/:id", protect, isAdmin, getVendorDetails);
router.put("/vendors/:id/status", protect, isAdmin, updateVendorStatus);
router.get("/payouts", protect, isAdmin, getPayouts);
router.put("/payouts/:id/status", protect, isAdmin, updatePayoutStatus);
router.get("/activity-logs", protect, isAdmin, getActivityLogs);
router.post("/announcement", protect, isAdmin, postAnnouncement);
router.put("/settings", protect, isAdmin, updatePlatformSettings);

export default router;

