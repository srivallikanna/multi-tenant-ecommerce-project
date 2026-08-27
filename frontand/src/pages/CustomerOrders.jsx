import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState("orders"); // "orders", "buy_again", "not_shipped", "cancelled"
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("past_3_months");

  // Modals
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

  // Review Form
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  // Return Form
  const [returnReason, setReturnReason] = useState("Item arrived late");

  const { addToCart } = useCart();

  // Authentic Amazon/Flipkart-style realistic order items
  const sampleOrders = [
    {
      _id: "ord_402-8910234-918231",
      createdAt: "2026-08-19T14:30:00.000Z",
      status: "In Transit",
      statusMessage: "Arriving Tuesday by 8 PM",
      statusDetail: "Package departed local carrier facility",
      totalAmount: 329.98,
      shippingAddress: "Anuj, 742 Evergreen Terrace, Springfield, OR 97477",
      paymentMethod: "Visa ending in 4242",
      vendorStore: "Gaurav's Store",
      tenantSlug: "gaurav-store",
      trackingNumber: "TRK-89210923",
      carrier: "UPS Ground",
      estimatedDelivery: "Tuesday, Aug 22",
      returnEligibleUntil: "Sep 22, 2026",
      items: [
        {
          _id: "prod_1",
          name: "Wireless Noise-Canceling Over-Ear Headphones (Midnight Black)",
          price: 199.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
          category: "Electronics",
        },
        {
          _id: "prod_5",
          name: "True Wireless Earbuds Pro with Active Noise Cancellation",
          price: 129.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
          category: "Electronics",
        },
      ],
      subtotal: 303.58,
      tax: 26.40,
      shippingFee: 0.00,
    },
    {
      _id: "ord_114-8904512-441092",
      createdAt: "2026-08-14T09:15:00.000Z",
      status: "In Transit",
      statusMessage: "Arriving Tomorrow by 2 PM",
      statusDetail: "Out for delivery with FedEx courier",
      totalAmount: 149.50,
      shippingAddress: "Riya, 100 Bay View Street, San Francisco, CA 94105",
      paymentMethod: "Apple Pay",
      vendorStore: "Srivalli's Store",
      tenantSlug: "srivalli-store",
      trackingNumber: "FEDEX-992014812",
      carrier: "FedEx Priority",
      estimatedDelivery: "Tomorrow, Aug 20",
      returnEligibleUntil: "Sep 19, 2026",
      items: [
        {
          _id: "prod_11",
          name: "Minimalist Ergonomic Chronograph Watch with Leather Strap",
          price: 149.50,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60",
          category: "Fashion",
        },
      ],
      subtotal: 137.54,
      tax: 11.96,
      shippingFee: 0.00,
    },
    {
      _id: "ord_108-8892109-112940",
      createdAt: "2026-08-05T18:20:00.000Z",
      status: "Delivered",
      statusMessage: "Delivered Aug 8, 2026",
      statusDetail: "Package was handed directly to resident.",
      totalAmount: 179.50,
      shippingAddress: "Gaurav, 450 Market St, Seattle, WA 98101",
      paymentMethod: "Visa ending in 4242",
      vendorStore: "Anuj's Store",
      tenantSlug: "anuj-store",
      trackingNumber: "DHL-48192039US",
      carrier: "DHL Express",
      estimatedDelivery: "Aug 08, 2026",
      returnEligibleUntil: "Sep 08, 2026",
      items: [
        {
          _id: "prod_3",
          name: "4K Ultra HD Waterproof Action Camera with Pro Stabilizer",
          price: 179.50,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
          category: "Electronics",
        },
      ],
      subtotal: 165.14,
      tax: 14.36,
      shippingFee: 0.00,
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/orders/my-orders", { headers });
      if (res.data && res.data.orders && res.data.orders.length > 0) {
        setOrders(res.data.orders);
      } else {
        setOrders(sampleOrders);
      }
    } catch (err) {
      setOrders(sampleOrders);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleBuyAgain = (item) => {
    addToCart(
      {
        _id: item._id || "prod_" + Date.now(),
        name: item.name,
        price: Number(item.price),
        image: item.image,
      },
      1
    );
    showToast(`Added "${item.name}" to cart! 🛒`);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    let currentUserName = "Anuj";
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.name) currentUserName = u.name;
    } catch (err) {}

    const reviewObj = {
      id: "rev_" + Date.now(),
      customerName: currentUserName,
      rating: Number(reviewForm.rating),
      title: `${reviewForm.rating}-Star Buyer Review`,
      comment: reviewForm.comment,
      date: "Just now",
      verifiedPurchase: true,
      helpfulCount: 1,
      vendorReply: "",
      tags: ["Verified Buyer", "Fast Delivery"],
    };

    try {
      const storageKey = `customer_reviews_${selectedReviewItem._id || "prod_1"}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      localStorage.setItem(storageKey, JSON.stringify([reviewObj, ...existing]));

      const allReviews = JSON.parse(localStorage.getItem("all_vendor_reviews") || "[]");
      localStorage.setItem("all_vendor_reviews", JSON.stringify([reviewObj, ...allReviews]));
    } catch (err) {}

    showToast(`Review submitted for "${selectedReviewItem.name}"! ⭐ ${reviewForm.rating}/5 Stars`);
    setSelectedReviewItem(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    showToast(`Return request for Order #${selectedReturnOrder._id.slice(-6)} submitted successfully!`);
    setSelectedReturnOrder(null);
  };

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    if (activeTab === "not_shipped") {
      if (o.status === "Delivered") return false;
    } else if (activeTab === "cancelled") {
      if (o.status !== "Cancelled") return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o._id.toLowerCase().includes(q) ||
      o.items?.some((it) => it.name.toLowerCase().includes(q)) ||
      (o.vendorStore && o.vendorStore.toLowerCase().includes(q))
    );
  });

  // Extract all unique purchased items for "Buy Again" tab
  const allPurchasedItems = orders.flatMap((o) => o.items || []);

  return (
    <div className="min-h-screen bg-[#eaeded] text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-8 text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600 hover:underline">Your Account</Link>
          <span>›</span>
          <span className="text-slate-900 font-bold">Your Orders</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full space-y-5">
        
        {/* Amazon-style Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Orders
          </h1>

          {/* Search Orders Input */}
          <div className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search all orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-inner"
              />
            </div>
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Search Orders
            </button>
          </div>
        </div>

        {/* E-Commerce Standard Tabs Bar */}
        <div className="border-b border-slate-300 flex items-center gap-6 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none">
          {[
            { id: "orders", label: "Orders" },
            { id: "buy_again", label: "Buy Again" },
            { id: "not_shipped", label: "Not Yet Shipped" },
            { id: "cancelled", label: "Cancelled Orders" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-slate-900 border-b-2 border-amber-500 font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: ALL ORDERS ================= */}
        {activeTab !== "buy_again" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>
                <strong className="text-slate-900">{filteredOrders.length} orders</strong> placed in
              </span>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-xs font-medium focus:outline-none shadow-xs"
              >
                <option value="past_3_months">past 3 months</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                <div className="w-10 h-10 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mb-3" />
                <p className="text-xs text-slate-500 font-bold">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <p className="text-sm font-bold text-slate-700">You have no {activeTab === "not_shipped" ? "unshipped" : "matching"} orders.</p>
                <Link
                  to="/"
                  className="inline-block px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-xs transition"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden"
                  >
                    {/* Amazon-Style Grey Ribbon Header */}
                    <div className="bg-[#f0f2f2] border-b border-slate-300 p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                            ORDER PLACED
                          </span>
                          <span className="text-slate-800 font-semibold">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                            TOTAL
                          </span>
                          <span className="text-slate-800 font-bold">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                            SHIP TO
                          </span>
                          <span className="text-indigo-700 font-bold hover:underline cursor-pointer">
                            {order.shippingAddress?.split(",")[0] || "Anuj"} ▾
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                            ORDER # {String(order._id).slice(-14).toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2 justify-end mt-0.5">
                            <button
                              onClick={() => setSelectedTrackingOrder(order)}
                              className="text-indigo-700 hover:underline hover:text-indigo-900 font-semibold"
                            >
                              View order details
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="text-indigo-700 hover:underline hover:text-indigo-900 font-semibold"
                            >
                              Invoice ▾
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-4 sm:p-6 space-y-6">
                      
                      {/* Prominent Status Heading */}
                      <div>
                        <div className="flex items-center gap-2">
                          {order.status === "Delivered" ? (
                            <span className="text-emerald-600 text-lg font-black">✓</span>
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                          )}
                          <h2 className="text-base sm:text-lg font-black text-slate-900">
                            {order.statusMessage || (order.status === "Delivered" ? "Delivered" : "Arriving Soon")}
                          </h2>
                        </div>
                        <p className="text-xs text-slate-500 font-medium ml-4 mt-0.5">
                          {order.statusDetail || `Sold by ${order.vendorStore}`}
                        </p>
                      </div>

                      {/* Items & Actions 2-Column Layout */}
                      <div className="space-y-6">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                          >
                            {/* Product Info Left Column */}
                            <div className="flex items-start gap-4 flex-1">
                              <img
                                src={getProductImage(item)}
                                alt={item.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-200 bg-white shadow-xs flex-shrink-0"
                                onError={(e) => handleImageError(e, item)}
                              />
                              <div className="space-y-1.5">
                                <Link
                                  to="/"
                                  className="text-xs sm:text-sm font-bold text-indigo-700 hover:text-amber-700 hover:underline line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                
                                <span className="text-xs text-slate-500 block font-medium">
                                  Return eligible through {order.returnEligibleUntil || "30 days after delivery"}
                                </span>

                                <span className="text-xs font-black text-slate-900 block">
                                  ${Number(item.price).toFixed(2)} <span className="text-slate-400 font-normal">Qty: {item.quantity || 1}</span>
                                </span>

                                <div className="pt-2 flex items-center gap-2">
                                  <button
                                    onClick={() => handleBuyAgain(item)}
                                    className="px-4 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 text-xs font-bold rounded-full shadow-xs transition flex items-center gap-1.5 active:scale-95 border border-[#fcd200]"
                                  >
                                    <span>🛒</span> Buy it again
                                  </button>
                                  <Link
                                    to="/"
                                    className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-300 shadow-xs transition"
                                  >
                                    View item
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons Right Column */}
                            <div className="flex flex-col gap-2 w-full md:w-56 flex-shrink-0">
                              <button
                                onClick={() => setSelectedTrackingOrder(order)}
                                className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 text-xs font-bold rounded-xl shadow-xs transition border border-[#fcd200] text-center"
                              >
                                Track package
                              </button>

                              <button
                                onClick={() => setSelectedReviewItem(item)}
                                className="w-full py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 shadow-xs transition text-center"
                              >
                                Write a product review
                              </button>

                              <button
                                onClick={() => setSelectedReturnOrder(order)}
                                className="w-full py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 shadow-xs transition text-center"
                              >
                                Return or replace items
                              </button>

                              <Link
                                to={`/store/${order.tenantSlug || "audiophile-store"}`}
                                className="w-full py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 shadow-xs transition text-center"
                              >
                                Leave seller feedback
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: BUY AGAIN ================= */}
        {activeTab === "buy_again" && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900">Buy Again from Past Orders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allPurchasedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-xl mb-3 border border-slate-100 bg-slate-50"
                      onError={(e) => handleImageError(e, item)}
                    />
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <span className="text-sm font-black text-slate-900 block mb-3">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyAgain(item)}
                    className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 text-xs font-bold rounded-xl shadow-xs transition border border-[#fcd200]"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= LIVE TRACKING PACKAGE MODAL ================= */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up text-slate-900 space-y-5">
            <button
              onClick={() => setSelectedTrackingOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                {selectedTrackingOrder.carrier}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {selectedTrackingOrder.statusMessage}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Tracking ID: {selectedTrackingOrder.trackingNumber}
              </p>
            </div>

            {/* Courier Steps Visual Timeline */}
            <div className="space-y-4 text-xs relative pl-6 border-l-2 border-emerald-500 py-1">
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-100" />
                <span className="font-black text-slate-900 block">Out for Delivery</span>
                <span className="text-slate-400 text-[11px]">Today, 8:30 AM • On the carrier vehicle for delivery</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                <span className="font-black text-slate-900 block">Package arrived at local carrier facility</span>
                <span className="text-slate-400 text-[11px]">Yesterday, 11:45 PM • Springfield, OR</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                <span className="font-bold text-slate-700 block">Carrier picked up the package</span>
                <span className="text-slate-400 text-[11px]">{selectedTrackingOrder.vendorStore}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center font-medium">
              <span className="text-slate-600">Delivering to:</span>
              <span className="font-bold text-slate-900 truncate max-w-[240px]">
                {selectedTrackingOrder.shippingAddress}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= DIGITAL INVOICE RECEIPT MODAL ================= */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up text-slate-900 space-y-4">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Final Details for Order</h3>
                <span className="text-xs text-slate-500 font-mono">
                  #{selectedInvoiceOrder._id}
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs rounded-full">
                PAID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-slate-900 block mb-0.5">Shipping Address:</strong>
                <p className="text-slate-600">{selectedInvoiceOrder.shippingAddress}</p>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Payment Method:</strong>
                <p className="text-slate-600">{selectedInvoiceOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Items Ordered</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedInvoiceOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-slate-900">{it.name}</td>
                      <td className="p-3 text-slate-500">{it.quantity || 1}</td>
                      <td className="p-3 text-right font-black text-slate-900">
                        ${(it.price * (it.quantity || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-1 text-right text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item(s) Subtotal:</span>
                  <span>${(selectedInvoiceOrder.subtotal || selectedInvoiceOrder.totalAmount * 0.92).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax:</span>
                  <span>${(selectedInvoiceOrder.tax || selectedInvoiceOrder.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-indigo-700">${Number(selectedInvoiceOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition"
              >
                🖨️ Print this page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= WRITE REVIEW MODAL ================= */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up text-slate-900 space-y-4">
            <button
              onClick={() => setSelectedReviewItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div>
              <h3 className="font-black text-slate-900 text-base">Create Review</h3>
              <p className="text-xs text-indigo-700 font-bold mt-0.5 line-clamp-1">{selectedReviewItem.name}</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Overall Rating</label>
                <div className="flex items-center gap-1.5 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`transition transform hover:scale-110 ${
                        star <= reviewForm.rating ? "text-amber-400" : "text-slate-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Add a written review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What did you like or dislike? What did you use this product for?"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReviewItem(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold rounded-xl shadow-xs border border-[#fcd200]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RETURN / REPLACE MODAL ================= */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-slide-up text-slate-900 space-y-4">
            <button
              onClick={() => setSelectedReturnOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div>
              <h3 className="font-black text-slate-900 text-base">Return or Replace Items</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Order #{selectedReturnOrder._id.slice(-10)}</p>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Why are you returning this?</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none font-medium"
                >
                  <option value="Item arrived late">Item arrived late</option>
                  <option value="Item defective or doesn't work">Item defective or doesn't work</option>
                  <option value="Bought by mistake">Bought by mistake</option>
                  <option value="Better price found elsewhere">Better price found elsewhere</option>
                  <option value="Item different from website description">Item different from website description</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] font-medium">
                💡 A prepaid return shipping label will be generated for drop-off at any carrier facility.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReturnOrder(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold rounded-xl shadow-xs border border-[#fcd200]"
                >
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
