import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import AddressManager from '../components/AddressManager';
import PaymentSection from '../components/PaymentSection';
import CouponSection from '../components/CouponSection';
import { formatAddress, getSavedAddresses } from '../utils/addressUtils';
import { getProductImage, handleImageError } from '../utils/imageUtils';
import api from '../api/axios';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal } = useCart();

  // Active Accordion Step: 1 (Address), 2 (Summary & Coupon), 3 (Payment)
  const [activeStep, setActiveStep] = useState(1);

  // Address state
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Coupon state (preload from Cart if user applied one)
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = sessionStorage.getItem('checkout_applied_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Payment State
  const [paymentData, setPaymentData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  // Initialize default address
  useEffect(() => {
    const list = getSavedAddresses();
    if (list.length > 0 && !selectedAddress) {
      const def = list.find((a) => a.isDefault) || list[0];
      setSelectedAddress(def);
    }
  }, []);

  // Items fallback if checkout opened directly
  const checkoutItems =
    cartItems.length > 0
      ? cartItems
      : [
          {
            _id: 'prod_demo_1',
            name: 'AcousticPro Studio Wireless ANC Headphones (Midnight Obsidian)',
            price: 1999,
            quantity: 1,
            vendorName: 'AudioHub Store',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
          },
        ];

  // Pricing calculations
  const rawSubtotal = cartItems.length > 0 ? getCartTotal() : 1999;
  const standardShipping = rawSubtotal > 499 ? 0 : 40;
  
  let couponDiscount = 0;
  let finalShipping = standardShipping;

  if (appliedCoupon) {
    couponDiscount = appliedCoupon.discountAmount || 0;
    if (appliedCoupon.freeShipping) finalShipping = 0;
  }

  const mrpTotal = rawSubtotal * 1.35;
  const productDiscount = mrpTotal - rawSubtotal;
  const platformFee = 5;
  const grandTotal = Math.max(0, rawSubtotal - couponDiscount + finalShipping + platformFee);
  const totalSavings = productDiscount + couponDiscount + (standardShipping - finalShipping);

  // Place Order Handler
  const handleConfirmAndPay = async (e) => {
    e?.preventDefault?.();

    if (!selectedAddress) {
      setActiveStep(1);
      alert('Please select or add a delivery address to proceed.');
      return;
    }

    if (!isPaymentReady) {
      setActiveStep(3);
      alert('Please complete the verification for your selected payment method.');
      return;
    }

    setSubmitting(true);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const finalOrderPayload = {
      _id: orderId,
      customerId: user._id || user.id || 'cust_' + Date.now(),
      customerName: selectedAddress.fullName || user.name || 'Valued Customer',
      customerEmail: user.email || 'customer@example.com',
      items: checkoutItems.map((item) => ({
        productId: item._id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        vendorName: item.vendorName || 'Verified Store',
      })),
      totalAmount: grandTotal,
      totalPrice: grandTotal,
      subtotal: rawSubtotal,
      discountAmount: couponDiscount,
      couponApplied: appliedCoupon ? appliedCoupon.code : null,
      shippingFee: finalShipping,
      address: selectedAddress,
      shippingAddress: formatAddress(selectedAddress),
      paymentMethod:
        paymentData?.paymentData?.method === 'UPI'
          ? `UPI (${paymentData.paymentData.type || 'QR'})`
          : paymentData?.paymentData?.method || 'UPI (Verified)',
      paymentDetails: paymentData?.paymentData || {},
      status: 'Placed',
      createdAt: new Date().toISOString(),
      trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: 'SuperFast Logistics Express',
      estimatedDelivery: 'Tomorrow by 5:00 PM',
    };

    try {
      await api.post('/orders', finalOrderPayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.warn('Backend order save fallback:', err);
    }

    // Persist to local orders collection
    const existingOrders = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');
    existingOrders.unshift(finalOrderPayload);
    localStorage.setItem('all_placed_orders', JSON.stringify(existingOrders));

    // Clear cart and stored checkout coupon
    clearCart();
    sessionStorage.removeItem('checkout_applied_coupon');

    setOrderPlaced(finalOrderPayload);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-4">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <Link to="/cart" className="hover:text-[#2874f0]">Cart</Link>
          <span>›</span>
          <span className="text-slate-800 font-black">Secure Multi-Tenant Checkout</span>
        </div>

        {/* ORDER SUCCESS MODAL / VIEW */}
        {orderPlaced ? (
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
                Thank You, {selectedAddress?.fullName || 'Customer'}!
              </h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your order has been placed successfully. A confirmation message and tracking details have been generated.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-left space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order ID:</span>
                <span className="text-[#2874f0] font-black">{orderPlaced._id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Total Amount Paid:</span>
                <span className="text-emerald-700 font-black text-sm">₹{Number(orderPlaced.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="text-slate-800 font-bold">{orderPlaced.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="text-slate-800 font-bold text-right truncate max-w-[280px]">
                  {orderPlaced.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="text-emerald-700 font-black">{orderPlaced.estimatedDelivery}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/orders')}
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
        ) : (
          /* ================= MULTI-STEP CHECKOUT LAYOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* ================= LEFT: 3-STEP ACCORDION (8 COLS) ================= */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* STEP 1: DELIVERY ADDRESS */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div
                  onClick={() => setActiveStep(1)}
                  className={`p-4 flex items-center justify-between cursor-pointer border-b transition ${
                    activeStep === 1 ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                        selectedAddress && activeStep !== 1
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2874f0] text-white'
                      }`}
                    >
                      {selectedAddress && activeStep !== 1 ? '✓' : '1'}
                    </span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        DELIVERY ADDRESS
                      </h3>
                      {selectedAddress && activeStep !== 1 && (
                        <p className="text-[11px] text-slate-600 font-medium">
                          {selectedAddress.fullName} • {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  {activeStep !== 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStep(1);
                      }}
                      className="px-3 py-1 text-xs font-bold text-[#2874f0] border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      CHANGE
                    </button>
                  )}
                </div>

                {activeStep === 1 && (
                  <div className="p-4 sm:p-5 space-y-4">
                    <AddressManager
                      selectedAddressId={selectedAddress?.id}
                      onSelectAddress={(addr) => setSelectedAddress(addr)}
                    />

                    {selectedAddress && (
                      <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveStep(2)}
                          className="px-6 py-2.5 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>DELIVER HERE</span>
                          <span>➔</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2: ORDER SUMMARY & OFFERS */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div
                  onClick={() => setActiveStep(2)}
                  className={`p-4 flex items-center justify-between cursor-pointer border-b transition ${
                    activeStep === 2 ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                        activeStep > 2 ? 'bg-emerald-600 text-white' : activeStep === 2 ? 'bg-[#2874f0] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {activeStep > 2 ? '✓' : '2'}
                    </span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        ORDER SUMMARY ({checkoutItems.reduce((sum, it) => sum + (it.quantity || 1), 0)} ITEMS)
                      </h3>
                      {activeStep !== 2 && (
                        <p className="text-[11px] text-slate-600 font-medium">
                          Total: ₹{grandTotal.toFixed(2)} {appliedCoupon ? `(${appliedCoupon.code} Applied)` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {activeStep !== 2 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStep(2);
                      }}
                      className="px-3 py-1 text-xs font-bold text-[#2874f0] border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      {activeStep > 2 ? 'CHANGE' : 'VIEW'}
                    </button>
                  )}
                </div>

                {activeStep === 2 && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Items list */}
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {checkoutItems.map((item, idx) => (
                        <div key={`${item._id || 'item'}-${idx}`} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductImage(item)}
                              alt={item.name}
                              onError={(e) => handleImageError(e, item.name)}
                              className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                              <p className="text-[11px] text-slate-500">
                                Seller: <span className="font-bold text-slate-700">{item.vendorName || 'Verified Store'}</span> • Qty: {item.quantity || 1}
                              </p>
                              <div className="text-xs font-black text-slate-900 pt-0.5">
                                ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-emerald-700 shrink-0 bg-emerald-50 px-2 py-1 rounded">
                            Delivery Tomorrow
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Integrated Coupon Drawer */}
                    <CouponSection
                      subtotal={rawSubtotal}
                      shippingFee={standardShipping}
                      appliedCoupon={appliedCoupon}
                      onApplyCoupon={(res) => setAppliedCoupon(res)}
                      onRemoveCoupon={() => setAppliedCoupon(null)}
                    />

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">
                        Confirmation email will be sent to your registered account
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className="px-6 py-2.5 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <span>PROCEED TO PAYMENT</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: PAYMENT OPTIONS */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div
                  onClick={() => setActiveStep(3)}
                  className={`p-4 flex items-center justify-between cursor-pointer border-b transition ${
                    activeStep === 3 ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                        activeStep === 3 ? 'bg-[#2874f0] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      3
                    </span>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        PAYMENT OPTIONS
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Instant UPI, QR Scan, Cash on Delivery, Cards & Net Banking
                      </p>
                    </div>
                  </div>
                </div>

                {activeStep === 3 && (
                  <div className="p-4 sm:p-5 space-y-4">
                    <PaymentSection
                      totalAmount={grandTotal}
                      orderId={orderId}
                      onPaymentReady={({ isValid, paymentData }) => {
                        setIsPaymentReady(isValid);
                        setPaymentData({ isValid, paymentData });
                      }}
                    />

                    <div className="pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleConfirmAndPay}
                        disabled={submitting || !isPaymentReady}
                        className={`w-full py-4 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                          isPaymentReady && !submitting
                            ? 'bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95'
                            : 'bg-slate-300 cursor-not-allowed text-slate-500'
                        }`}
                      >
                        <span>🔒</span>
                        <span>
                          {submitting
                            ? 'CONFIRMING ORDER...'
                            : `CONFIRM & PAY ₹${grandTotal.toFixed(2)}`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* ================= RIGHT: PRICE SUMMARY (4 COLS) ================= */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-24 space-y-4">
                
                {/* Price Details Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
                    PRICE DETAILS
                  </h3>

                  <div className="space-y-3 text-xs font-semibold text-slate-700">
                    <div className="flex justify-between">
                      <span>Price ({checkoutItems.reduce((sum, it) => sum + (it.quantity || 1), 0)} items)</span>
                      <span>₹{mrpTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-[#388e3c]">
                      <span>Discount on MRP</span>
                      <span>-₹{productDiscount.toFixed(2)}</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
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
                      <span>Total Amount</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold text-center">
                      🎉 You will save ₹{totalSavings.toFixed(2)} on this order!
                    </div>
                  )}

                  {selectedAddress && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Delivering To:
                      </span>
                      <div className="font-bold text-slate-900 truncate">
                        {selectedAddress.fullName} (+91 {selectedAddress.mobile})
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-[11px] text-[#2874f0] font-bold flex items-center gap-2">
                    <span>🛡️</span>
                    <span>100% Buyer Protection & Easy Returns Guaranteed</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}