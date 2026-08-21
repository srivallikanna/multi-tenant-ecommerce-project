import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroBannerCarousel from "../components/HeroBannerCarousel";
import BigDealsSection from "../components/BigDealsSection";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [addedToast, setAddedToast] = useState("");

  const { addToCart } = useCart();

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Sports",
    "Home & Kitchen",
    "Beauty",
    "Gaming",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      if (res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to load products from API:", err);
    } finally {
      setLoading(false);
    }
  };

  let processedProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") {
    processedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price-high") {
    processedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === "rating") {
    processedProducts.sort((a, b) => Number(b.rating || 4.5) - Number(a.rating || 4.5));
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(`Added "${product.name}" to cart!`);
    setTimeout(() => setAddedToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border border-slate-700">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-bold">{addedToast}</span>
        </div>
      )}

      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-8">
        {/* 5-IMAGE AUTO-SLIDING BANNER CAROUSEL */}
        <HeroBannerCarousel />

        {/* INTERACTIVE BIG DEALS SECTION */}
        <BigDealsSection products={products} onAddToCart={handleAddToCart} />

        {/* CATEGORY FILTERING & SORTING BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-600 shadow-sm"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: 50+ PRODUCT MARKETPLACE GRID */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              Product Marketplace Catalog ({processedProducts.length} items)
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 text-sm font-semibold">Loading catalog items...</p>
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Products Found</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                Try resetting your filters or search query to see the complete catalog.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedProducts.map((product, idx) => (
                <div
                  key={product._id}
                  className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl transform hover:-translate-y-1"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => handleImageError(e, product.category)}
                    />

                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-100 shadow-sm">
                      🏪 {product.vendorName || "Vendor"}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <span>★</span>
                          <span>{product.rating || "4.8"}</span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${product._id}`}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5"
                      >
                        {product.name}
                      </Link>

                      <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            ${Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                        <span className="text-base font-black text-slate-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          Details
                        </Link>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock <= 0}
                          className="px-3.5 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] disabled:opacity-50 text-slate-950 text-xs font-black rounded-full shadow-xs border border-[#fcd200] transition active:scale-95 flex items-center gap-1"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 MultiTenant E-Commerce Ecosystem. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}