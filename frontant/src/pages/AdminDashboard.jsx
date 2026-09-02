import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EnhancedRevenueChart from "../components/EnhancedRevenueChart";
import CategoryBreakdownChart from "../components/CategoryBreakdownChart";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, vendors, products, payouts, activity, settings
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [timeframe, setTimeframe] = useState("7d"); // 7d, 30d, 1y

  // Selected items for modals
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Platform Metrics & Data
  const [stats, setStats] = useState({
    totalVendors: 7,
    totalCustomers: 142,
    totalProductsCount: 50,
    totalGMV: 14850.0,
    platformCommissionEarned: 1485.0,
    pendingPayoutsTotal: 4302.0,
    activeTenants: 7,
    suspendedTenants: 0,
  });

  const [platformSettings, setPlatformSettings] = useState({
    commissionRate: 10,
    payoutSchedule: "Weekly",
    autoApproveVendors: true,
    maintenanceMode: false,
    announcementNotice: "Welcome to the Multi-Tenant E-Commerce Platform Super Admin Center!",
  });

  const [announcementInput, setAnnouncementInput] = useState(
    "Welcome to the Multi-Tenant E-Commerce Platform Super Admin Center!"
  );

  // Interactive Sandbox Calculator
  const [testOrderAmount, setTestOrderAmount] = useState(250);

  // Vendor Tenants Data
  const [vendors, setVendors] = useState([
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
      revenue: 5420.0,
      commissionPaid: 542.0,
      netEarnings: 4878.0,
      payoutStatus: "Paid",
      productsCount: 12,
      rating: 4.9,
      storeDescription: "High-fidelity studio audio equipment, wireless acoustics, and custom mechanical peripherals by Gaurav.",
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
      revenue: 4180.0,
      commissionPaid: 418.0,
      netEarnings: 3762.0,
      payoutStatus: "Pending Approval",
      productsCount: 14,
      rating: 4.9,
      storeDescription: "Handcrafted luxury watches, minimalist leather timepieces, and accessories curated by Srivalli.",
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
      revenue: 3340.0,
      commissionPaid: 334.0,
      netEarnings: 3006.0,
      payoutStatus: "Paid",
      productsCount: 10,
      rating: 4.9,
      storeDescription: "Botanical clean skincare formulations, hyaluronic radiance serums, and glow essentials by Riya.",
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
      revenue: 2910.0,
      commissionPaid: 291.0,
      netEarnings: 2619.0,
      payoutStatus: "Paid",
      productsCount: 9,
      rating: 4.8,
      storeDescription: "Contemporary urban streetwear, heavyweight organic cotton apparel, denim, and footwear by Anuj.",
    },
  ]);

  // Marketplace Catalog
  const fallbackCatalog = [
    {
      _id: "prod_1",
      name: "Wireless Noise-Canceling Headphones",
      vendorName: "Gaurav's Store",
      category: "Electronics",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      description: "Immersive sound clarity with active noise cancellation and 30-hour battery life.",
      stock: 45,
    },
    {
      _id: "prod_2",
      name: "Ultra-Thin Mechanical Keyboard",
      vendorName: "Gaurav's Store",
      category: "Electronics",
      price: 119.0,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
      description: "Low-profile tactile switches with customizable RGB lighting and aluminum chassis.",
      stock: 28,
    },
    {
      _id: "prod_3",
      name: "4K Ultra HD Action Camera",
      vendorName: "Gaurav's Store",
      category: "Electronics",
      price: 179.5,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
      description: "Waterproof up to 30m with dual screens and electronic image stabilization.",
      stock: 14,
    },
    {
      _id: "prod_4",
      name: "Smartwatch Ultra OLED",
      vendorName: "Srivalli's Store",
      category: "Electronics",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      description: "Comprehensive health metrics, GPS tracking, and titanium bezel build.",
      stock: 32,
    },
    {
      _id: "prod_5",
      name: "True Wireless Earbuds Pro",
      vendorName: "Gaurav's Store",
      category: "Electronics",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
      description: "Crystal clear calls, sweat resistance, and compact wireless charging case.",
      stock: 60,
    },
    {
      _id: "prod_11",
      name: "Minimalist Ergonomic Leather Watch",
      vendorName: "Srivalli's Store",
      category: "Fashion",
      price: 149.5,
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60",
      description: "Genuine Italian leather strap with Japanese quartz movement and sapphire crystal.",
      stock: 22,
    },
    {
      _id: "prod_12",
      name: "Classic Indigo Denim Jacket",
      vendorName: "Anuj's Store",
      category: "Fashion",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60",
      description: "100% organic cotton denim with vintage wash and reinforced stitching.",
      stock: 19,
    },
    {
      _id: "prod_21",
      name: "Smart Fitness Running Shoes",
      vendorName: "Anuj's Store",
      category: "Sports",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
      description: "Breathable mesh upper with cushioned energy-return soles for long runs.",
      stock: 50,
    },
    {
      _id: "prod_31",
      name: "Espresso & Cappuccino Coffee Machine",
      vendorName: "Gaurav's Store",
      category: "Home & Kitchen",
      price: 169.99,
      image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60",
      description: "15-bar Italian pump pressure with integrated milk frothing wand.",
      stock: 11,
    },
    {
      _id: "prod_41",
      name: "Botanical Vitamin C Facial Serum",
      vendorName: "Riya's Store",
      category: "Beauty",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
      description: "Brightening antioxidant formula infused with natural hyaluronic acid.",
      stock: 85,
    },
  ];

  const [products, setProducts] = useState(fallbackCatalog);

  // Financial Payouts
  const [payouts, setPayouts] = useState([
    {
      id: "po_1",
      vendorId: "v_102",
      vendorName: "Srivalli's Store",
      amount: 2646.0,
      date: "2026-08-18",
      status: "Pending",
      paymentMethod: "Direct Deposit (Stripe)",
    },
    {
      id: "po_2",
      vendorId: "v_104",
      vendorName: "Anuj's Store",
      amount: 1656.0,
      date: "2026-08-19",
      status: "Pending",
      paymentMethod: "Bank Wire Transfer",
    },
    {
      id: "po_3",
      vendorId: "v_101",
      vendorName: "Gaurav's Store",
      amount: 3825.0,
      date: "2026-08-10",
      status: "Approved & Paid",
      paymentMethod: "Direct Deposit (Stripe)",
    },
    {
      id: "po_4",
      vendorId: "v_103",
      vendorName: "Riya's Store",
      amount: 2835.0,
      date: "2026-08-11",
      status: "Approved & Paid",
      paymentMethod: "Direct Deposit (Stripe)",
    },
  ]);

  // Activity Audit Feed
  const [activityLogs, setActivityLogs] = useState([
    {
      id: "act_1",
      timestamp: "2026-08-20 03:30",
      type: "Security",
      message: "Gaurav logged into Admin Control Center",
      user: "Gaurav",
      status: "Success",
    },
    {
      id: "act_2",
      timestamp: "2026-08-19 18:45",
      type: "Financial",
      message: "Payout request submitted by Srivalli's Store ($2,646.00)",
      user: "srivalli@store.com",
      status: "Pending",
    },
    {
      id: "act_3",
      timestamp: "2026-08-19 14:12",
      type: "Inventory",
      message: "New item 'Smartwatch Ultra OLED' published by Srivalli's Store",
      user: "srivalli@store.com",
      status: "Info",
    },
    {
      id: "act_4",
      timestamp: "2026-08-18 11:05",
      type: "Vendor",
      message: "New store tenant 'Riya's Store' onboarded automatically",
      user: "Riya",
      status: "Success",
    },
    {
      id: "act_5",
      timestamp: "2026-08-17 09:20",
      type: "Settings",
      message: "Platform commission rate updated to 10% by Anuj",
      user: "Anuj",
      status: "Success",
    },
  ]);

  // Filters & Inputs
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorStatusFilter, setVendorStatusFilter] = useState("All");
  const [vendorPlanFilter, setVendorPlanFilter] = useState("All");

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");

  const [logTypeFilter, setLogTypeFilter] = useState("All");
  const [logSearch, setLogSearch] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const statsRes = await api.get("/admin/stats", { headers });
      if (statsRes.data && statsRes.data.stats) {
        setStats(statsRes.data.stats);
        if (statsRes.data.settings) {
          setPlatformSettings(statsRes.data.settings);
          if (statsRes.data.settings.announcementNotice) {
            setAnnouncementInput(statsRes.data.settings.announcementNotice);
          }
        }
        if (statsRes.data.activityLogs) setActivityLogs(statsRes.data.activityLogs);
      }

      const vendorsRes = await api.get("/admin/vendors", { headers });
      if (vendorsRes.data && vendorsRes.data.vendors) {
        setVendors((prev) =>
          vendorsRes.data.vendors.map((v) => ({ ...prev.find((p) => p.id === v.id || p.id === v._id), ...v }))
        );
      }

      const prodRes = await api.get("/products");
      if (prodRes.data && prodRes.data.products && prodRes.data.products.length > 0) {
        setProducts(prodRes.data.products);
      }

      const payoutsRes = await api.get("/admin/payouts", { headers });
      if (payoutsRes.data && payoutsRes.data.payouts) {
        setPayouts(payoutsRes.data.payouts);
      }
    } catch (err) {
      console.log("Admin API data fetch fallback active.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleToggleStatus = async (vendorId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.put(`/admin/vendors/${vendorId}/status`, { status: newStatus }, { headers });
    } catch (err) {
      console.log("Status updated locally.");
    }

    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId || v._id === vendorId ? { ...v, status: newStatus } : v))
    );

    if (selectedVendor && (selectedVendor.id === vendorId || selectedVendor._id === vendorId)) {
      setSelectedVendor((prev) => ({ ...prev, status: newStatus }));
    }

    // Add log entry
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        type: "Vendor",
        message: `Vendor '${vendorId}' status changed to ${newStatus}`,
        user: "Admin",
        status: newStatus === "Active" ? "Success" : "Warning",
      },
      ...prev,
    ]);

    showToast(`Vendor account set to ${newStatus}`);
  };

  const handleRemoveProduct = (prodId) => {
    if (!window.confirm("Remove this listing from the global marketplace?")) return;
    setProducts((prev) => prev.filter((p) => p._id !== prodId));
    if (selectedProduct && selectedProduct._id === prodId) {
      setSelectedProduct(null);
    }
    showToast("Product listing removed from global catalog");
  };

  const handleApprovePayout = async (payoutId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.put(`/admin/payouts/${payoutId}/status`, { status: "Approved & Paid" }, { headers });
    } catch (err) {}

    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: "Approved & Paid" } : p))
    );

    showToast("Payout request approved & marked as Paid!");
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post("/admin/announcement", { announcementNotice: announcementInput }, { headers });
    } catch (err) {}

    setPlatformSettings((prev) => ({ ...prev, announcementNotice: announcementInput }));
    showToast("Platform broadcast notice updated successfully!");
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.put("/admin/settings", platformSettings, { headers });
    } catch (err) {}

    showToast("Platform commission & payout settings saved");
  };

  // Filtered Lists
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      !vendorSearch ||
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      (v.tenantSlug && v.tenantSlug.toLowerCase().includes(vendorSearch.toLowerCase()));
    const matchesStatus =
      vendorStatusFilter === "All" ? true : (v.status || "Active") === vendorStatusFilter;
    const matchesPlan = vendorPlanFilter === "All" ? true : v.plan === vendorPlanFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.vendorName && p.vendorName.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory =
      productCategoryFilter === "All" ? true : p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredLogs = activityLogs.filter((log) => {
    const matchesType = logTypeFilter === "All" ? true : log.type === logTypeFilter;
    const matchesSearch =
      !logSearch ||
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.user.toLowerCase().includes(logSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Integrated Admin Panel Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Super Admin Control Center</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-blue-50 text-[#2874f0] border border-blue-200">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Platform sales overview, vendor store oversight, financial disbursements, and global commission settings
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
              ● API Operational
            </span>
            <span className="px-3 py-1.5 bg-blue-50 text-[#2874f0] text-xs font-bold rounded-xl border border-blue-200">
              4 Stores Managed
            </span>
            <button
              onClick={() => fetchAdminData()}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Global Broadcast Announcement (if set) */}
        {platformSettings.announcementNotice && (
          <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl text-xs text-[#2874f0] flex items-center gap-2 shadow-xs">
            <span className="px-2 py-0.5 bg-[#2874f0] text-white rounded-md font-black text-[10px] uppercase">
              BROADCAST
            </span>
            <p className="truncate font-bold text-slate-800">{platformSettings.announcementNotice}</p>
          </div>
        )}

        {/* Tab Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "overview", label: "Platform Overview", icon: "📊" },
            { id: "vendors", label: "Vendor Accounts", icon: "🏪", count: vendors.length },
            { id: "products", label: "Marketplace Inventory", icon: "📦", count: products.length },
            { id: "payouts", label: "Financial Payouts", icon: "💳", count: payouts.filter((p) => p.status === "Pending").length },
            { id: "activity", label: "Audit Activity Trail", icon: "📜" },
            { id: "settings", label: "Commission & Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2874f0] text-white shadow-md scale-102 font-black"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    activeTab === tab.id
                      ? "bg-white text-[#2874f0]"
                      : "bg-blue-50 text-[#2874f0]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Total Platform Sales (GMV)</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                    +18.4% ↗
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  ${stats.totalGMV.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Across all vendor storefronts</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Platform Revenue ({platformSettings.commissionRate}%)</span>
                  <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-200">
                    Platform Cut
                  </span>
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  ${stats.platformCommissionEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Retained commission revenue</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Active Vendors</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.activeTenants} <span className="text-sm font-normal text-slate-500">/ {stats.totalVendors}</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Isolated multi-tenant stores</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                  <span>Pending Payouts</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                    Action Needed
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  ${stats.pendingPayoutsTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Awaiting admin settlement</span>
              </div>
            </div>

            {/* SECTION: PLATFORM SALES & GMV CHART */}
            <EnhancedRevenueChart
              title="Platform Gross Sales (GMV)"
              subtitle="Daily transaction summary across all vendor stores"
              colorScheme="indigo"
            />

            {/* Platform Distribution & Top Stores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <CategoryBreakdownChart
                title="Global Category Marketplace Share"
                subtitle="Aggregated department gross volume across all vendor tenants"
              />

              {/* Top Stores Leaderboard */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Top Vendor Leaderboard</h3>
                      <p className="text-xs text-slate-500 font-medium">Ranked by gross sales volume and customer satisfaction</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("vendors")}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      View All {vendors.length} Stores →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {vendors.slice(0, 5).map((v, idx) => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVendor(v)}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                              idx === 0
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : idx === 1
                                ? "bg-slate-200 text-slate-800"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{v.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{v.tenantSlug}.store • ⭐ {v.rating || 4.8}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-indigo-600 block">
                            ${v.revenue.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{v.salesCount} orders</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
                  💡 Click any vendor row to inspect tenant commission payouts & account details
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VENDORS TAB ================= */}
        {activeTab === "vendors" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search vendor accounts, email, or domain..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-indigo-600 w-full sm:w-72"
              />

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="mr-1">Status:</span>
                  {["All", "Active", "Suspended"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setVendorStatusFilter(st)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        vendorStatusFilter === st
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="mr-1">Plan:</span>
                  {["All", "Enterprise", "Pro", "Basic"].map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setVendorPlanFilter(plan)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        vendorPlanFilter === plan
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Store Name</th>
                    <th className="p-3.5">Domain Slug</th>
                    <th className="p-3.5">Plan Tier</th>
                    <th className="p-3.5">GMV Sales</th>
                    <th className="p-3.5">Commission</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id || vendor._id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                        <div className="font-bold text-slate-900 hover:text-indigo-600">{vendor.name}</div>
                        <div className="text-slate-400 text-[11px]">{vendor.email}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        /store/{vendor.tenantSlug || "store"}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            vendor.plan === "Enterprise"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : vendor.plan === "Pro"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {vendor.plan || "Basic"}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">${(vendor.revenue || 0).toFixed(2)}</td>
                      <td className="p-3.5 font-semibold text-emerald-600">
                        ${(vendor.commissionPaid || (vendor.revenue * 0.1)).toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-medium ${
                            (vendor.status || "Active") === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {vendor.status || "Active"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="text-xs font-medium text-slate-700 hover:text-indigo-600 underline"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(vendor.id || vendor._id, vendor.status || "Active")
                          }
                          className="text-xs font-medium text-slate-700 hover:text-indigo-600 underline"
                        >
                          {(vendor.status || "Active") === "Active" ? "Suspend Account" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search catalog products or vendor stores..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-indigo-600 w-full sm:w-72"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-slate-500 font-medium whitespace-nowrap mr-1">Category:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition ${
                      productCategoryFilter === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Product Title</th>
                    <th className="p-3.5">Vendor Store</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 flex items-center gap-3" onClick={() => setSelectedProduct(p)}>
                        <img
                          src={getProductImage(p)}
                          alt={p.name}
                          className="w-9 h-9 rounded object-cover bg-slate-100 border border-slate-200"
                          onError={(e) => handleImageError(e, p.category)}
                        />
                        <div>
                          <span className="font-medium text-slate-900 hover:text-indigo-600 block cursor-pointer">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                            {p.description || "Multi-tenant item"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-500">{p.vendorName || "Vendor"}</td>
                      <td className="p-3.5 text-slate-500">{p.category}</td>
                      <td className="p-3.5 font-bold text-slate-900">${Number(p.price).toFixed(2)}</td>
                      <td className="p-3.5 text-slate-500">{p.stock || 25} units</td>
                      <td className="p-3.5 text-right space-x-3">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="text-xs font-medium text-slate-700 hover:text-indigo-600 underline"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(p._id)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Remove Listing
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PAYOUTS TAB ================= */}
        {activeTab === "payouts" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Vendor Financial Settlements</h3>
                <p className="text-xs text-slate-500">
                  Review and approve vendor payout transfers based on platform commission rate
                </p>
              </div>

              <div className="bg-slate-50 px-3.5 py-1.5 rounded-md border border-slate-200 text-xs">
                <span className="text-slate-500">Pending Release: </span>
                <span className="font-bold text-amber-600">${stats.pendingPayoutsTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Payout ID</th>
                    <th className="p-3.5">Vendor Store</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Payment Method</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono text-indigo-600 font-semibold">{po.id}</td>
                      <td className="p-3.5 font-medium text-slate-900">{po.vendorName}</td>
                      <td className="p-3.5 text-slate-500">{po.date}</td>
                      <td className="p-3.5 text-slate-500">{po.paymentMethod}</td>
                      <td className="p-3.5 font-bold text-slate-900">${po.amount.toFixed(2)}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            po.status === "Approved & Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {po.status === "Pending" ? (
                          <button
                            onClick={() => handleApprovePayout(po.id)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-xs shadow-sm transition"
                          >
                            Approve Payout
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ACTIVITY AUDIT FEED TAB ================= */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search audit log event or user..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-indigo-600 w-full sm:w-72"
              />

              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span className="mr-1">Log Type:</span>
                {["All", "Security", "Financial", "Inventory", "Vendor", "Settings"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setLogTypeFilter(t)}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      logTypeFilter === t
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Platform Activity Audit Feed</h3>

              <div className="space-y-2.5">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.type === "Security"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : log.type === "Financial"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : log.type === "Vendor"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {log.type}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{log.message}</p>
                        <span className="text-[11px] text-slate-500">
                          User: <strong className="text-slate-700">{log.user}</strong>
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Commission Settings Form */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="font-bold text-slate-900 text-base">Platform Commission & Settings</h2>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-700 font-medium">
                      Platform Commission Fee ({platformSettings.commissionRate}%)
                    </label>
                    <span className="text-indigo-600 font-bold">
                      {platformSettings.commissionRate}% per sale
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    value={platformSettings.commissionRate}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, commissionRate: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Platform receives {platformSettings.commissionRate}% cut of each vendor sale transaction.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Vendor Payout Schedule</label>
                  <select
                    value={platformSettings.payoutSchedule}
                    onChange={(e) =>
                      setPlatformSettings({ ...platformSettings, payoutSchedule: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="Weekly">Weekly (Every Monday)</option>
                    <option value="Bi-Weekly">Bi-Weekly (1st & 15th)</option>
                    <option value="Monthly">Monthly (End of Month)</option>
                  </select>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={platformSettings.autoApproveVendors}
                      onChange={(e) =>
                        setPlatformSettings({ ...platformSettings, autoApproveVendors: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-700 font-medium">
                      Auto-approve new vendor registrations
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={platformSettings.maintenanceMode}
                      onChange={(e) =>
                        setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })
                      }
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span className="text-slate-700 font-medium text-amber-700">
                      Platform Maintenance Mode (Disable new store onboardings)
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition"
                >
                  Save Platform Settings
                </button>
              </form>
            </div>

            {/* Announcement & Interactive Profit Sandbox */}
            <div className="space-y-6">
              {/* Broadcast Announcement Form */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Broadcast Platform Notice</h3>
                <p className="text-xs text-slate-500">
                  Publish a global announcement message visible across all vendor dashboards
                </p>

                <form onSubmit={handlePublishAnnouncement} className="space-y-3 text-xs">
                  <textarea
                    rows={2}
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    placeholder="Enter broadcast message..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-sm transition"
                  >
                    Publish Broadcast Notice
                  </button>
                </form>
              </div>

              {/* Profit Split Calculator */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 text-base">Interactive Commission Sandbox</h3>
                <p className="text-xs text-slate-500">
                  Simulate sample sale transaction splits based on the platform commission rate
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-600 font-medium block mb-1">
                      Sample Order Amount ($):
                    </label>
                    <input
                      type="number"
                      value={testOrderAmount}
                      onChange={(e) => setTestOrderAmount(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
                      <span className="text-[10px] text-indigo-700 font-semibold block">
                        Platform Cut ({platformSettings.commissionRate}%)
                      </span>
                      <span className="text-base font-bold text-indigo-600">
                        ${((testOrderAmount * platformSettings.commissionRate) / 100).toFixed(2)}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Vendor Net Payout
                      </span>
                      <span className="text-base font-bold text-emerald-600">
                        ${(testOrderAmount * (1 - platformSettings.commissionRate / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= VENDOR DEEP-DIVE MODAL ================= */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                🏪
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedVendor.name}</h3>
                <span className="text-xs text-indigo-600 font-mono">
                  /store/{selectedVendor.tenantSlug || "slug"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total GMV</span>
                <span className="text-base font-bold text-slate-900">${selectedVendor.revenue.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Commission Paid</span>
                <span className="text-base font-bold text-emerald-600">
                  ${(selectedVendor.commissionPaid || selectedVendor.revenue * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Net Payout</span>
                <span className="text-base font-bold text-indigo-600">
                  ${(selectedVendor.netEarnings || selectedVendor.revenue * 0.9).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Store Rating</span>
                <span className="text-base font-bold text-amber-600">
                  ⭐ {selectedVendor.rating || "4.7"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p>
                <strong className="text-slate-800">Description:</strong>{" "}
                {selectedVendor.storeDescription || "No store description provided."}
              </p>
              <p>
                <strong className="text-slate-800">Contact Email:</strong> {selectedVendor.email}
              </p>
              <p>
                <strong className="text-slate-800">Onboarding Date:</strong> {selectedVendor.joinedAt}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`/store/${selectedVendor.tenantSlug || "audiophile-store"}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium border border-slate-300 transition"
              >
                Inspect Live Storefront ↗
              </a>

              <button
                onClick={() => {
                  handleToggleStatus(selectedVendor.id || selectedVendor._id, selectedVendor.status);
                }}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition ${
                  selectedVendor.status === "Active"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {selectedVendor.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT INSPECTION MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <img
              src={getProductImage(selectedProduct)}
              alt={selectedProduct.name}
              className="w-full h-44 rounded-xl object-cover bg-slate-50 border border-slate-200"
              onError={(e) => handleImageError(e, selectedProduct.category)}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {selectedProduct.category}
                </span>
                <span className="text-lg font-bold text-slate-900">
                  ${Number(selectedProduct.price).toFixed(2)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedProduct.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vendor: <strong className="text-slate-800">{selectedProduct.vendorName}</strong>
              </p>
            </div>

            <p className="text-xs text-slate-600">{selectedProduct.description}</p>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Stock: {selectedProduct.stock || 25} units
              </span>

              <button
                onClick={() => handleRemoveProduct(selectedProduct._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-sm transition"
              >
                Remove Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
