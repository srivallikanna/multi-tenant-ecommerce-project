import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerReviewsSection from "../components/CustomerReviewsSection";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

export default function TenantStore() {
  const params = useParams();
  const tenantSlug = params.slug || params.tenantSlug || "gaurav-store";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFollowing, setIsFollowing] = useState(false);

  const { addToCart } = useCart();

  // Store metadata
  const storeInfoMap = {
    "gaurav-store": {
      name: "Gaurav's Store",
      tagline: "High-Fidelity Studio Sound, Acoustics & Tech Gear",
      icon: "🎧",
      rating: 4.9,
      reviews: 384,
      followers: "14.8k",
      shippingSpeed: "⚡ 24h Express Dispatch",
      bannerGrad: "from-[#1a56c4] via-[#2874f0] to-[#1e60db]",
      avatarGrad: "from-blue-600 to-indigo-700",
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
      bannerGrad: "from-amber-600 via-orange-600 to-amber-700",
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
      bannerGrad: "from-pink-600 via-rose-600 to-pink-700",
      avatarGrad: "from-pink-600 to-rose-500",
      perk: "✨ 20% OFF Radiance Night Serums this week",
    },
    "anuj-store": {
      name: "Anuj's Store",
      tagline: "Modern Urban Streetwear, Outerwear & Active Footwear",
      icon: "👟",
      rating: 4.8,
      reviews: 245,
      followers: "18.3k",
      shippingSpeed: "📦 Standard 2-Day Delivery",
      bannerGrad: "from-emerald-600 via-teal-600 to-emerald-700",
      avatarGrad: "from-emerald-600 to-teal-600",
      perk: "👕 Buy 2 Get 1 Free on all Oversized Tees",
    },
  };

  const currentStore = storeInfoMap[tenantSlug] || {
    name: "Partner Store",
    tagline: "Verified MultiTenant Brand Storefront",
    icon: "🏪",
    rating: 4.8,
    reviews: 150,
    followers: "5.0k",
    shippingSpeed: "⚡ 24h Express Dispatch",
    bannerGrad: "from-[#1a56c4] via-[#2874f0] to-[#1e60db]",
    avatarGrad: "from-blue-600 to-indigo-700",
    perk: "⚡ 100% Genuine Certified Storefront",
  };

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products?store=${tenantSlug}`);
        const data = res.data?.products || (Array.isArray(res.data) ? res.data : []);

        if (data.length > 0) {
          setProducts(data);
        } else {
          // Fallback based on store
          const fallbackStoreProducts = [
            {
              _id: `prod_${tenantSlug}_1`,
              name: `${currentStore.name} Flagship Exclusive Edition`,
              price: 149.99,
              originalPrice: 229.99,
              rating: 4.9,
              reviewCount: 94,
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
              vendorName: currentStore.name,
              description: "Official store edition manufactured with Grade-A materials and guaranteed quality.",
            },
            {
              _id: `prod_${tenantSlug}_2`,
              name: `${currentStore.name} Performance Pro Series`,
              price: 89.00,
              originalPrice: 139.00,
              rating: 4.8,
              reviewCount: 68,
              image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
              vendorName: currentStore.name,
              description: "High durability and ergonomic design for daily use.",
            },
            {
              _id: `prod_${tenantSlug}_3`,
              name: `${currentStore.name} Essentials Daily Pack`,
              price: 45.00,
              originalPrice: 70.00,
              rating: 4.9,
              reviewCount: 112,
              image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
              vendorName: currentStore.name,
              description: "Top rated customer choice with fast express dispatch.",
            },
          ];
          setProducts(fallbackStoreProducts);
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreProducts();
  }, [tenantSlug]);

  const handleAddToCart = (product, e) => {
    if (e) e.preventDefault();
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to your Cart! 🛒`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setToastMessage(isFollowing ? "Unfollowed store" : `Now following ${currentStore.name} ⭐`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    return matchesSearch;
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

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 flex-1 w-full space-y-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-[#2874f0]">Marketplace</Link>
          <span>›</span>
          <span className="text-slate-800 font-black">{currentStore.name} Storefront</span>
        </div>

        {/* Storefront Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Header Banner */}
          <div className={`h-28 sm:h-36 bg-gradient-to-r ${currentStore.bannerGrad} p-4 sm:p-6 flex items-start justify-between text-white relative`}>
            <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider">
              🏬 Official Storefront
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#388e3c] text-white text-xs font-black shadow-xs">
              ★ {currentStore.rating} Rated
            </span>
          </div>

          {/* Store Info Bar */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 relative z-10">
            <div className="flex items-end gap-3.5">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${currentStore.avatarGrad} p-1 shadow-lg ring-4 ring-white shrink-0`}>
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl text-white">
                  {currentStore.icon}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentStore.name}
                  </h1>
                  <span className="text-[#2874f0] font-black bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                    ⚡ Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-lg">
                  {currentStore.tagline}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold pt-1">
                  <span>👥 {currentStore.followers} Followers</span>
                  <span>•</span>
                  <span>⭐ {currentStore.reviews} Reviews</span>
                  <span>•</span>
                  <span className="text-emerald-700">{currentStore.shippingSpeed}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-xs ${
                  isFollowing
                    ? "bg-slate-100 text-slate-700 border border-slate-300"
                    : "bg-[#2874f0] hover:bg-[#1e60db] text-white"
                }`}
              >
                {isFollowing ? "✓ Following" : "+ Follow Store"}
              </button>
            </div>
          </div>

          {/* Store Promo Ribbon */}
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs font-bold text-amber-900 flex items-center gap-2">
            <span>🎉</span>
            <span>{currentStore.perk}</span>
          </div>
        </div>

        {/* Store Catalog Search & Products Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Products by {currentStore.name} ({filteredProducts.length})
              </h2>
              <p className="text-xs text-slate-500">100% direct authentic merchant stock.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={`Search in ${currentStore.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              />
              <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const orig = p.originalPrice || (p.price * 1.4).toFixed(2);
              const disc = Math.round(((orig - p.price) / orig) * 100);

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-3.5 flex flex-col justify-between group"
                >
                  <Link to={`/product/${p._id}`} className="block aspect-square rounded-lg bg-slate-50 p-2 mb-3 overflow-hidden">
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      onError={(e) => handleImageError(e, p.name)}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <span>{p.rating || "4.8"}</span>
                        <span>★</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#2874f0] bg-blue-50 px-1.5 py-0.2 rounded ml-auto">
                        ⚡ Assured
                      </span>
                    </div>

                    <Link to={`/product/${p._id}`}>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#2874f0] transition">
                        {p.name}
                      </h4>
                    </Link>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-black text-slate-900">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${Number(orig).toFixed(2)}
                      </span>
                      <span className="text-xs font-black text-[#388e3c]">
                        {disc}% off
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(p, e)}
                    className="w-full py-2 bg-[#ff9f00] hover:bg-[#f59400] text-slate-950 font-black text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Reviews Section */}
        <section className="pt-2">
          <CustomerReviewsSection
            targetId={tenantSlug}
            targetTitle={`${currentStore.name} Storefront`}
          />
        </section>

      </main>
    </div>
  );
}
