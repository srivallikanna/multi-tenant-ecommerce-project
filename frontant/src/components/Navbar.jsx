import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const STORE_LIST = [
  {
    slug: "gaurav-store",
    name: "Gaurav's Store",
    category: "Audio & Tech",
    icon: "🎧",
    rating: "4.9 ★",
    badge: "Super Store",
  },
  {
    slug: "srivalli-store",
    name: "Srivalli's Store",
    category: "Luxury Watches",
    icon: "⌚",
    rating: "4.9 ★",
    badge: "Exclusive",
  },
  {
    slug: "riya-store",
    name: "Riya's Store",
    category: "Clean Beauty",
    icon: "💄",
    rating: "4.9 ★",
    badge: "Top Rated",
  },
  {
    slug: "anuj-store",
    name: "Anuj's Store",
    category: "Streetwear & Sport",
    icon: "👟",
    rating: "4.8 ★",
    badge: "Trending",
  },
];

const TRENDING_SEARCHES = [
  "Wireless ANC Headphones",
  "Sapphire Chronograph Watch",
  "Vitamin C Radiance Serum",
  "Carbon Running Sneakers",
  "Mechanical RGB Keyboard",
];

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, logout, getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [storesOpen, setStoresOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const storesRef = useRef(null);
  const profileRef = useRef(null);
  const moreRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (storesRef.current && !storesRef.current.contains(e.target)) {
        setStoresOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setStoresOpen(false);
    setProfileOpen(false);
    setMoreOpen(false);
    setSearchFocused(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";
  const isCustomer = user && !isVendor && !isAdmin;
  const isGuest = !user;

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 shadow-sm font-sans">
      {/* ================= EXACT FLIPKART SOLID BLUE BAR (#2874f0) ================= */}
      <nav className="bg-[#2874f0] text-white h-[56px] flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 sm:gap-8">
          
          {/* ================= 1. FLIPKART STYLE BRAND LOGO ================= */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex flex-col group cursor-pointer leading-tight">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white italic drop-shadow-xs">
                Multi<span className="text-[#ffe500]">Tenant</span>
              </span>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-slate-100 -mt-1 hover:underline">
                <span className="italic text-slate-200">Explore</span>
                <span className="text-[#ffe500] font-bold flex items-center gap-0.5">
                  Plus <span className="text-[10px] text-[#ffe500]">✦</span>
                </span>
              </div>
            </Link>
          </div>

          {/* ================= 2. EXACT FLIPKART SEARCH BAR ================= */}
          {(isGuest || isCustomer) && (
            <div className="flex-1 max-w-2xl relative" ref={searchRef}>
              <div className="relative w-full flex items-center bg-white rounded-xs shadow-xs overflow-hidden h-[36px]">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery || ""}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-1.5 bg-white text-slate-900 placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none"
                />
                
                {/* Search / Clear Icons on Right */}
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-700 text-sm font-black cursor-pointer mr-2"
                    >
                      ×
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="text-[#2874f0] hover:text-[#1e60db] transition cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#2874f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Search Suggestions Popover */}
              {searchFocused && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-xs shadow-2xl border border-slate-200 p-3 z-50 animate-slide-down text-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span>🔥 Discover Popular Products</span>
                    <span className="text-xs text-[#2874f0] font-bold">Trending</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SEARCHES.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (setSearchQuery) setSearchQuery(term);
                          setSearchFocused(false);
                        }}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-[#2874f0] hover:border-[#2874f0]/40 rounded text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                      >
                        <span className="text-[10px] text-slate-400">🔍</span>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. RIGHT NAVIGATION CONTROLS ================= */}
          <div className="flex items-center gap-5 sm:gap-7 shrink-0 text-sm font-bold">
            
            {/* ================= LOGIN BUTTON / ACCOUNT DROPDOWN ================= */}
            <div className="relative" ref={profileRef}>
              {isGuest ? (
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  onMouseEnter={() => setProfileOpen(true)}
                  className="bg-white text-[#2874f0] px-6 sm:px-8 py-1 text-sm font-black rounded-xs shadow-xs hover:bg-slate-50 transition active:scale-95 cursor-pointer block border border-white"
                >
                  Login
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  onMouseEnter={() => setProfileOpen(true)}
                  className="text-white hover:text-white/90 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="max-w-[110px] truncate">{user?.name || "My Account"}</span>
                  <span className={`text-[9px] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
              )}

              {/* Flipkart Style Account Dropdown */}
              {profileOpen && (
                <div
                  onMouseLeave={() => setProfileOpen(false)}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xs shadow-2xl border border-slate-200 py-1 z-50 animate-slide-down text-slate-800"
                >
                  {isGuest ? (
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">New customer?</span>
                      <Link to="/signup" className="text-[#2874f0] hover:underline font-black">
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50/80 border-b border-blue-100">
                      <div className="text-xs font-black text-slate-900">{user?.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#2874f0] bg-blue-100 px-2 py-0.5 rounded">
                          ⭐ Plus Member
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded capitalize">
                          {user?.role || "Member"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="py-1 text-xs font-semibold divide-y divide-slate-50">
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#2874f0] transition"
                    >
                      <span className="text-sm">📦</span>
                      <span>Orders</span>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#2874f0] transition"
                    >
                      <span className="text-sm">❤️</span>
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-[#2874f0] transition"
                    >
                      <span className="text-sm">⚡</span>
                      <span>Plus Zone & SuperCoins</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-[#2874f0] transition font-bold"
                      >
                        <span className="text-sm">⚙️</span>
                        <span>Super Admin Console</span>
                      </Link>
                    )}

                    {isVendor && (
                      <Link
                        to="/vendor/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-[#2874f0] transition font-bold"
                      >
                        <span className="text-sm">🏬</span>
                        <span>Seller Hub</span>
                      </Link>
                    )}

                    {!isGuest && (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition cursor-pointer font-bold text-left"
                      >
                        <span className="text-sm">🚪</span>
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ================= BECOME A SELLER ================= */}
            <Link
              to="/vendor/dashboard"
              className="hidden md:flex items-center gap-1.5 text-white hover:text-white/90 text-sm font-bold transition"
            >
              <span>🏬</span>
              <span>Become a Seller</span>
            </Link>

            {/* ================= STORES / MORE DROPDOWN ================= */}
            <div className="relative hidden lg:block" ref={storesRef}>
              <button
                type="button"
                onClick={() => setStoresOpen(!storesOpen)}
                onMouseEnter={() => setStoresOpen(true)}
                className="text-white hover:text-white/90 text-sm font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Stores</span>
                <span className={`text-[9px] transition-transform duration-200 ${storesOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {storesOpen && (
                <div
                  onMouseLeave={() => setStoresOpen(false)}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xs shadow-2xl border border-slate-200 py-2 z-50 animate-slide-down text-slate-800"
                >
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Verified Brand Hubs</span>
                    <span className="text-emerald-600 font-bold">4 Live</span>
                  </div>

                  {STORE_LIST.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/store/${s.slug}`}
                      onClick={() => setStoresOpen(false)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-blue-50 text-slate-800 hover:text-[#2874f0] transition text-xs font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <span>{s.icon}</span>
                        <span>{s.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-[#388e3c] px-1.5 py-0.2 rounded">
                        {s.rating}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ================= CART LINK WITH EXACT FLIPKART STYLE ================= */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-white hover:text-white/90 text-sm font-bold group cursor-pointer"
            >
              <div className="relative">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#ff6161] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#2874f0] shadow-xs animate-bump">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

          </div>

        </div>
      </nav>

      {/* ================= 4. EXACT FLIPKART SUB-HEADER CATEGORY BAR ================= */}
      {(isGuest || isCustomer) && (
        <div className="bg-white border-b border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-6 min-w-max text-xs font-bold text-slate-700">
            <div className="flex items-center gap-8">
              <Link to="/#catalog" className="flex items-center gap-2 hover:text-[#2874f0] transition group">
                <span className="text-base group-hover:scale-105 transition-transform">🛍️</span>
                <span>Top Offers</span>
              </Link>
              <Link to="/store/gaurav-store" className="flex items-center gap-2 hover:text-[#2874f0] transition group">
                <span className="text-base group-hover:scale-105 transition-transform">🎧</span>
                <span>Audio & Tech</span>
              </Link>
              <Link to="/store/srivalli-store" className="flex items-center gap-2 hover:text-[#2874f0] transition group">
                <span className="text-base group-hover:scale-105 transition-transform">⌚</span>
                <span>Luxury Watches</span>
              </Link>
              <Link to="/store/riya-store" className="flex items-center gap-2 hover:text-[#2874f0] transition group">
                <span className="text-base group-hover:scale-105 transition-transform">💄</span>
                <span>Clean Beauty</span>
              </Link>
              <Link to="/store/anuj-store" className="flex items-center gap-2 hover:text-[#2874f0] transition group">
                <span className="text-base group-hover:scale-105 transition-transform">👟</span>
                <span>Fashion & Footwear</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="text-[#2874f0] font-black flex items-center gap-1">
                ⚡ Express Delivery
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">
                100% Genuine Certified
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
