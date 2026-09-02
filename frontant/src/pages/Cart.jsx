import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import CouponSection from "../components/CouponSection";
import AddressManager from "../components/AddressManager";
import PaymentSection from "../components/PaymentSection";
import { formatAddress, getSavedAddresses } from "../utils/addressUtils";
import api from "../api/axios";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const [savedForLater, setSavedForLater] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [activeAddress, setActiveAddress] = useState(null);

  // In-Cart Express Buy / Checkout Drawer Toggle
  const [showExpressBuy, setShowExpressBuy] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    const list = getSavedAddresses();
    if (list.length > 0) {
      const def = list.find((a) => a.isDefault) || list[0];
      setActiveAddress(def);
    }
  }, []);

  // Pricing calculations
  const rawSubtotal = getCartTotal();
  const standardShipping = rawSubtotal > 499 || rawSubtotal === 0 ? 0 : 40;
  
  // Coupon calculation
  let couponDiscount = 0;
  let finalShipping = standardShipping;

  if (appliedCoupon) {
    couponDiscount = appliedCoupon.discountAmount || 0;
    if (appliedCoupon.freeShipping) {
      finalShipping = 0;
    }
  }

  const mrpTotal = rawSubtotal * 1.35; // Estimated MRP
  const productDiscount = mrpTotal - rawSubtotal;
  const platformFee = rawSubtotal > 0 ? 5 : 0;
  const grandTotal = Math.max(0, rawSubtotal - couponDiscount + finalShipping + platformFee);
  const totalSavings = productDiscount + couponDiscount + (standardShipping - finalShipping);

  // Free shipping threshold (₹499)
  const freeShippingThreshold = 499;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const freeShippingPct = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));

  const handleSaveForLater = (item) => {
    setSavedForLater([...savedForLater, item]);
    removeFromCart(item._id);
  };

  const handleMoveToCart = (item) => {
    setSavedForLater(savedForLater.filter((i) => i._id !== item._id));
    updateQuantity(item._id, item.quantity || 1);
  };

  const handleProceedToCheckout = () => {
    if (appliedCoupon) {
      sessionStorage.setItem('checkout_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      sessionStorage.removeItem('checkout_applied_coupon');
    }
    navigate('/checkout');
  };

  // Direct In-Cart Quick Buy / Place Order
  const handleInCartPlaceOrder = async (e) => {
    e?.preventDefault?.();

    if (!activeAddress) {
      alert("Please select or add a delivery address to complete your order.");
      return;
    }

    if (!isPaymentReady) {
      alert("Please complete payment details or security verification.");
      return;
    }

    setSubmittingOrder(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const newOrder = {
      _id: orderId,
      customerId: user._id || user.id || "cust_" + Date.now(),
      customerName: activeAddress.fullName || user.name || "Valued Customer",
      customerEmail: user.email || "customer@example.com",
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        vendorName: item.vendorName || "Verified Merchant",
      })),
      totalAmount: grandTotal,
      totalPrice: grandTotal,
      subtotal: rawSubtotal,
      discountAmount: couponDiscount,
      couponApplied: appliedCoupon ? appliedCoupon.code : null,
      shippingFee: finalShipping,
      address: activeAddress,
      shippingAddress: formatAddress(activeAddress),
      paymentMethod:
        paymentData?.paymentData?.method === "UPI"
          ? `UPI (${paymentData.paymentData.type || "QR"})`
          : paymentData?.paymentData?.method || "UPI (Verified)",
      paymentDetails: paymentData?.paymentData || {},
      status: "Placed",
      createdAt: new Date().toISOString(),
      trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: "SuperFast Express Logistics",
      estimatedDelivery: "Tomorrow by 5:00 PM",
    };

    try {
      await api.post("/orders", newOrder, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.warn("Backend order save fallback:", err);
    }

    const existingOrders = JSON.parse(localStorage.getItem("all_placed_orders") || "[]");
    existingOrders.unshift(newOrder);
    localStorage.setItem("all_placed_orders", JSON.stringify(existingOrders));

    clearCart();
    setOrderSuccess(newOrder);
    setSubmittingOrder(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 flex-1 w-full space-y-4">
        {/* Breadcrumb strip */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <span className="text-slate-800 font-black">
            Shopping Cart ({cartItems.reduce((sum, it) => sum + (it.quantity || 1), 0)} items)
          </span>
        </div>

        {/* ORDER SUCCESS MODAL */}
        {orderSuccess ? (
          <div className="max-w-2xl mx-auto py-10 px-6 sm:px-10 bg-white rounded-3xl border border-slate-200 shadow-lg text-center space-y-6 animate-slide-down">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-md">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                Order Confirmed & Payment Verified
              </span>
              <h1 className="text-2xl font-black text-slate-900 pt-2">
                Thank You for Your Purchase!
              </h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your order has been recorded successfully. Live tracking details and invoice receipt are ready.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-left space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order ID:</span>
                <span className="text-[#2874f0] font-black">{orderSuccess._id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Total Amount Paid:</span>
                <span className="text-emerald-700 font-black text-sm">
                  ₹{Number(orderSuccess.totalAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="text-slate-800 font-bold">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="text-slate-800 font-bold text-right truncate max-w-[280px]">
                  {orderSuccess.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="text-emerald-700 font-black">{orderSuccess.estimatedDelivery}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="w-full sm:w-auto px-8 py-3 bg-[#2874f0] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
              >
                Track Live Order & View Invoice →
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4 max-w-xl mx-auto">
            <div className="text-6xl">🛒</div>
            <h2 className="text-xl font-black text-slate-900">Your Cart is Empty!</h2>
            <p className="text-xs text-slate-500">
              Explore thousands of verified products from top independent merchants and add your favorites.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-[#2874f0] hover:bg-[#1e60db] text-white text-xs font-black rounded-xl shadow-xs transition"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          /* ================= 2-COLUMN CART LAYOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ================= LEFT COLUMN: ADDRESS & CART ITEMS (8 COLS) ================= */}
            <div className="lg:col-span-8 space-y-4">
              {/* Delivery Address Header Card */}
              {activeAddress && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-lg text-[#2874f0]">📍</span>
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Deliver to: <span className="text-slate-800 font-black">{activeAddress.fullName}, {activeAddress.pincode}</span>
                        <span className="ml-2 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded text-[9px] font-black">{activeAddress.type || 'HOME'}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 truncate max-w-md">
                        {activeAddress.address}, {activeAddress.city}, {activeAddress.state}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowExpressBuy(!showExpressBuy)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874f0] text-xs font-bold rounded-lg border border-blue-200 self-start sm:self-center transition cursor-pointer"
                  >
                    {showExpressBuy ? "Hide Buy Section ▲" : "Express Buy Section ▼"}
                  </button>
                </div>
              )}

              {/* Free Shipping Progress Indicator */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-1.5">
                    <span>🚚</span>
                    {rawSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700 font-black">
                        🎉 Congratulations! You unlocked FREE Delivery!
                      </span>
                    ) : (
                      <span>
                        Add items worth <span className="text-[#2874f0] font-black">₹{amountToFreeShipping.toFixed(2)}</span> more for <span className="text-emerald-600 font-bold">FREE Delivery</span>
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">{freeShippingPct}%</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2874f0] to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingPct}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List Container */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {cartItems.map((item, idx) => {
                  const origPrice = item.originalPrice || (item.price * 1.35).toFixed(2);
                  const discountPct = Math.round(((origPrice - item.price) / origPrice) * 100);

                  return (
                    <div key={`${item._id || 'item'}-${idx}`} className="p-4 sm:p-5 space-y-3">
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${item._id}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl border border-slate-200 p-1 shrink-0 overflow-hidden"
                        >
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            onError={(e) => handleImageError(e, item.name)}
                            className="w-full h-full object-contain"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/product/${item._id}`}>
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#2874f0] transition line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <span className="text-[11px] text-slate-500 shrink-0">
                              Delivery by <span className="font-bold text-slate-800">Tomorrow</span>
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium">
                            Seller: <span className="text-slate-800 font-bold">{item.vendorName || "Verified Merchant"}</span>
                            <span className="text-[#2874f0] font-black bg-blue-50 px-1.5 py-0.2 rounded ml-2">⚡ Verified</span>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-base font-black text-slate-900">
                              ₹{Number(item.price).toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{Number(origPrice).toFixed(2)}
                            </span>
                            <span className="text-xs font-black text-[#388e3c]">
                              {discountPct}% off
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Action Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-9 h-7 border border-slate-300 rounded flex items-center justify-center text-xs font-black text-slate-900 bg-slate-50">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Save for later & Remove */}
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                          <button
                            type="button"
                            onClick={() => handleSaveForLater(item)}
                            className="hover:text-[#2874f0] cursor-pointer"
                          >
                            SAVE FOR LATER
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Action Bar */}
                <div className="p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-500 font-semibold">Total Payable: </span>
                    <span className="text-base font-black text-slate-900">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowExpressBuy(!showExpressBuy)}
                      className="px-5 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874f0] font-black text-xs sm:text-sm rounded-xl transition cursor-pointer"
                    >
                      {showExpressBuy ? "▲ Hide Buy Section" : "⚡ Quick Buy Here"}
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToCheckout}
                      className="px-6 py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= IN-CART BUY SECTION (EXPRESS CHECKOUT DRAWER) ================= */}
              {showExpressBuy && (
                <div className="bg-white rounded-2xl border-2 border-[#2874f0] p-5 shadow-lg space-y-5 animate-slide-down">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        IN-CART EXPRESS BUY SECTION
                      </h3>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      Payable: ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* 1. Address Section in Cart */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span>1. Delivery Address (Auto-detected or Saved)</span>
                    </h4>
                    <AddressManager
                      selectedAddressId={activeAddress?.id}
                      onSelectAddress={(addr) => setActiveAddress(addr)}
                    />
                  </div>

                  {/* 2. Payment Section in Cart */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span>2. Payment Mode (Open Navi, GPay, PhonePe, Cards, COD)</span>
                    </h4>
                    <PaymentSection
                      totalAmount={grandTotal}
                      orderId={orderId}
                      onPaymentReady={({ isValid, paymentData }) => {
                        setIsPaymentReady(isValid);
                        setPaymentData({ isValid, paymentData });
                      }}
                    />
                  </div>

                  {/* 3. In-Cart Instant Place Order Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleInCartPlaceOrder}
                      disabled={submittingOrder || !isPaymentReady}
                      className={`w-full py-4 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                        isPaymentReady && !submittingOrder
                          ? "bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95"
                          : "bg-slate-300 cursor-not-allowed text-slate-500"
                      }`}
                    >
                      <span>🔒</span>
                      <span>
                        {submittingOrder
                          ? "CONFIRMING ORDER..."
                          : `CONFIRM & PAY ₹${grandTotal.toFixed(2)}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Saved For Later items */}
              {savedForLater.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Saved For Later ({savedForLater.length})
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {savedForLater.map((item) => (
                      <div key={item._id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            className="w-12 h-12 object-contain rounded bg-slate-50 p-1"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-800 line-clamp-1">
                              {item.name}
                            </div>
                            <div className="text-xs font-black text-slate-900">
                              ₹{Number(item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(item)}
                          className="px-3 py-1.5 bg-blue-50 text-[#2874f0] text-xs font-bold rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                        >
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ================= RIGHT COLUMN: COUPONS & PRICE DETAILS (4 COLS) ================= */}
            <div className="lg:col-span-4 space-y-4">
              {/* COUPONS & OFFERS COMPONENT */}
              <CouponSection
                subtotal={rawSubtotal}
                shippingFee={standardShipping}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={(res) => setAppliedCoupon(res)}
                onRemoveCoupon={() => setAppliedCoupon(null)}
              />

              {/* PRICE DETAILS CARD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
                  PRICE DETAILS
                </h3>

                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span>Price ({cartItems.reduce((sum, it) => sum + (it.quantity || 1), 0)} items)</span>
                    <span>₹{mrpTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#388e3c]">
                    <span>Discount on MRP</span>
                    <span>-₹{productDiscount.toFixed(2)}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    {finalShipping === 0 ? (
                      <span className="text-[#388e3c] font-black">
                        <span className="line-through text-slate-400 text-[11px] mr-1">₹40</span>
                        FREE
                      </span>
                    ) : (
                      <span>₹{finalShipping.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span>Platform / Packaging Fee</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                    <span>Total Amount Payable</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Savings Pill */}
                {totalSavings > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold text-center">
                    🎉 You will save ₹{totalSavings.toFixed(2)} on this order!
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowExpressBuy(!showExpressBuy)}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-[#2874f0] hover:from-blue-700 hover:to-blue-600 active:scale-95 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>{showExpressBuy ? "CLOSE BUY SECTION" : "QUICK BUY HERE IN CART"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Go to Multi-Step Checkout Page</span>
                    <span>➔</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-medium flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Safe and Secure Payments. 100% Authentic Products.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
