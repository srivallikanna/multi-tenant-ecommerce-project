import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import EnhancedRevenueChart from "../components/EnhancedRevenueChart";
import CategoryBreakdownChart from "../components/CategoryBreakdownChart";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, inventory, orders, payouts, settings, reviews
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [timeframe, setTimeframe] = useState("7d");

  // Modals & Selected Items
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters & Inputs
  const [inventorySearch, setInventorySearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Form States
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "20",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
  });

  const [payoutForm, setPayoutForm] = useState({
    amount: "1500.00",
    method: "Bank Transfer",
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Gaurav's Store",
    storeHandle: "gaurav-store",
    supportEmail: "gaurav@store.com",
    phone: "+1 (555) 234-5678",
    announcement: "Free express shipping on all orders over $50!",
    storeDescription: "High-fidelity audio equipment, studio monitors, noise-canceling headphones, and custom tech gear.",
  });

  // Vendor Inventory Products
  const [products, setProducts] = useState([
    {
      _id: "prod_1",
      name: "Wireless Noise-Canceling Headphones",
      category: "Electronics",
      price: 199.99,
      stock: 45,
      salesCount: 68,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      description: "Immersive sound with active noise cancellation and 30-hour battery life.",
    },
    {
      _id: "prod_5",
      name: "True Wireless Earbuds Pro",
      category: "Electronics",
      price: 129.99,
      stock: 3,
      salesCount: 42,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
      description: "HD calls, IPX7 sweat resistance, and wireless charging case.",
    },
    {
      _id: "prod_8",
      name: "Studio Monitor Speaker Pair",
      category: "Electronics",
      price: 349.00,
      stock: 12,
      salesCount: 24,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60",
      description: "Active reference monitors with flat frequency response for clean audio.",
    },
    {
      _id: "prod_9",
      name: "Waterproof Bluetooth Speaker",
      category: "Electronics",
      price: 79.99,
      stock: 0,
      salesCount: 88,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
      description: "Rugged outdoor speaker with deep bass and 15-hour playback.",
    },
  ]);

  // Customer Orders
  const [orders, setOrders] = useState([
    {
      _id: "ord_901",
      customerName: "Anuj",
      customerEmail: "anuj@store.com",
      shippingAddress: "742 Evergreen Terrace, Springfield, OR",
      totalAmount: 329.98,
      status: "Processing",
      date: "Aug 19, 2026",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK-89210923",
      items: [
        { name: "Wireless Noise-Canceling Headphones", qty: 1, price: 199.99 },
        { name: "True Wireless Earbuds Pro", qty: 1, price: 129.99 },
      ],
    },
    {
      _id: "ord_902",
      customerName: "Srivalli",
      customerEmail: "srivalli@store.com",
      shippingAddress: "100 Bay View Street, San Francisco, CA",
      totalAmount: 199.99,
      status: "Shipped",
      date: "Aug 18, 2026",
      paymentMethod: "Apple Pay",
      trackingNumber: "UPS-48192039US",
      items: [{ name: "Wireless Noise-Canceling Headphones", qty: 1, price: 199.99 }],
    },
    {
      _id: "ord_903",
      customerName: "Riya",
      customerEmail: "riya@store.com",
      shippingAddress: "450 Market St, Seattle, WA",
      totalAmount: 349.00,
      status: "Delivered",
      date: "Aug 16, 2026",
      paymentMethod: "Credit Card",
      trackingNumber: "FEDEX-992014812",
      items: [{ name: "Studio Monitor Speaker Pair", qty: 1, price: 349.00 }],
    },
  ]);

  // Payout History
  const [payouts, setPayouts] = useState([
    { id: "PAY-1002", amount: 3825.00, date: "Aug 10, 2026", status: "Completed", method: "Bank Transfer" },
    { id: "PAY-1001", amount: 2450.00, date: "Jul 28, 2026", status: "Completed", method: "Bank Transfer" },
  ]);

  // Reviews
  const [reviews, setReviews] = useState([
    {
      id: "rev_1",
      customerName: "Gaurav",
      productName: "Wireless Noise-Canceling Headphones",
      rating: 5,
      comment: "Outstanding sound quality and super comfortable for all-day listening!",
      date: "Aug 17, 2026",
      vendorReply: "Thank you Gaurav! We appreciate your support!",
    },
    {
      id: "rev_2",
      customerName: "Srivalli",
      productName: "True Wireless Earbuds Pro",
      rating: 5,
      comment: "Very secure fit for workouts and great battery life.",
      date: "Aug 15, 2026",
      vendorReply: "Thank you Srivalli!",
    },
  ]);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const prodRes = await api.get("/products/vendor/my-products", { headers });
      if (prodRes.data && prodRes.data.products && prodRes.data.products.length > 0) {
        setProducts(prodRes.data.products);
      }

      const orderRes = await api.get("/orders/vendor/my-orders", { headers });
      if (orderRes.data && orderRes.data.orders && orderRes.data.orders.length > 0) {
        setOrders(orderRes.data.orders);
      }

      // Sync customer submitted reviews
      const storedReviews = localStorage.getItem("all_vendor_reviews");
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews);
        if (parsed.length > 0) {
          setReviews((prev) => {
            const merged = [...parsed, ...prev.filter((p) => !parsed.some((pr) => pr.id === p.id))];
            return merged;
          });
        }
      }
    } catch (err) {
      // Local fallback active
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Quick Stock Adjustment
  const handleAdjustStock = (prodId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id === prodId) {
          const newStock = Math.max(0, (p.stock || 0) + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    showToast("Stock updated!");
  };

  const handleQuickRestock = (prodId, addQty = 20) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === prodId ? { ...p, stock: (p.stock || 0) + addQty } : p))
    );
    showToast(`+${addQty} units added to stock!`);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.post("/products", newProduct, { headers });
      if (res.data && res.data.product) {
        setProducts([res.data.product, ...products]);
      } else {
        throw new Error("Local fallback");
      }
    } catch (err) {
      const mockProd = {
        _id: "prod_" + Date.now(),
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        salesCount: 0,
        rating: 5.0,
        image: newProduct.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        description: newProduct.description,
      };
      setProducts([mockProd, ...products]);
    }

    setShowAddModal(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "Electronics",
      stock: "20",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    });
    showToast("New product published!");
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Delete this product from your store?")) return;
    setProducts((prev) => prev.filter((p) => p._id !== id));
    if (selectedProduct && selectedProduct._id === id) {
      setSelectedProduct(null);
    }
    showToast("Product removed.");
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.put(`/orders/${orderId}/status`, { status: newStatus }, { headers });
    } catch (err) {}

    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }

    showToast(`Order marked as ${newStatus}`);
  };

  const handleUpdateTrackingNumber = (orderId, trackingNo) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, trackingNumber: trackingNo } : o))
    );
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, trackingNumber: trackingNo }));
    }
    showToast("Tracking number saved!");
  };

  const handleRequestPayout = (e) => {
    e.preventDefault();
    const newPayout = {
      id: "PAY-" + (1000 + payouts.length + 1),
      amount: Number(payoutForm.amount),
      date: "Today",
      status: "Processing",
      method: payoutForm.method,
    };

    setPayouts([newPayout, ...payouts]);
    setShowPayoutModal(false);
    showToast(`Payout request of $${payoutForm.amount} submitted!`);
  };

  // Metrics
  const grossRevenue = products.reduce((sum, p) => sum + (p.price * (p.salesCount || 10)), 4250.0);
  const netEarnings = grossRevenue * 0.9;
  const outOfStockItems = products.filter((p) => (p.stock || 0) <= 0);
  const lowStockItems = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = !inventorySearch || p.name.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesStock =
      stockFilter === "All"
        ? true
        : stockFilter === "In Stock"
        ? (p.stock || 0) > 5
        : stockFilter === "Low Stock"
        ? (p.stock || 0) > 0 && (p.stock || 0) <= 5
        : (p.stock || 0) <= 0;
    return matchesSearch && matchesStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o._id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" ? true : o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrdersCount = orders.filter((o) => o.status === "Processing").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Top Seller Bar */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-100">
              🎧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{storeSettings.storeName}</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Store
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-medium">
                <span className="text-indigo-600 font-semibold">Store ID: {storeSettings.storeHandle}</span>
                <span>•</span>
                <span>⭐ 4.9 Rating (120+ Reviews)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to={`/store/${encodeURIComponent(storeSettings.storeHandle)}`}
              target="_blank"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <span>👁️</span> View Live Store
            </Link>
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <span>💸</span> Payouts
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-1.5"
            >
              <span>+</span> Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 text-xs font-bold overflow-x-auto scrollbar-none py-1">
          {[
            { id: "overview", label: "Dashboard", icon: "📊" },
            { id: "inventory", label: "Products", icon: "📦", count: products.length },
            { id: "orders", label: "Orders", icon: "🛍️", count: pendingOrdersCount, badgeColor: "bg-amber-500 text-white" },
            { id: "payouts", label: "Earnings & Payouts", icon: "💳" },
            { id: "settings", label: "Store Settings", icon: "⚙️" },
            { id: "reviews", label: "Customer Reviews", icon: "⭐", count: reviews.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    tab.badgeColor || "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* ================= 1. OVERVIEW / DASHBOARD TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Storefront Performance & Quick Share Hero */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Verified Tenant Storefront
                  </span>
                  <span className="text-xs text-indigo-300 font-semibold">
                    Seller Tier: Gold Merchant
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {storeSettings.storeName} Dashboard
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Overview of store orders, revenue, inventory stock, and customer reviews.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 flex-wrap">
                <Link
                  to={`/store/${encodeURIComponent(storeSettings.storeHandle)}`}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-lg transition flex items-center gap-2 active:scale-95"
                >
                  <span>🛍️</span> Customer View
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.origin + `/store/${storeSettings.storeHandle}`);
                    showToast("Store URL copied to clipboard!");
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 transition flex items-center gap-2 active:scale-95"
                >
                  <span>📋</span> Copy Store Link
                </button>
              </div>
            </div>

            {/* Quick Stat Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Sales</span>
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 text-lg">💰</span>
                </div>
                <div className="text-2xl font-black text-slate-900">${grossRevenue.toFixed(2)}</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <span>↗ +14.2%</span> <span className="text-slate-400 font-medium">vs last period</span>
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Earnings</span>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-lg">💵</span>
                </div>
                <div className="text-2xl font-black text-emerald-600">${netEarnings.toFixed(2)}</div>
                <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                  90% retained revenue (10% platform fee)
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Store Orders</span>
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600 text-lg">📦</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                <span className="text-[11px] text-amber-600 font-bold mt-1.5 block">
                  {pendingOrdersCount} awaiting shipment
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Inventory</span>
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600 text-lg">⚠️</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {products.length} <span className="text-xs text-slate-400 font-normal">Active Products</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                  {lowStockItems.length + outOfStockItems.length > 0 ? (
                    <span className="text-rose-600 font-bold">
                      {lowStockItems.length + outOfStockItems.length} items need restock
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold">All items in stock</span>
                  )}
                </span>
              </div>
            </div>

            {/* SECTION: EASY-TO-UNDERSTAND REVENUE CHART */}
            <EnhancedRevenueChart
              title="Store Sales & Revenue"
              subtitle="Daily revenue summary and order volume across selected periods"
              colorScheme="indigo"
            />

            {/* SECTION: CATEGORY DISTRIBUTION & LOW STOCK RADAR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Revenue Breakdown */}
              <CategoryBreakdownChart
                title="Product Category Sales Share"
                subtitle="Revenue distribution across your catalog"
              />

              {/* Restock Radar Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Restock Radar & Stock Alerts</h3>
                      <p className="text-xs text-slate-500 font-medium">Fast 1-click replenishment for hot selling items</p>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                      {outOfStockItems.length + lowStockItems.length} Alerts
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[...outOfStockItems, ...lowStockItems].map((item) => (
                      <div
                        key={item._id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-200"
                            onError={(e) => handleImageError(e, item.category)}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block truncate max-w-[140px]">
                              {item.name}
                            </span>
                            <span className={`text-[10px] font-bold ${item.stock === 0 ? "text-red-600" : "text-amber-600"}`}>
                              {item.stock === 0 ? "⚠️ Out of Stock" : `Only ${item.stock} left in stock`}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleQuickRestock(item._id, 20)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1"
                        >
                          <span>+20</span> Restock
                        </button>
                      </div>
                    ))}

                    {outOfStockItems.length === 0 && lowStockItems.length === 0 && (
                      <div className="p-8 bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs rounded-2xl text-center font-bold space-y-1">
                        <div className="text-2xl">🎉</div>
                        <div>All inventory items have healthy stock levels!</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-center mt-4">
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View Complete Inventory Catalog ({products.length} items) →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS / INVENTORY TAB ================= */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search products by title..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 w-full sm:w-80"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-bold">Filter:</span>
                {["All", "In Stock", "Low Stock", "Out of Stock"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStockFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      stockFilter === st
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Total Sold</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            onError={(e) => handleImageError(e, p.category)}
                          />
                          <div>
                            <span className="font-bold text-slate-900 hover:text-indigo-600 block text-xs">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block mt-0.5">
                              {p.description}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-semibold">{p.category}</td>
                        <td className="p-4 font-black text-slate-900">${Number(p.price).toFixed(2)}</td>
                        <td className="p-4">
                          {/* 1-Click Interactive Stock Stepper */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustStock(p._id, -1)}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center border border-slate-200 transition"
                            >
                              -
                            </button>
                            <span
                              className={`px-2.5 py-0.5 rounded-lg font-bold text-xs min-w-[54px] text-center ${
                                (p.stock || 0) === 0
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : (p.stock || 0) <= 5
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {p.stock || 0}
                            </span>
                            <button
                              onClick={() => handleAdjustStock(p._id, 1)}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center border border-slate-200 transition"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{p.salesCount || 0} units</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search orders by customer or ID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 w-full sm:w-80"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Status:</span>
                {["All", "Processing", "Shipped", "Delivered"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      orderStatusFilter === st
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-black text-slate-900 text-base mb-2">Customer Orders</h3>

              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 border border-slate-200 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-indigo-200 hover:shadow-sm transition bg-white"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          Order #{String(order._id).slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">• {order.customerName}</span>
                        <span className="text-xs text-slate-400">• {order.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Deliver to: <span className="text-slate-800 font-semibold">{order.shippingAddress}</span>
                      </p>
                      {order.trackingNumber && (
                        <span className="text-[11px] font-mono text-indigo-600 block mt-0.5 font-bold">
                          Tracking: {order.trackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>

                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                        className={`text-xs rounded-xl px-3 py-1.5 font-bold border focus:outline-none shadow-xs ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : order.status === "Shipped"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition"
                      >
                        Details & Tracking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. EARNINGS & PAYOUTS TAB ================= */}
        {activeTab === "payouts" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Earnings & Bank Payouts</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Review your available earnings balance and withdraw directly to your bank account.
                </p>
              </div>

              <button
                onClick={() => setShowPayoutModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-md shadow-emerald-200 transition"
              >
                Request Payout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Sales</span>
                <span className="text-2xl font-black text-slate-900">${grossRevenue.toFixed(2)}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Platform Fee (10%)</span>
                <span className="text-2xl font-black text-slate-400">-${(grossRevenue * 0.1).toFixed(2)}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block mb-1">Available to Withdraw</span>
                <span className="text-2xl font-black text-emerald-600">${netEarnings.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-black text-slate-900 text-xs uppercase tracking-wider">
                Payout History
              </div>
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Reference ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-indigo-600">{po.id}</td>
                      <td className="p-4 text-slate-500">{po.date}</td>
                      <td className="p-4 text-slate-700">{po.method}</td>
                      <td className="p-4 font-black text-slate-900">${po.amount.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            po.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 5. STORE SETTINGS TAB ================= */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customization Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-black text-slate-900 text-base">Store Profile & Branding</h2>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Store Name</label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Store Link / Handle</label>
                  <input
                    type="text"
                    value={storeSettings.storeHandle}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeHandle: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Top Announcement Message</label>
                  <input
                    type="text"
                    value={storeSettings.announcement}
                    onChange={(e) => setStoreSettings({ ...storeSettings, announcement: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Store Description</label>
                  <textarea
                    rows={3}
                    value={storeSettings.storeDescription}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <button
                  onClick={() => showToast("Store settings saved successfully!")}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition"
                >
                  Save Store Settings
                </button>
              </div>
            </div>

            {/* Live Store Banner Preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-base">Live Storefront Preview</h3>
              <p className="text-xs text-slate-500 font-medium">How your storefront appears to shoppers</p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-indigo-600 text-white px-4 py-2 text-xs font-bold text-center truncate">
                  📢 {storeSettings.announcement}
                </div>

                <div className="bg-slate-950 text-white p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold shadow-md">
                    🎧
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">{storeSettings.storeName}</h4>
                    <span className="text-xs text-indigo-300 font-mono">/store/{storeSettings.storeHandle}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 text-xs text-slate-600 font-medium">
                  <p>{storeSettings.storeDescription}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. REVIEWS TAB ================= */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base">Customer Feedback & Reviews</h3>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{rev.customerName}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">Reviewed: {rev.productName}</span>
                    </div>
                    <div className="text-amber-500 text-sm font-bold">{"★".repeat(rev.rating)}</div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">"{rev.comment}"</p>

                  {rev.vendorReply ? (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
                      <strong>Your Reply:</strong> {rev.vendorReply}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const reply = prompt("Enter your reply to this customer:");
                        if (reply) {
                          setReviews((prev) =>
                            prev.map((r) => (r.id === rev.id ? { ...r, vendorReply: reply } : r))
                          );
                          showToast("Reply published!");
                        }
                      }}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      Reply to Customer →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up text-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio Headphones"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Briefly describe the product..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="199.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= REQUEST PAYOUT MODAL ================= */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Request Earnings Payout</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Balance</label>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-black text-emerald-700 text-base">
                  ${netEarnings.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Withdraw Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black focus:outline-none focus:border-indigo-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payout Method</label>
                <select
                  value={payoutForm.method}
                  onChange={(e) => setPayoutForm({ ...payoutForm, method: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-bold"
                >
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                  <option value="Stripe Direct">Stripe Direct Deposit</option>
                  <option value="PayPal">PayPal Payout</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-md shadow-emerald-200"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 relative animate-slide-up text-slate-800">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Order #{String(selectedOrder._id).slice(-6).toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Placed on {selectedOrder.date}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <p>
                <strong className="text-slate-800">Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})
              </p>
              <p>
                <strong className="text-slate-800">Shipping Address:</strong> {selectedOrder.shippingAddress}
              </p>
              <p>
                <strong className="text-slate-800">Payment:</strong> {selectedOrder.paymentMethod}
              </p>
            </div>

            <div className="border-t border-b border-slate-100 py-3 space-y-2 text-xs">
              <strong className="text-slate-800 block">Items Ordered:</strong>
              {selectedOrder.items &&
                selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl font-medium">
                    <span>
                      {it.name} <strong className="text-indigo-600">x{it.qty}</strong>
                    </span>
                    <span className="font-black text-slate-900">${(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              <div className="text-right font-black text-sm text-slate-900 pt-1">
                Total: ${selectedOrder.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-800">Update Tracking Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TRK-89210923"
                  defaultValue={selectedOrder.trackingNumber || ""}
                  id="trackingInput"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                />
                <button
                  onClick={() => {
                    const inputEl = document.getElementById("trackingInput");
                    if (inputEl) handleUpdateTrackingNumber(selectedOrder._id, inputEl.value);
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                >
                  Save Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAILS MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 relative animate-slide-up text-slate-800">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <img
              src={getProductImage(selectedProduct)}
              alt={selectedProduct.name}
              className="w-full h-44 rounded-2xl object-cover bg-slate-50 border border-slate-200"
              onError={(e) => handleImageError(e, selectedProduct.category)}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {selectedProduct.category}
                </span>
                <span className="text-xl font-black text-slate-900">
                  ${Number(selectedProduct.price).toFixed(2)}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">{selectedProduct.name}</h3>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">{selectedProduct.description}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                Stock: {selectedProduct.stock} units
              </span>

              <button
                onClick={() => handleDeleteProduct(selectedProduct._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
