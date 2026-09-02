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
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [returnReason, setReturnReason] = useState("Item quality not as expected");

  const { addToCart } = useCart();

  const sampleOrders = [
    {
      _id: "OD128910234918231000",
      createdAt: "2026-08-19T14:30:00.000Z",
      status: "In Transit",
      statusMessage: "Arriving Tomorrow by 5 PM",
      statusDetail: "Item has been dispatched from nearest regional hub.",
      totalAmount: 199.99,
      shippingAddress: "Anuj Bhaskar, 742 Evergreen Terrace, Springfield, OR 97477",
      paymentMethod: "UPI (Verified)",
      vendorStore: "Gaurav's Store",
      tenantSlug: "gaurav-store",
      trackingNumber: "FK-89210923",
      carrier: "SuperFast Express",
      items: [
        {
          _id: "prod_101",
          name: "AcousticPro Studio Wireless ANC Headphones (Midnight Obsidian)",
          price: 199.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
          category: "Electronics",
        },
      ],
    },
    {
      _id: "OD114890451244109200",
      createdAt: "2026-08-14T09:15:00.000Z",
      status: "Delivered",
      statusMessage: "Delivered on Aug 16, 2026",
      statusDetail: "Package was handed directly to resident.",
      totalAmount: 289.00,
      shippingAddress: "Anuj Bhaskar, 742 Evergreen Terrace, Springfield, OR 97477",
      paymentMethod: "Visa ending in 4242",
      vendorStore: "Srivalli's Store",
      tenantSlug: "srivalli-store",
      trackingNumber: "FK-992014812",
      carrier: "SuperFast Express",
      items: [
        {
          _id: "prod_102",
          name: "ChronoMaster Minimalist Sapphire Watch with Genuine Leather",
          price: 289.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60",
          category: "Fashion",
        },
      ],
    },
    {
      _id: "OD108889210911294000",
      createdAt: "2026-08-05T18:20:00.000Z",
      status: "Delivered",
      statusMessage: "Delivered on Aug 08, 2026",
      statusDetail: "Delivered to reception desk.",
      totalAmount: 48.00,
      shippingAddress: "Anuj Bhaskar, 742 Evergreen Terrace, Springfield, OR 97477",
      paymentMethod: "UPI (Google Pay)",
      vendorStore: "Riya's Store",
      tenantSlug: "riya-store",
      trackingNumber: "FK-48192039",
      carrier: "SuperFast Express",
      items: [
        {
          _id: "prod_103",
          name: "Botanical Radiance Vitamin C Glow Serum (30ml)",
          price: 48.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
          category: "Beauty",
        },
      ],
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
      
      const localPlaced = JSON.parse(localStorage.getItem("all_placed_orders") || "[]");

      if (res.data && res.data.orders && res.data.orders.length > 0) {
        setOrders([...localPlaced, ...res.data.orders]);
      } else if (localPlaced.length > 0) {
        setOrders([...localPlaced, ...sampleOrders]);
      } else {
        setOrders(sampleOrders);
      }
    } catch (err) {
      const localPlaced = JSON.parse(localStorage.getItem("all_placed_orders") || "[]");
      setOrders(localPlaced.length > 0 ? [...localPlaced, ...sampleOrders] : sampleOrders);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleBuyAgain = (item) => {
    addToCart(item, 1);
    showToast(`Added "${item.name}" to cart! 🛒`);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    showToast(`Review posted for "${selectedReviewItem?.name}"! ⭐ ${reviewRating}/5 Stars`);
    setSelectedReviewItem(null);
    setReviewComment("");
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    showToast(`Return request placed successfully for Order #${selectedReturnOrder?._id?.slice(-6)}`);
    setSelectedReturnOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "Delivered" && o.status !== "Delivered") return false;
    if (statusFilter === "In Transit" && o.status !== "In Transit" && o.status !== "Placed") return false;
    if (statusFilter === "Cancelled" && o.status !== "Cancelled") return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o._id?.toLowerCase().includes(q) ||
      o.items?.some((it) => it.name?.toLowerCase().includes(q)) ||
      o.vendorStore?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white pb-16">
      <Navbar />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-down border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 flex-1 w-full space-y-4">
        
        {/* Breadcrumb strip */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <span className="text-slate-800 font-black">My Orders</span>
        </div>

        {/* 2-Column Flipkart Orders Layout: Left Filters + Right Order Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT: FILTERS SIDEBAR (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                Filters
              </h3>

              {/* Order Status Filters */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  ORDER STATUS
                </span>
                <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                  {["All", "In Transit", "Delivered", "Cancelled"].map((st) => (
                    <label key={st} className="flex items-center gap-2 cursor-pointer hover:text-[#2874f0]">
                      <input
                        type="radio"
                        name="statusFilter"
                        checked={statusFilter === st}
                        onChange={() => setStatusFilter(st)}
                        className="text-[#2874f0] focus:ring-[#2874f0]"
                      />
                      <span>{st === "All" ? "All Orders" : st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-[#2874f0] flex items-center gap-1">
                  🛡️ Buyer Assurance
                </span>
                <p>100% verified orders dispatched directly by certified merchants.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: SEARCH & ORDERS LIST (9 COLS) */}
          <div className="lg:col-span-9 space-y-3">
            
            {/* Search Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex items-center gap-2">
              <span className="text-slate-400 pl-2">🔍</span>
              <input
                type="text"
                placeholder="Search your orders by product name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                className="px-4 py-1.5 bg-[#2874f0] hover:bg-[#1e60db] text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                Search
              </button>
            </div>

            {/* Orders Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
                <div className="text-4xl">📦</div>
                <h3 className="text-base font-bold text-slate-800">No orders found</h3>
                <p className="text-xs text-slate-500">You haven't placed any orders matching this filter.</p>
                <Link to="/" className="inline-block px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded-lg">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order, idx) => {
                  const firstItem = order.items?.[0] || { name: "Selected Product", price: order.totalAmount };
                  const isDelivered = order.status === "Delivered";

                  return (
                    <div
                      key={`${order._id || 'ord'}-${idx}`}
                      className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        {/* Left: Thumbnail + Title */}
                        <div className="flex items-start gap-4 flex-1">
                          <img
                            src={getProductImage(firstItem)}
                            alt={firstItem.name}
                            onError={(e) => handleImageError(e, firstItem.name)}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-200 rounded-lg object-contain p-1 shrink-0"
                          />
                          <div className="space-y-1">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#2874f0] transition line-clamp-2">
                              {firstItem.name}
                            </h3>
                            <div className="text-[11px] text-slate-500 font-medium">
                              Seller: <span className="text-slate-800 font-bold">{order.vendorStore || "Verified Store"}</span>
                            </div>
                            <div className="text-xs font-black text-slate-900 pt-0.5">
                              ${Number(order.totalAmount || firstItem.price).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Middle/Right: Status with Flipkart Green/Blue dot */}
                        <div className="sm:text-right space-y-1 shrink-0">
                          <div className="flex items-center sm:justify-end gap-2 text-xs font-bold">
                            <span className={`w-2.5 h-2.5 rounded-full ${isDelivered ? "bg-[#388e3c]" : "bg-[#2874f0] animate-ping"}`} />
                            <span className={isDelivered ? "text-[#388e3c]" : "text-[#2874f0]"}>
                              {order.statusMessage || (isDelivered ? "Delivered" : "In Transit")}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {order.statusDetail || "Your item has been tracked."}
                          </div>
                        </div>

                      </div>

                      {/* Bottom Action Buttons Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs font-bold">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedTrackingOrder(order)}
                            className="text-[#2874f0] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>📍</span> Track Package
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="text-slate-600 hover:text-[#2874f0] flex items-center gap-1 cursor-pointer"
                          >
                            <span>📄</span> Invoice
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReviewItem(firstItem)}
                            className="text-[#2874f0] hover:text-[#1e60db] px-2 py-1 bg-blue-50 rounded border border-blue-200 cursor-pointer"
                          >
                            ★ Rate & Review
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBuyAgain(firstItem)}
                            className="px-3 py-1 bg-[#ff9f00] hover:bg-[#f59400] text-slate-950 font-black rounded cursor-pointer shadow-xs"
                          >
                            Buy Again
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* ================= 1. TRACKING TIMELINE MODAL ================= */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-slide-down">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Track Order #{selectedTrackingOrder._id?.slice(-8)}</h3>
                <span className="text-[11px] text-slate-500">Carrier: {selectedTrackingOrder.carrier || "SuperFast Priority"}</span>
              </div>
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-black cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* 5-Step Delivery Timeline */}
            <div className="space-y-4 py-2">
              {[
                { title: "Order Confirmed", time: "Aug 14, 9:30 AM", done: true },
                { title: "Packed & Verified", time: "Aug 14, 2:15 PM", done: true },
                { title: "Shipped from Regional Hub", time: "Aug 15, 6:00 AM", done: true },
                { title: "Out for Delivery", time: "Aug 16, 9:00 AM", done: selectedTrackingOrder.status === "Delivered" || selectedTrackingOrder.status === "In Transit" },
                { title: "Delivered", time: "Estimated Tomorrow", done: selectedTrackingOrder.status === "Delivered" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step.done ? "bg-[#388e3c] text-white" : "bg-slate-200 text-slate-400"}`}>
                      {step.done ? "✓" : idx + 1}
                    </span>
                    {idx < 4 && <span className={`w-0.5 h-6 ${step.done ? "bg-[#388e3c]" : "bg-slate-200"}`} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{step.title}</div>
                    <div className="text-[10px] text-slate-400">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. INVOICE MODAL ================= */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-slide-down">
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Tax Invoice</h3>
                <span className="text-xs text-slate-500 font-mono">Invoice #{selectedInvoiceOrder._id}</span>
              </div>
              <button onClick={() => setSelectedInvoiceOrder(null)} className="text-slate-400 text-lg font-black">×</button>
            </div>

            <div className="text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Sold By:</span>
                <span className="font-bold">{selectedInvoiceOrder.vendorStore || "Verified Store"}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold">{selectedInvoiceOrder.paymentMethod || "Prepaid"}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-[#388e3c]">${Number(selectedInvoiceOrder.totalAmount).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                🖨️ Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. RATE & REVIEW MODAL ================= */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-slide-down">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900">Rate Product</h3>
              <button type="button" onClick={() => setSelectedReviewItem(null)} className="text-slate-400 text-lg font-black">×</button>
            </div>

            <div className="text-xs font-bold text-slate-700">{selectedReviewItem.name}</div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Your Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    className={`text-2xl ${reviewRating >= s ? "text-amber-400" : "text-slate-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Feedback Comments:</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you love about this item?"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedReviewItem(null)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2874f0] text-white text-xs font-black rounded-lg"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
