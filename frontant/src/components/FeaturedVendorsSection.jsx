import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getProductImage, handleImageError } from "../utils/imageUtils";

export default function FeaturedVendorsSection({
  products = [],
  selectedVendor = "All",
  onSelectVendor,
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [vendorSearch, setVendorSearch] = useState("");

  // Curated Vendor Directory
  const vendorProfiles = [
    {
      id: "Gaurav Store",
      slug: "gaurav-store",
      name: "Gaurav's Store",
      tagline: "High-Fidelity Studio Sound, Acoustics & Tech Gear",
      category: "Electronics",
      categoryLabel: "Audio & Tech",
      rating: 4.9,
      reviewCount: 384,
      joinedYear: "2024",
      shippingSpeed: "⚡ 24h Express Dispatch",
      discountBadge: "🔥 UP TO 20% OFF",
      avatarBg: "from-blue-600 to-indigo-700",
      bannerBg: "from-blue-600 to-indigo-800",
      badgeText: "Verified Tech Merchant",
      sampleItems: [
        { name: "Noise-Canceling Headphones", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
        { name: "True Wireless Earbuds Pro", price: 129.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60" },
        { name: "RGB Mechanical Keyboard", price: 119.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
      ],
      description: "Curated by Gaurav with studio monitors, high-fidelity wireless audio, noise-canceling headphones, and custom mechanical peripherals.",
    },
    {
      id: "Srivalli Store",
      slug: "srivalli-store",
      name: "Srivalli's Store",
      tagline: "Handcrafted Luxury Timepieces & Horology",
      category: "Watches",
      categoryLabel: "Luxury Watches",
      rating: 4.9,
      reviewCount: 295,
      joinedYear: "2024",
      shippingSpeed: "🛡️ Insured Free Shipping",
      discountBadge: "✨ Free Leather Strap",
      avatarBg: "from-amber-600 to-orange-600",
      bannerBg: "from-amber-600 to-orange-700",
      badgeText: "Master Horologist",
      sampleItems: [
        { name: "Minimalist Automatic Watch", price: 289.00, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60" },
        { name: "Vintage Leather Chronograph", price: 340.00, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60" },
        { name: "Titanium Sport Diver", price: 410.00, image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=500&auto=format&fit=crop&q=60" },
      ],
      description: "Exclusive luxury watch collections selected by Srivalli. Hand-assembled automatic movements paired with genuine Italian leather straps.",
    },
    {
      id: "Riya Store",
      slug: "riya-store",
      name: "Riya's Store",
      tagline: "Botanical Clean Skincare, Glow & Beauty Essentials",
      category: "Beauty",
      categoryLabel: "Clean Beauty",
      rating: 4.9,
      reviewCount: 312,
      joinedYear: "2025",
      shippingSpeed: "🌿 Free Samples with Every Order",
      discountBadge: "✨ 20% OFF Radiance Set",
      avatarBg: "from-pink-600 to-rose-500",
      bannerBg: "from-pink-600 to-rose-700",
      badgeText: "100% Organic Certified",
      sampleItems: [
        { name: "Hyaluronic Acid Glow Serum", price: 48.00, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60" },
        { name: "Botanical Rose Cleansing Oil", price: 36.50, image: "https://images.unsplash.com/photo-1608248597359-5936735e5d95?w=500&auto=format&fit=crop&q=60" },
        { name: "Ceramide Barrier Night Cream", price: 54.00, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60" },
      ],
      description: "Dermatologically tested clean botanical skincare formulated with cold-pressed oils, hyaluronic acids, and certified natural essences by Riya.",
    },
    {
      id: "Anuj Store",
      slug: "anuj-store",
      name: "Anuj's Store",
      tagline: "Modern Urban Streetwear, Outerwear & Active Footwear",
      category: "Fashion",
      categoryLabel: "Streetwear & Sport",
      rating: 4.8,
      reviewCount: 245,
      joinedYear: "2024",
      shippingSpeed: "📦 Standard 2-Day Delivery",
      discountBadge: "👕 Buy 2 Get 1 Free",
      avatarBg: "from-emerald-600 to-teal-600",
      bannerBg: "from-emerald-600 to-teal-700",
      badgeText: "Streetwear Icon",
      sampleItems: [
        { name: "Vintage Oversized Denim Jacket", price: 89.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60" },
        { name: "Heavyweight Boxy Tee", price: 42.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60" },
        { name: "Carbon-Plate Running Shoes", price: 159.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" },
      ],
      description: "Anuj's premium curation of heavyweight organic cotton apparel, urban denim jackets, waterproof cargo trousers, and responsive athletic footwear.",
    },
  ];

  // Category filter tabs
  const filterTabs = [
    { id: "All", label: "🌟 All Brands", count: vendorProfiles.length },
    { id: "Electronics", label: "🎧 Gaurav (Tech)", count: 1 },
    { id: "Watches", label: "⌚ Srivalli (Watches)", count: 1 },
    { id: "Beauty", label: "💄 Riya (Beauty)", count: 1 },
    { id: "Fashion", label: "👟 Anuj (Streetwear)", count: 1 },
  ];

  const filteredVendors = vendorProfiles.filter((v) => {
    const matchesCategory = activeCategory === "All" || v.category === activeCategory;
    const matchesSearch =
      !vendorSearch ||
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.tagline.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.categoryLabel.toLowerCase().includes(vendorSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm relative space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#2874f0] text-white shadow-xs">
              🏬 VERIFIED TENANT HUBS
            </span>
            <span className="text-xs text-slate-500 font-bold">
              100% Direct Store Inventory
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Featured Partner Brand Stores
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Shop directly from verified independent creators and authorized merchants with unified cart & fast shipping.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search partner store..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
            />
            <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeCategory === tab.id
                ? "bg-[#2874f0] text-white shadow-xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Vendor Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredVendors.map((vendor) => {
          return (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Banner */}
              <div className={`h-20 bg-gradient-to-r ${vendor.bannerBg} p-3 relative flex items-start justify-between text-white`}>
                <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[10px] font-bold">
                  {vendor.categoryLabel}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#388e3c] text-[10px] font-black shadow-xs">
                  ★ {vendor.rating}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between -mt-6">
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${vendor.avatarBg} p-0.5 shadow-md ring-2 ring-white`}>
                      <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-lg font-black text-white">
                        {vendor.name.charAt(0)}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Est. {vendor.joinedYear}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 group-hover:text-[#2874f0] transition mt-1">
                    {vendor.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {vendor.tagline}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span>{vendor.shippingSpeed}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <Link
                    to={`/store/${vendor.slug}`}
                    className="w-full py-2 bg-blue-50 hover:bg-[#2874f0] text-[#2874f0] hover:text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Visit Storefront</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
