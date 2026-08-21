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
  const [quickViewVendor, setQuickViewVendor] = useState(null);

  // Curated Vendor Directory with Gaurav, Srivalli, Riya, and Anuj stores
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
      avatarBg: "from-indigo-600 to-purple-600",
      bannerBg: "from-slate-900 via-indigo-950 to-slate-900",
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
      bannerBg: "from-slate-900 via-amber-950 to-slate-900",
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
      bannerBg: "from-slate-900 via-pink-950 to-slate-900",
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
      bannerBg: "from-slate-900 via-emerald-950 to-slate-900",
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
    { id: "Electronics", label: "🎧 Gaurav (Tech & Audio)", count: 1 },
    { id: "Watches", label: "⌚ Srivalli (Luxury Watches)", count: 1 },
    { id: "Beauty", label: "💄 Riya (Clean Beauty)", count: 1 },
    { id: "Fashion", label: "👕 Anuj (Streetwear & Sport)", count: 1 },
  ];

  // Filter vendors by category and search
  const filteredVendors = vendorProfiles.filter((v) => {
    const matchesCategory = activeCategory === "All" || v.category === activeCategory;
    const matchesSearch =
      !vendorSearch ||
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.tagline.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.categoryLabel.toLowerCase().includes(vendorSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFilterClick = (vendorId) => {
    onSelectVendor(vendorId);
    // Smooth scroll to catalog
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Verified Brand Hubs
            </span>
            <span className="text-xs text-indigo-300 font-semibold">
              Multi-Tenant Direct Stores
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Featured Partner Stores & Brands
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Shop directly from verified independent designers, boutique creators, and authorized tech manufacturers with 100% buyer protection.
          </p>
        </div>

        {/* Search & Active Store Status */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search store name or specialty..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-400 transition"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          {selectedVendor !== "All" && (
            <button
              onClick={() => onSelectVendor("All")}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl whitespace-nowrap shadow-md transition"
            >
              Reset Filter ({selectedVendor})
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto scrollbar-none py-4">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              activeCategory === tab.id
                ? "bg-white text-slate-900 shadow-lg scale-105"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeCategory === tab.id
                  ? "bg-slate-200 text-slate-900"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Vendor Showcase Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pt-2">
        {filteredVendors.map((vendor) => {
          const isSelected = selectedVendor === vendor.id;

          // Find products for this vendor from real catalog if available
          const vendorCatalogItems = products.filter(
            (p) => p.vendorName === vendor.id
          );
          const displaySampleItems =
            vendorCatalogItems.length > 0 ? vendorCatalogItems.slice(0, 3) : vendor.sampleItems;

          return (
            <div
              key={vendor.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? "bg-slate-800/95 border-indigo-400 ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]"
                  : "bg-slate-800/50 hover:bg-slate-800/90 border-slate-700/80 hover:border-indigo-400 hover:shadow-xl"
              }`}
            >
              {/* Card Cover Banner */}
              <div className={`h-24 bg-gradient-to-r ${vendor.bannerBg} p-4 relative flex items-start justify-between`}>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
                  {vendor.categoryLabel}
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                  {vendor.discountBadge}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between -mt-8">
                <div>
                  {/* Brand Avatar & Official Badge */}
                  <div className="flex items-end justify-between mb-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${vendor.avatarBg} p-0.5 shadow-xl ring-4 ring-slate-800`}>
                      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
                        {vendor.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-xs font-bold text-amber-300 shadow-sm">
                      <span>★</span>
                      <span>{vendor.rating}</span>
                      <span className="text-slate-400 font-normal text-[10px]">({vendor.reviewCount})</span>
                    </div>
                  </div>

                  {/* Brand Title & Tagline */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition">
                        {vendor.name}
                      </h3>
                      <span
                        title="Verified Merchant"
                        className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold"
                      >
                        ✓
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                      {vendor.tagline}
                    </p>
                  </div>

                  {/* Trust Per-card Badges */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-300">
                    <span className="text-indigo-400 font-bold">{vendor.shippingSpeed}</span>
                    <span>•</span>
                    <span className="text-slate-400">Est. {vendor.joinedYear}</span>
                  </div>

                  {/* Mini Product Preview Strip */}
                  <div className="mt-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                      Popular Products:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {displaySampleItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/70 hover:border-indigo-400/60 transition group/item"
                        >
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            className="w-full h-12 object-cover rounded-lg bg-slate-800"
                            onError={(e) => handleImageError(e, vendor.category, item.name)}
                          />
                          <div className="mt-1">
                            <span className="text-[10px] font-bold text-white block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-black text-emerald-400">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-700/80">
                  <button
                    onClick={() => handleFilterClick(vendor.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    <span>{isSelected ? "✓ Active Filter" : "🛍️ Filter Catalog"}</span>
                  </button>

                  <Link
                    to={`/store/${vendor.slug}`}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-700/80 hover:bg-white hover:text-slate-900 text-slate-200 transition-all text-center flex items-center justify-center gap-1 border border-slate-600/80 hover:border-white"
                  >
                    <span>Storefront →</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner Bar */}
      <div className="relative z-10 mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">🔒 Multi-Tenant Escrow Protected</span>
          <span>•</span>
          <span>Each order is scoped to independent verified seller accounts.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectVendor("All")}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
          >
            View Entire Marketplace ({products.length} items)
          </button>
        </div>
      </div>
    </section>
  );
}
