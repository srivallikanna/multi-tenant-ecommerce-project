import React, { useState, useEffect } from "react";
import { getProductImage, handleImageError } from "../utils/imageUtils";

export default function BigDealsSection({ products = [], onAddToCart }) {
  const [activeTab, setActiveTab] = useState("All");
  
  // Real-time Ticking Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealCategories = [
    { id: "All", label: "🔥 All Flash Deals" },
    { id: "Electronics", label: "🎧 Audio & Tech" },
    { id: "Fashion", label: "👟 Footwear & Apparel" },
    { id: "Home & Kitchen", label: "🏠 Home & Kitchen" },
  ];

  // Process catalog items into deals with realistic discounts
  const dealsList = products.map((product, index) => {
    const discountPercent = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : [35, 45, 50, 30, 40, 25][index % 6];

    const originalPrice = product.originalPrice || (product.price * (1 + discountPercent / 100)).toFixed(2);
    const claimedPercent = [88, 76, 92, 64, 83, 95][index % 6];
    const itemsLeft = [2, 5, 3, 7, 4, 1][index % 6];

    return {
      ...product,
      discountPercent,
      originalPrice,
      claimedPercent,
      itemsLeft,
    };
  });

  const filteredDeals = dealsList.filter((deal) => {
    if (activeTab === "All") return true;
    if (activeTab === "Electronics") return deal.category?.toLowerCase().includes("electronic") || deal.category?.toLowerCase().includes("gaming");
    if (activeTab === "Fashion") return deal.category?.toLowerCase().includes("fashion") || deal.category?.toLowerCase().includes("sport");
    if (activeTab === "Home & Kitchen") return deal.category?.toLowerCase().includes("home") || deal.category?.toLowerCase().includes("kitchen");
    return true;
  }).slice(0, 8);

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border border-indigo-100/80 rounded-3xl p-6 shadow-sm text-slate-900 space-y-6">
      {/* Deals Header & Timer Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              ⚡ TODAY'S BIG DEALS
            </span>
            <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Up to 60% OFF
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Limited-Time Vendor Deals
          </h3>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white border border-indigo-200 px-4 py-2 rounded-2xl flex items-center gap-3 self-start sm:self-center shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
            Ends In:
          </span>
          <div className="flex items-center gap-1 font-mono text-sm font-black text-indigo-900">
            <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{String(timeLeft.hours).padStart(2, "0")}h</span>
            <span>:</span>
            <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700">{String(timeLeft.minutes).padStart(2, "0")}m</span>
            <span>:</span>
            <span className="bg-indigo-50 px-2 py-0.5 rounded text-rose-600">{String(timeLeft.seconds).padStart(2, "0")}s</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {dealCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === cat.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Big Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDeals.map((deal) => (
          <div
            key={deal._id}
            className="group bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2 bg-slate-100 flex items-center justify-center">
              <img
                src={getProductImage(deal)}
                alt={deal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => handleImageError(e, deal.category)}
              />
              
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                -{deal.discountPercent}% OFF
              </div>

              <div className="absolute bottom-2 left-2 bg-white/95 text-indigo-700 border border-indigo-100 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                🏪 {deal.vendorName || "Tenant Vendor"}
              </div>
            </div>

            <div className="space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {deal.name}
                </h4>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold">
                  <span className="text-red-600">🔥 {deal.claimedPercent}% Claimed</span>
                  <span>{deal.itemsLeft} left</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full"
                    style={{ width: `${deal.claimedPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[9px] text-slate-400 line-through block">
                    ${Number(deal.originalPrice).toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    ${Number(deal.price).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={(e) => onAddToCart(e, deal)}
                  disabled={deal.stock <= 0}
                  className="px-3.5 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 text-xs font-black rounded-full shadow-xs border border-[#fcd200] transition active:scale-95 flex items-center gap-1"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
