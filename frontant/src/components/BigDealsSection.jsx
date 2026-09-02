import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductImage, handleImageError } from "../utils/imageUtils";

export default function BigDealsSection({ products = [], onAddToCart }) {
  const [activeTab, setActiveTab] = useState("All");
  
  // Real-time Countdown Timer
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
    { id: "All", label: "🔥 All Top Deals" },
    { id: "Electronics", label: "🎧 Audio & Tech" },
    { id: "Fashion", label: "👟 Footwear & Apparel" },
    { id: "Beauty", label: "💄 Clean Beauty" },
  ];

  // Process catalog items into deals with realistic discounts
  const dealsList = products.map((product, index) => {
    const rawPrice = Number(product.price) || 0;
    const rawOriginalPrice = Number(product.originalPrice) || 0;

    const discountPercent = rawOriginalPrice > rawPrice
      ? Math.round(((rawOriginalPrice - rawPrice) / rawOriginalPrice) * 100)
      : [45, 50, 35, 60, 40, 30][index % 6];

    const originalPrice = rawOriginalPrice > 0 
      ? rawOriginalPrice 
      : (rawPrice * (1 + discountPercent / 100));

    const claimedPercent = [88, 76, 92, 64, 83, 95][index % 6];
    const itemsLeft = [2, 5, 3, 7, 4, 1][index % 6];

    return {
      ...product,
      price: rawPrice,
      discountPercent,
      originalPrice,
      claimedPercent,
      itemsLeft,
    };
  });

  const filteredDeals = dealsList.filter((deal) => {
    if (activeTab === "All") return true;
    if (activeTab === "Electronics") return deal.category?.toLowerCase().includes("electronic") || deal.category?.toLowerCase().includes("audio") || deal.category?.toLowerCase().includes("tech");
    if (activeTab === "Fashion") return deal.category?.toLowerCase().includes("fashion") || deal.category?.toLowerCase().includes("sport") || deal.category?.toLowerCase().includes("watch");
    if (activeTab === "Beauty") return deal.category?.toLowerCase().includes("beauty") || deal.category?.toLowerCase().includes("skin");
    return true;
  }).slice(0, 8);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
      {/* Deals Header & Timer Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#2874f0] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              ⚡ DEALS OF THE DAY
            </span>
            <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Up to 60% OFF
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Top Picks with Mega Discounts
          </h3>
        </div>

        {/* Flipkart style Countdown Clock */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
            <span className="text-slate-500 text-xs">⏳</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Ends In:
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-black text-slate-800">
              <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-[#2874f0]">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span className="text-slate-400">:</span>
              <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-[#2874f0]">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span className="text-slate-400">:</span>
              <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-[#2874f0]">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          <a
            href="#catalog"
            className="px-4 py-1.5 bg-[#2874f0] hover:bg-[#1e60db] text-white text-xs font-black rounded-lg shadow-xs transition cursor-pointer"
          >
            VIEW ALL
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {dealCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === cat.id
                ? "bg-[#2874f0] text-white shadow-xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Deals Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDeals.map((deal) => (
          <div
            key={deal._id}
            className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all duration-200 group relative"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="bg-[#388e3c] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                {deal.discountPercent}% OFF
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                ⚡ Only {deal.itemsLeft} left
              </span>
            </div>

            {/* Product Image */}
            <Link to={`/product/${deal._id}`} className="block relative aspect-square rounded-lg overflow-hidden bg-slate-50 mb-3 cursor-pointer">
              <img
                src={getProductImage(deal)}
                alt={deal.name}
                onError={(e) => handleImageError(e, deal.name)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1.5 left-1.5 bg-slate-900/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                {deal.vendorName || "Verified Store"}
              </span>
            </Link>

            {/* Info */}
            <div className="space-y-1.5 mb-3">
              <Link to={`/product/${deal._id}`}>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#2874f0] transition">
                  {deal.name}
                </h4>
              </Link>

              {/* Price & Rating */}
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-slate-900">
                  ${(Number(deal.price) || 0).toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ${(Number(deal.originalPrice) || Number(deal.price) || 0).toFixed(2)}
                </span>
              </div>

              {/* Claimed Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Claimed: {deal.claimedPercent}%</span>
                  <span className="text-emerald-600 font-bold">Fast Selling</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#ff9f00] rounded-full"
                    style={{ width: `${deal.claimedPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => onAddToCart && onAddToCart(deal, e)}
                className="flex-1 py-2 bg-[#ff9f00] hover:bg-[#f59400] active:scale-95 text-slate-900 font-black text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🛒</span> Add to Cart
              </button>
              <Link
                to={`/product/${deal._id}`}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] rounded-lg transition font-bold text-xs"
                title="View Details"
              >
                →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
