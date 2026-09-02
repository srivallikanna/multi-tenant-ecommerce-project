import React, { useState } from 'react';
import { AVAILABLE_COUPONS, calculateCouponDiscount } from '../utils/couponUtils';

export default function CouponSection({
  subtotal = 0,
  shippingFee = 40,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  const handleApply = (codeToApply) => {
    setErrorMsg('');
    setSuccessMsg('');

    const target = (codeToApply || inputCode).trim().toUpperCase();
    if (!target) {
      setErrorMsg('Please enter a coupon code.');
      return;
    }

    const res = calculateCouponDiscount(target, subtotal, shippingFee);
    if (!res.isValid) {
      setErrorMsg(res.message);
      return;
    }

    setSuccessMsg(res.message);
    if (onApplyCoupon) {
      onApplyCoupon(res);
    }
    setInputCode('');
  };

  const handleRemove = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-base">🏷️</span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Coupons & Offers
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAllCoupons(!showAllCoupons)}
          className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer"
        >
          {showAllCoupons ? 'Hide Offers ▲' : 'View All Offers ▼'}
        </button>
      </div>

      {/* APPLIED COUPON BADGE */}
      {appliedCoupon ? (
        <div className="p-3.5 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              ✓
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-900 tracking-wider font-mono">
                  {appliedCoupon.code}
                </span>
                <span className="px-2 py-0.2 bg-emerald-200 text-emerald-900 text-[10px] font-black rounded-full uppercase">
                  APPLIED
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-bold">
                You saved ₹{appliedCoupon.discountAmount.toFixed(2)} with this coupon!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="px-2.5 py-1 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-lg transition border border-rose-200 cursor-pointer"
          >
            REMOVE
          </button>
        </div>
      ) : (
        /* PROMO CODE INPUT FORM */
        <div className="space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApply();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Coupon (e.g. SAVE20)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0] uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="px-5 py-2.5 bg-[#2874f0] hover:bg-blue-700 active:scale-95 disabled:opacity-40 text-white text-xs font-black rounded-xl transition shadow-xs cursor-pointer"
            >
              APPLY
            </button>
          </form>

          {errorMsg && (
            <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-shake">
              <span>⚠️</span> <span>{errorMsg}</span>
            </p>
          )}
          {successMsg && (
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <span>✓</span> <span>{successMsg}</span>
            </p>
          )}
        </div>
      )}

      {/* EXPANDABLE AVAILABLE COUPONS LIST */}
      {(showAllCoupons || !appliedCoupon) && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Available Verified Offers:
          </span>

          <div className="space-y-2">
            {AVAILABLE_COUPONS.map((coupon) => {
              const isCurrent = appliedCoupon?.code === coupon.code;
              const isEligible = subtotal >= coupon.minOrder;

              return (
                <div
                  key={coupon.code}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 border border-dashed border-slate-400 bg-white rounded text-xs font-black font-mono text-slate-800">
                          {coupon.code}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-black border uppercase tracking-wider ${coupon.badgeColor}`}
                        >
                          {coupon.tag}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-900">{coupon.title}</div>
                      <p className="text-[11px] text-slate-500">{coupon.description}</p>

                      {!isEligible && (
                        <p className="text-[10px] font-bold text-amber-700">
                          ⚡ Add ₹{(coupon.minOrder - subtotal).toFixed(2)} more to unlock this
                          offer
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isCurrent ? (
                        <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                          ✓ APPLIED
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApply(coupon.code)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                            isEligible
                              ? 'bg-[#2874f0] text-white hover:bg-blue-700 active:scale-95 shadow-xs'
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                        >
                          APPLY
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
