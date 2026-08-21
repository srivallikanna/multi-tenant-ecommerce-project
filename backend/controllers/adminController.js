import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import mongoose from "mongoose";

let memoryVendors = [
  { 
    id: "v_101", 
    name: "Gaurav's Store", 
    email: "gaurav@store.com", 
    tenantSlug: "gaurav-store",
    plan: "Enterprise",
    role: "vendor", 
    status: "Active", 
    joinedAt: "2026-01-15", 
    salesCount: 184, 
    revenue: 5420.00,
    commissionPaid: 542.00,
    netEarnings: 4878.00,
    payoutStatus: "Paid",
    productsCount: 12,
    rating: 4.9,
    storeDescription: "High-fidelity studio audio equipment, wireless acoustics, and custom mechanical peripherals by Gaurav."
  },
  { 
    id: "v_102", 
    name: "Srivalli's Store", 
    email: "srivalli@store.com", 
    tenantSlug: "srivalli-store",
    plan: "Enterprise",
    role: "vendor", 
    status: "Active", 
    joinedAt: "2026-02-01", 
    salesCount: 142, 
    revenue: 4180.00,
    commissionPaid: 418.00,
    netEarnings: 3762.00,
    payoutStatus: "Pending Approval",
    productsCount: 14,
    rating: 4.9,
    storeDescription: "Handcrafted luxury watches, minimalist leather timepieces, and accessories curated by Srivalli."
  },
  { 
    id: "v_103", 
    name: "Riya's Store", 
    email: "riya@store.com", 
    tenantSlug: "riya-store",
    plan: "Pro",
    role: "vendor", 
    status: "Active", 
    joinedAt: "2026-02-10", 
    salesCount: 156, 
    revenue: 3340.00,
    commissionPaid: 334.00,
    netEarnings: 3006.00,
    payoutStatus: "Paid",
    productsCount: 10,
    rating: 4.9,
    storeDescription: "Botanical clean skincare formulations, hyaluronic radiance serums, and glow essentials by Riya."
  },
  { 
    id: "v_104", 
    name: "Anuj's Store", 
    email: "anuj@store.com", 
    tenantSlug: "anuj-store",
    plan: "Pro",
    role: "vendor", 
    status: "Active", 
    joinedAt: "2026-02-12", 
    salesCount: 128, 
    revenue: 2910.00,
    commissionPaid: 291.00,
    netEarnings: 2619.00,
    payoutStatus: "Paid",
    productsCount: 9,
    rating: 4.8,
    storeDescription: "Contemporary urban streetwear, heavyweight organic cotton apparel, denim, and footwear by Anuj."
  },
];

let memoryPayouts = [
  { id: "po_1", vendorId: "v_102", vendorName: "Srivalli's Store", amount: 2646.00, date: "2026-08-18", status: "Pending", paymentMethod: "Direct Deposit (Stripe)" },
  { id: "po_2", vendorId: "v_104", vendorName: "Anuj's Store", amount: 1656.00, date: "2026-08-19", status: "Pending", paymentMethod: "Bank Wire Transfer" },
  { id: "po_3", vendorId: "v_101", vendorName: "Gaurav's Store", amount: 3825.00, date: "2026-08-10", status: "Approved & Paid", paymentMethod: "Direct Deposit (Stripe)" },
  { id: "po_4", vendorId: "v_103", vendorName: "Riya's Store", amount: 2835.00, date: "2026-08-11", status: "Approved & Paid", paymentMethod: "Direct Deposit (Stripe)" },
];

let memoryActivityLogs = [
  { id: "act_1", timestamp: "2026-08-20 03:30", type: "Security", message: "Super Admin logged into Control Center", user: "Admin", status: "Success" },
  { id: "act_2", timestamp: "2026-08-19 18:45", type: "Financial", message: "Payout request submitted by Chrono Style ($2,646.00)", user: "chrono@vendor.com", status: "Pending" },
  { id: "act_3", timestamp: "2026-08-19 14:12", type: "Inventory", message: "New item 'Smartwatch Ultra OLED' published by TechGear Co.", user: "techgear@vendor.com", status: "Info" },
  { id: "act_4", timestamp: "2026-08-18 11:05", type: "Vendor", message: "New store tenant 'Velvet Beauty' onboarded automatically", user: "System", status: "Success" },
  { id: "act_5", timestamp: "2026-08-17 09:20", type: "Settings", message: "Platform commission rate updated to 10%", user: "Admin", status: "Success" },
];

let platformSettings = {
  commissionRate: 10,
  payoutSchedule: "Weekly",
  autoApproveVendors: true,
  maintenanceMode: false,
  announcementNotice: "Welcome to the Multi-Tenant E-Commerce Platform Super Admin Center!",
};

const isDbConnected = () => mongoose.connection.readyState === 1;

// Get Platform Metrics & Analytics
export const getPlatformStats = async (req, res) => {
  try {
    let totalVendors = memoryVendors.length;
    let totalCustomers = 142;
    let totalProductsCount = 50;
    let totalGMV = 14850.00;

    if (isDbConnected()) {
      totalVendors = (await User.countDocuments({ role: "vendor" })) || totalVendors;
      totalCustomers = (await User.countDocuments({ role: "customer" })) || totalCustomers;
      totalProductsCount = (await Product.countDocuments()) || totalProductsCount;
    }

    const platformCommissionEarned = (totalGMV * platformSettings.commissionRate) / 100;
    const pendingPayoutsTotal = memoryPayouts
      .filter((p) => p.status === "Pending")
      .reduce((sum, p) => sum + p.amount, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalVendors,
        totalCustomers,
        totalProductsCount,
        totalGMV,
        platformCommissionEarned,
        pendingPayoutsTotal,
        activeTenants: memoryVendors.filter((v) => v.status === "Active").length,
        suspendedTenants: memoryVendors.filter((v) => v.status === "Suspended").length,
      },
      settings: platformSettings,
      activityLogs: memoryActivityLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Vendor Tenants
export const getAllVendors = async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbVendors = await User.find({ role: "vendor" }).select("-password");
      if (dbVendors && dbVendors.length > 0) {
        return res.status(200).json({ success: true, vendors: dbVendors });
      }
    }
    return res.status(200).json({ success: true, vendors: memoryVendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Vendor Details
export const getVendorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = memoryVendors.find((v) => String(v.id) === String(id) || String(v.tenantSlug) === String(id));
    if (vendor) {
      return res.status(200).json({ success: true, vendor });
    }
    return res.status(404).json({ success: false, message: "Vendor not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Vendor Status (Approve / Suspend Tenant)
export const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const vendor = memoryVendors.find((v) => String(v.id) === String(id));
    if (vendor) {
      vendor.status = status;
      memoryActivityLogs.unshift({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        type: "Vendor",
        message: `Vendor tenant '${vendor.name}' status set to ${status}`,
        user: "Admin",
        status: status === "Active" ? "Success" : "Warning",
      });
      return res.status(200).json({ success: true, message: `Vendor status set to ${status}`, vendor });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const userVendor = await User.findById(id);
      if (userVendor) {
        userVendor.status = status;
        await userVendor.save();
        return res.status(200).json({ success: true, message: `Vendor status set to ${status}`, vendor: userVendor });
      }
    }

    return res.status(404).json({ success: false, message: "Vendor tenant not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Financial Payout Requests
export const getPayouts = async (req, res) => {
  try {
    return res.status(200).json({ success: true, payouts: memoryPayouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process Payout Status (Approve / Mark Paid)
export const updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payout = memoryPayouts.find((p) => String(p.id) === String(id));
    if (payout) {
      payout.status = status;
      memoryActivityLogs.unshift({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        type: "Financial",
        message: `Payout of $${payout.amount.toFixed(2)} for ${payout.vendorName} updated to ${status}`,
        user: "Admin",
        status: "Success",
      });
      return res.status(200).json({ success: true, message: `Payout status updated to ${status}`, payout });
    }
    return res.status(404).json({ success: false, message: "Payout record not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Activity Logs
export const getActivityLogs = async (req, res) => {
  try {
    return res.status(200).json({ success: true, activityLogs: memoryActivityLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Post System Announcement Notice
export const postAnnouncement = async (req, res) => {
  try {
    const { announcementNotice } = req.body;
    if (announcementNotice !== undefined) {
      platformSettings.announcementNotice = announcementNotice;
      memoryActivityLogs.unshift({
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        type: "System",
        message: `New platform broadcast message published`,
        user: "Admin",
        status: "Info",
      });
    }
    return res.status(200).json({ success: true, message: "Platform notice updated", settings: platformSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Platform Settings
export const updatePlatformSettings = async (req, res) => {
  try {
    const { commissionRate, payoutSchedule, autoApproveVendors, maintenanceMode, announcementNotice } = req.body;
    if (commissionRate !== undefined) platformSettings.commissionRate = Number(commissionRate);
    if (payoutSchedule) platformSettings.payoutSchedule = payoutSchedule;
    if (autoApproveVendors !== undefined) platformSettings.autoApproveVendors = autoApproveVendors;
    if (maintenanceMode !== undefined) platformSettings.maintenanceMode = maintenanceMode;
    if (announcementNotice !== undefined) platformSettings.announcementNotice = announcementNotice;

    memoryActivityLogs.unshift({
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      type: "Settings",
      message: `Platform settings updated (Commission: ${platformSettings.commissionRate}%, Payouts: ${platformSettings.payoutSchedule})`,
      user: "Admin",
      status: "Success",
    });

    return res.status(200).json({
      success: true,
      message: "Platform settings updated successfully",
      settings: platformSettings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

