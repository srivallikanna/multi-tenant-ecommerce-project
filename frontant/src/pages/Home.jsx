import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroBannerCarousel from "../components/HeroBannerCarousel";
import BigDealsSection from "../components/BigDealsSection";
import CustomerReviewsSection from "../components/CustomerReviewsSection";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

// Standard Approved Multi-Tenant Stores
const VERIFIED_STORES = [
  {
    slug: "gaurav-store",
    name: "Gaurav's Store",
    category: "Audio & Tech",
    tagline: "High-Fidelity Studio Sound & Custom Peripherals",
    icon: "🎧",
    gradient: "from-blue-600 via-indigo-600 to-blue-700",
    rating: 4.9,
    productsCount: 18,
    badge: "Super Store",
  },
  {
    slug: "srivalli-store",
    name: "Srivalli's Store",
    category: "Luxury Watches",
    tagline: "Handcrafted Luxury Timepieces & Horology",
    icon: "⌚",
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    rating: 4.9,
    productsCount: 14,
    badge: "Exclusive",
  },
  {
    slug: "riya-store",
    name: "Riya's Store",
    category: "Clean Beauty",
    tagline: "Botanical Clean Skincare, Glow & Beauty Essentials",
    icon: "💄",
    gradient: "from-pink-500 via-rose-500 to-pink-600",
    rating: 4.9,
    productsCount: 22,
    badge: "Top Rated",
  },
  {
    slug: "anuj-store",
    name: "Anuj's Store",
    category: "Streetwear & Sport",
    tagline: "Modern Urban Streetwear, Outerwear & Active Footwear",
    icon: "👟",
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    rating: 4.8,
    productsCount: 16,
    badge: "Trending",
  },
];

// Rich fallback catalog across the 4 verified multi-tenant stores
const FALLBACK_CATALOG = [
  {
    _id: "prod_101",
    name: "AcousticPro Studio Wireless ANC Headphones",
    category: "Electronics",
    price: 199.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewCount: 142,
    vendorName: "Gaurav's Store",
    vendorSlug: "gaurav-store",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Flagship 40mm titanium drivers with active hybrid noise cancellation and 30-hour battery life.",
    isFeatured: true,
  },
  {
    _id: "prod_102",
    name: "ChronoMaster Minimalist Sapphire Watch",
    category: "Watches",
    price: 289.00,
    originalPrice: 450.00,
    rating: 4.9,
    reviewCount: 98,
    vendorName: "Srivalli's Store",
    vendorSlug: "srivalli-store",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
    description: "Hand-assembled chronograph with Japanese quartz movement and scratch-resistant sapphire crystal glass.",
    isFeatured: true,
  },
  {
    _id: "prod_103",
    name: "Botanical Radiance Vitamin C Glow Serum",
    category: "Beauty",
    price: 48.00,
    originalPrice: 75.00,
    rating: 4.9,
    reviewCount: 215,
    vendorName: "Riya's Store",
    vendorSlug: "riya-store",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    description: "15% Pure Vitamin C paired with botanical hyaluronic acid for deep hydration and collagen elasticity.",
    isFeatured: true,
  },
  {
    _id: "prod_104",
    name: "Apex Kinetic Carbon Running Sneakers",
    category: "Fashion",
    price: 159.99,
    originalPrice: 240.00,
    rating: 4.8,
    reviewCount: 88,
    vendorName: "Anuj's Store",
    vendorSlug: "anuj-store",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Dual-density responsive energy return cushioning with breathable Aeroknit engineered mesh.",
    isFeatured: true,
  },
  {
    _id: "prod_105",
    name: "StudioBar Pro Multi-Room Bluetooth Soundbar",
    category: "Electronics",
    price: 149.00,
    originalPrice: 229.00,
    rating: 4.8,
    reviewCount: 64,
    vendorName: "Gaurav's Store",
    vendorSlug: "gaurav-store",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    description: "Immersive Dolby spatial acoustics with integrated dual subwoofers and optical input.",
  },
  {
    _id: "prod_106",
    name: "Heritage Italian Leather Automatic Watch",
    category: "Watches",
    price: 340.00,
    originalPrice: 499.00,
    rating: 4.9,
    reviewCount: 76,
    vendorName: "Srivalli's Store",
    vendorSlug: "srivalli-store",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    description: "Exquisite automatic movement with exposed tourbillon window and hand-stitched Tuscan leather strap.",
  },
  {
    _id: "prod_107",
    name: "HydraBarrier Ceramide Night Restorative Cream",
    category: "Beauty",
    price: 54.00,
    originalPrice: 80.00,
    rating: 4.8,
    reviewCount: 110,
    vendorName: "Riya's Store",
    vendorSlug: "riya-store",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    description: "Dermatologist-tested triple ceramide formula designed to repair and nourish damaged skin barriers overnight.",
  },
  {
    _id: "prod_108",
    name: "Vintage Heavyweight Oversized Denim Jacket",
    category: "Fashion",
    price: 89.99,
    originalPrice: 135.00,
    rating: 4.7,
    reviewCount: 92,
    vendorName: "Anuj's Store",
    vendorSlug: "anuj-store",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    description: "14oz premium cotton selvedge denim crafted with custom metal hardware and drop-shoulder silhouette.",
  },
  {
    _id: "prod_109",
    name: "RGB Mechanical Hot-Swappable Keyboard",
    category: "Electronics",
    price: 119.00,
    originalPrice: 179.00,
    rating: 4.9,
    reviewCount: 180,
    vendorName: "Gaurav's Store",
    vendorSlug: "gaurav-store",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    description: "Aircraft-grade aluminum chassis with pre-lubed tactile switches and per-key RGB backlighting.",
  },
  {
    _id: "prod_110",
    name: "Precision Titanium Sport Diver 200M Watch",
    category: "Watches",
    price: 410.00,
    originalPrice: 580.00,
    rating: 4.9,
    reviewCount: 52,
    vendorName: "Srivalli's Store",
    vendorSlug: "srivalli-store",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80",
    description: "20 ATM professional water resistance with rotating ceramic bezel and Swiss Super-LumiNova markers.",
  },
  {
    _id: "prod_111",
    name: "Organic Damascus Rose Cleansing Botanical Oil",
    category: "Beauty",
    price: 36.50,
    originalPrice: 52.00,
    rating: 4.8,
    reviewCount: 84,
    vendorName: "Riya's Store",
    vendorSlug: "riya-store",
    image: "https://images.unsplash.com/photo-1608248597359-5936735e5d95?w=600&auto=format&fit=crop&q=80",
    description: "Gentle makeup-melting oil cleanser enriched with cold-pressed rosehip seed and evening primrose oil.",
  },
  {
    _id: "prod_112",
    name: "Heavyweight Boxy Fit Graphic Streetwear Tee",
    category: "Fashion",
    price: 42.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 130,
    vendorName: "Anuj's Store",
    vendorSlug: "anuj-store",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    description: "280 GSM combed organic cotton with silk-screen printed streetwear graphics and reinforced ribbed collar.",
  },
];

// Helper to normalize vendor slug
function getStoreSlug(vendorName = "") {
  const v = (vendorName || "").toLowerCase();
  if (v.includes("srivalli")) return "srivalli-store";
  if (v.includes("riya")) return "riya-store";
  if (v.includes("anuj")) return "anuj-store";
  return "gaurav-store";
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [toastMessage, setToastMessage] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("customer_wishlist") || "[]");
    } catch (e) {
      return [];
    }
  });

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else if (res.data && res.data.products && Array.isArray(res.data.products) && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else {
          setProducts(FALLBACK_CATALOG);
        }
      } catch (err) {
        console.warn("Backend products API fallback active:", err.message);
        setProducts(FALLBACK_CATALOG);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product, e) => {
    if (e) e.preventDefault();
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to Cart! 🛒`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleWishlist = (productId, e) => {
    if (e) e.preventDefault();
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      setToastMessage("Item removed from Wishlist");
    } else {
      updated = [...wishlist, productId];
      setToastMessage("Item added to your Wishlist ❤️");
    }
    setWishlist(updated);
    try {
      localStorage.setItem("customer_wishlist", JSON.stringify(updated));
    } catch (err) {}
    setTimeout(() => setToastMessage(""), 2500);
  };

  const categories = [
    { id: "All", label: "All Items", icon: "🛍️" },
    { id: "Electronics", label: "Audio & Tech", icon: "🎧" },
    { id: "Watches", label: "Luxury Watches", icon: "⌚" },
    { id: "Beauty", label: "Clean Beauty", icon: "💄" },
    { id: "Fashion", label: "Streetwear", icon: "👟" },
  ];

  // Filtering & Sorting
  const filteredProducts = products.filter((item) => {
    const nameMatch = (item.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const vendorMatch = (item.vendorName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || descMatch || vendorMatch;

    if (selectedCategory === "All") return matchesSearch;
    const cat = (item.category || "").toLowerCase();
    const sel = selectedCategory.toLowerCase();
    return matchesSearch && (cat.includes(sel) || (sel === "electronics" && (cat.includes("tech") || cat.includes("audio"))));
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_low") return Number(a.price) - Number(b.price);
    if (sortBy === "price_high") return Number(b.price) - Number(a.price);
    if (sortBy === "rating") return (Number(b.rating) || 5) - (Number(a.rating) || 5);
    return 0; // featured
  });

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-bold">{toastMessage}</span>
          <Link
            to="/cart"
            className="text-xs font-black text-[#ffe500] hover:underline ml-2"
          >
            Go to Cart →
          </Link>
        </div>
      )}

      {/* Top Navbar with Flipkart theme */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Marketplace Canvas */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 flex-1 w-full space-y-6">
        
        {/* ================= 1. PROMO CAROUSEL ================= */}
        <section>
          <HeroBannerCarousel />
        </section>

        {/* ================= 2. FLIPKART PLUS VIP BANNER ================= */}
        <section className="bg-gradient-to-r from-[#1c54c2] via-[#2874f0] to-[#1e60db] text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#ffe500] text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-[#ffe500] uppercase tracking-wider">
                  MultiTenant Plus Member
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Free 1-Day Delivery
                </span>
              </div>
              <p className="text-xs text-slate-100 font-medium mt-0.5">
                Earn 2x SuperCoins on every purchase and enjoy early access to Flash Sales.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-200">
              🪙 250 Coins Available
            </span>
            <a
              href="#catalog"
              className="px-4 py-2 bg-[#ffe500] hover:bg-[#ebd300] text-slate-950 text-xs font-black rounded-lg shadow-xs transition"
            >
              Explore Plus Zone
            </a>
          </div>
        </section>

        {/* ================= 3. TRUST PILLARS ================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center text-lg font-bold">
              🛍️
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Unified Cart</h4>
              <p className="text-[11px] text-slate-500 font-medium">Checkout all stores at once</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 hover:border-emerald-300 transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">100% Genuine</h4>
              <p className="text-[11px] text-slate-500 font-medium">Vetted independent brands</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 hover:border-amber-300 transition">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">24-48h Dispatch</h4>
              <p className="text-[11px] text-slate-500 font-medium">Fast tracked shipping</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 hover:border-purple-300 transition">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
              🔄
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">7-Day Replacement</h4>
              <p className="text-[11px] text-slate-500 font-medium">Hassle-free return policy</p>
            </div>
          </div>
        </section>

        {/* ================= 4. FLASH DEALS WITH COUNTDOWN ================= */}
        <section>
          <BigDealsSection products={products} onAddToCart={handleAddToCart} />
        </section>

        {/* ================= 5. VERIFIED TENANT STORES ================= */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2874f0] bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Independent Merchants
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ 4 Approved Stores
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Explore Verified Tenant Storefronts
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Each storefront operates independently with custom collections and dedicated seller ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VERIFIED_STORES.map((store) => (
              <Link
                key={store.slug}
                to={`/store/${store.slug}`}
                className="bg-slate-50 hover:bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${store.gradient} flex items-center justify-center text-xl text-white shadow-xs group-hover:scale-105 transition-transform`}>
                      {store.icon}
                    </div>
                    <span className="text-[10px] font-bold text-white bg-[#388e3c] px-2 py-0.5 rounded shadow-xs">
                      ★ {store.rating}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    {store.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#2874f0] transition-colors mt-0.5">
                    {store.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {store.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#2874f0] group-hover:translate-x-0.5 transition-transform">
                  <span>Visit Store</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= 6. MARKETPLACE CATALOG GRID ================= */}
        <section id="catalog" className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                Multi-Store Catalog
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Trending Marketplace Items
              </h2>
            </div>

            {/* Category Filter Pills & Sorter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[#2874f0] text-white shadow-xs font-black"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Sorter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2874f0] cursor-pointer ml-auto"
              >
                <option value="featured">Featured Picks</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-pulse space-y-3">
                  <div className="aspect-square bg-slate-200 rounded-lg" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-slate-800">No items match your query</h3>
              <p className="text-xs text-slate-500">Try changing keywords or resetting the category filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product) => {
                const isWishlisted = wishlist.includes(product._id);
                const discountPct = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 35;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-3.5 flex flex-col justify-between group relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product._id, e)}
                      className={`absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer ${
                        isWishlisted
                          ? "bg-rose-50 text-rose-500 border border-rose-200"
                          : "bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-200"
                      }`}
                      title="Save to Wishlist"
                    >
                      <span className="text-sm">{isWishlisted ? "❤️" : "🤍"}</span>
                    </button>

                    {/* Image & Store Pill */}
                    <Link to={`/product/${product._id}`} className="block relative aspect-square rounded-lg overflow-hidden bg-slate-50 mb-3 cursor-pointer">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        onError={(e) => handleImageError(e, product.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {product.vendorName || "Verified Store"}
                      </span>
                    </Link>

                    {/* Product Info */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <span>{product.rating || "4.8"}</span>
                          <span>★</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({product.reviewCount || 120})
                        </span>
                        <span className="text-[10px] font-bold text-[#2874f0] bg-blue-50 px-1.5 py-0.2 rounded ml-auto">
                          ⚡ Assured
                        </span>
                      </div>

                      <Link to={`/product/${product._id}`}>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#2874f0] transition leading-snug">
                          {product.name}
                        </h4>
                      </Link>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-base font-black text-slate-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ${Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#388e3c]">
                          {discountPct}% off
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        <span>Free delivery by </span>
                        <span className="font-bold text-slate-700">Tomorrow</span>
                      </div>
                    </div>

                    {/* Quick Add To Cart Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 py-2 bg-[#ff9f00] hover:bg-[#f59400] active:scale-95 text-slate-950 font-black text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>🛒</span> Add to Cart
                      </button>
                      <Link
                        to={`/product/${product._id}`}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] rounded-lg transition font-bold text-xs"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* ================= FLIPKART FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-300 mt-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">ABOUT</h5>
              <ul className="space-y-1.5 text-slate-300">
                <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-white">About MultiTenant</Link></li>
                <li><Link to="/" className="hover:text-white">Careers</Link></li>
                <li><Link to="/" className="hover:text-white">Press Releases</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">PARTNER STORES</h5>
              <ul className="space-y-1.5 text-slate-300">
                <li><Link to="/store/gaurav-store" className="hover:text-white">Gaurav's Store (Audio)</Link></li>
                <li><Link to="/store/srivalli-store" className="hover:text-white">Srivalli's Store (Watches)</Link></li>
                <li><Link to="/store/riya-store" className="hover:text-white">Riya's Store (Beauty)</Link></li>
                <li><Link to="/store/anuj-store" className="hover:text-white">Anuj's Store (Streetwear)</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">HELP & SUPPORT</h5>
              <ul className="space-y-1.5 text-slate-300">
                <li><Link to="/orders" className="hover:text-white">Track Orders</Link></li>
                <li><Link to="/cart" className="hover:text-white">Shipping & Delivery</Link></li>
                <li><Link to="/orders" className="hover:text-white">Cancellation & Returns</Link></li>
                <li><Link to="/" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">POLICY</h5>
              <ul className="space-y-1.5 text-slate-300">
                <li><Link to="/" className="hover:text-white">Return Policy</Link></li>
                <li><Link to="/" className="hover:text-white">Terms of Use</Link></li>
                <li><Link to="/" className="hover:text-white">Security & Privacy</Link></li>
                <li><Link to="/vendor/dashboard" className="hover:text-white">Merchant Program</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-white font-bold">
                🏬 Become a Merchant
              </span>
              <span className="flex items-center gap-1 text-white font-bold">
                ⭐ Gift Cards
              </span>
              <span className="flex items-center gap-1 text-white font-bold">
                ❓ Help Center
              </span>
            </div>
            <div>
              © 2026 MultiTenant E-Commerce Platform. Inspired by modern marketplace design.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}