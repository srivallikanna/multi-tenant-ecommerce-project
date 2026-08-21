import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerReviewsSection from "../components/CustomerReviewsSection";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

export default function TenantStore() {
  const { tenantSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFollowing, setIsFollowing] = useState(false);

  const { addToCart } = useCart();

  // Map known slugs to rich display titles & badges
  const storeInfoMap = {
    "gaurav-store": {
      name: "Gaurav's Store",
      tagline: "High-Fidelity Studio Sound, Acoustics & Tech Gear",
      icon: "🎧",
      rating: 4.9,
      reviews: 384,
      followers: "14.8k",
      shippingSpeed: "⚡ 24h Express Dispatch",
      bannerGrad: "from-slate-900 via-indigo-950 to-slate-900",
      avatarGrad: "from-indigo-600 to-purple-600",
      perk: "🔥 Free Express Shipping on orders over $50",
    },
    "srivalli-store": {
      name: "Srivalli's Store",
      tagline: "Handcrafted Luxury Timepieces & Horology",
      icon: "⌚",
      rating: 4.9,
      reviews: 295,
      followers: "11.2k",
      shippingSpeed: "🛡️ Insured Free Shipping",
      bannerGrad: "from-slate-900 via-amber-950 to-slate-900",
      avatarGrad: "from-amber-600 to-orange-600",
      perk: "✨ Complimentary Genuine Leather Strap with any watch",
    },
    "riya-store": {
      name: "Riya's Store",
      tagline: "Botanical Clean Skincare, Glow & Beauty Essentials",
      icon: "💄",
      rating: 4.9,
      reviews: 312,
      followers: "24.6k",
      shippingSpeed: "🌿 Free Samples with Every Order",
      bannerGrad: "from-slate-900 via-pink-950 to-slate-900",
      avatarGrad: "from-pink-600 to-rose-500",
      perk: "✨ 20% OFF Radiance Night Serums this week",
    },
    "anuj-store": {
      name: "Anuj's Store",
      tagline: "Modern Urban Streetwear, Outerwear & Active Footwear",
      icon: "👕",
      rating: 4.8,
      reviews: 245,
      followers: "18.3k",
      shippingSpeed: "📦 Standard 2-Day Delivery",
      bannerGrad: "from-slate-900 via-emerald-950 to-slate-900",
      avatarGrad: "from-emerald-600 to-teal-600",
      perk: "👕 Buy 2 Get 1 Free on all Oversized Tees",
    },
    "audiophile-store": {
      name: "Gaurav's Store",
      tagline: "High-Fidelity Studio Sound & Wireless Acoustics",
      icon: "🎧",
      rating: 4.9,
      reviews: 342,
      followers: "12.4k",
      shippingSpeed: "⚡ 24h Express Dispatch",
      bannerGrad: "from-slate-900 via-indigo-950 to-slate-900",
      avatarGrad: "from-indigo-600 to-purple-600",
      perk: "🔥 Free Express Shipping on orders over $50",
    },
    "chrono-style": {
      name: "Srivalli's Store",
      tagline: "Handcrafted Luxury Timepieces & Horology",
      icon: "⌚",
      rating: 4.8,
      reviews: 215,
      followers: "8.9k",
      shippingSpeed: "🛡️ Insured Free Shipping",
      bannerGrad: "from-slate-900 via-amber-950 to-slate-900",
      avatarGrad: "from-amber-600 to-orange-600",
      perk: "✨ Complimentary Genuine Leather Strap with any watch",
    },
    "techgear-co": {
      name: "TechGear Co.",
      tagline: "Tactile Mechanical Keyboards & Action Tech",
      icon: "💻",
      rating: 4.9,
      reviews: 480,
      followers: "19.8k",
      shippingSpeed: "⚡ Same Day Dispatch",
      bannerGrad: "from-slate-900 via-cyan-950 to-slate-900",
      avatarGrad: "from-cyan-600 to-blue-600",
      perk: "🎁 Bundle & Save 15% on RGB Accessories",
    },
    "urban-trends": {
      name: "Urban Trends",
      tagline: "Modern Streetwear, Heavy Cotton & Denim",
      icon: "👕",
      rating: 4.7,
      reviews: 189,
      followers: "15.2k",
      shippingSpeed: "📦 Standard 2-Day Delivery",
      bannerGrad: "from-slate-900 via-emerald-950 to-slate-900",
      avatarGrad: "from-emerald-600 to-teal-600",
      perk: "👕 Buy 2 Get 1 Free on all Oversized Tees",
    },
    "apex-athletics": {
      name: "Apex Athletics",
      tagline: "Performance Activewear & Smart Footwear",
      icon: "👟",
      rating: 4.8,
      reviews: 310,
      followers: "14.1k",
      shippingSpeed: "⚡ 24h Express Dispatch",
      bannerGrad: "from-slate-900 via-rose-950 to-slate-900",
      avatarGrad: "from-rose-600 to-red-600",
      perk: "👟 Free Gym Duffel Bag on orders over $100",
    },
    "smart-home-hub": {
      name: "Smart Home Hub",
      tagline: "Connected Appliances & Artisan Coffee Tech",
      icon: "🏠",
      rating: 4.7,
      reviews: 165,
      followers: "6.5k",
      shippingSpeed: "🛡️ 2-Year Official Warranty",
      bannerGrad: "from-slate-900 via-violet-950 to-slate-900",
      avatarGrad: "from-violet-600 to-purple-600",
      perk: "☕ 15% OFF Barista Kits with code ESPRESSO15",
    },
    "velvet-beauty": {
      name: "Velvet Beauty",
      tagline: "Botanical Clean Skincare & Cruelty-Free Glow",
      icon: "💄",
      rating: 4.9,
      reviews: 275,
      followers: "22.3k",
      shippingSpeed: "🌿 Free Samples with Every Order",
      bannerGrad: "from-slate-900 via-pink-950 to-slate-900",
      avatarGrad: "from-pink-600 to-rose-500",
      perk: "✨ 20% OFF Radiance Night Serums this week",
    },
  };

  const storeMeta = storeInfoMap[tenantSlug] || {
    name: tenantSlug ? tenantSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Official Store",
    tagline: "Verified Multi-Tenant Partner Storefront",
    icon: "🏪",
    rating: 4.8,
    reviews: 120,
    followers: "5.0k",
    shippingSpeed: "⚡ Express Dispatch",
    bannerGrad: "from-slate-900 via-indigo-950 to-slate-900",
    avatarGrad: "from-indigo-600 to-purple-600",
    perk: "🎉 Verified Authentic Products & Buyer Protection",
  };

  useEffect(() => {
    fetchTenantProducts();
  }, [tenantSlug]);

  const fetchTenantProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?vendorId=${encodeURIComponent(tenantSlug)}`);
      if (res.data && res.data.products && res.data.products.length > 0) {
        setProducts(res.data.products);
      } else {
        // Fallback demo products for rich display
        const allRes = await api.get("/products");
        if (allRes.data && allRes.data.products) {
          const matched = allRes.data.products.filter(
            (p) =>
              p.vendorName?.toLowerCase().includes(tenantSlug.toLowerCase()) ||
              tenantSlug.toLowerCase().includes(p.vendorName?.toLowerCase() || "")
          );
          setProducts(matched.length > 0 ? matched : allRes.data.products.slice(0, 4));
        }
      }
    } catch (err) {
      console.error("Tenant store load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to cart!`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold border border-slate-700 flex items-center gap-2.5 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* HERO STOREFRONT BANNER */}
      <section className={`relative bg-gradient-to-r ${storeMeta.bannerGrad} text-white pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden`}>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold mb-4">
            <Link to="/" className="hover:text-white transition">Marketplace</Link>
            <span>/</span>
            <span>Verified Stores</span>
            <span>/</span>
            <span className="text-white">{storeMeta.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              {/* Brand Avatar */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br ${storeMeta.avatarGrad} p-1 shadow-2xl ring-4 ring-white/10 shrink-0`}>
                <div className="w-full h-full bg-slate-900 rounded-[20px] flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
                  {storeMeta.icon}
                </div>
              </div>

              {/* Brand Meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {storeMeta.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Verified Merchant
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                  {storeMeta.tagline}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <span>★</span> {storeMeta.rating} <span className="text-slate-400 font-normal">({storeMeta.reviews} Reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="text-indigo-300 font-semibold">{storeMeta.shippingSpeed}</span>
                  <span>•</span>
                  <span className="text-slate-400">{storeMeta.followers} Followers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  setToastMessage(isFollowing ? "Unfollowed store" : "Following store updates!");
                }}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  isFollowing
                    ? "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"
                    : "bg-white text-slate-900 hover:bg-indigo-50 shadow-lg hover:scale-105"
                }`}
              >
                <span>{isFollowing ? "✓ Following" : "+ Follow Store"}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  setToastMessage("Store link copied!");
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <span>🔗</span> Share
              </button>
            </div>
          </div>

          {/* Exclusive Store Perk Banner */}
          <div className="mt-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between gap-3 text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-2">
              {storeMeta.perk}
            </span>
            <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider hidden sm:inline">
              Applied automatically at checkout
            </span>
          </div>
        </div>
      </section>

      {/* Catalog Search & Category Filters */}
      <section className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1">
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder={`Search within ${storeMeta.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 transition"
            />
            <span className="absolute left-3 top-2 text-slate-400 text-sm">🔍</span>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-500">Loading storefront catalog...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-md mx-auto">
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="font-black text-slate-900 text-base mb-1">No products found</h3>
            <p className="text-slate-500 text-xs mb-5">
              Try adjusting your search query or department filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, product.category, product.name)}
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl">
                    {product.category}
                  </span>

                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mb-1">
                      <span>★</span>
                      <span>{product.rating || "4.8"}</span>
                      <span className="text-slate-400 font-normal">({product.salesCount || 18}+ sold)</span>
                    </div>

                    <Link
                      to={`/product/${product._id}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Price</span>
                      <span className="text-lg font-black text-slate-900">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock <= 0}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-100 active:scale-95 flex items-center gap-1.5"
                    >
                      <span>🛒</span> {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Store Customer Reviews Section */}
        <div className="mt-12">
          <CustomerReviewsSection
            targetId={`store_${tenantSlug}`}
            targetTitle={storeMeta.name}
          />
        </div>
      </main>
    </div>
  );
}
