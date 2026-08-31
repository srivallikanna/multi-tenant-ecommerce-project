import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, logout, getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-300">
              M
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">
                Multi<span className="text-indigo-600">Tenant</span>
              </span>
              {isVendor && (
                <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                  Vendor Mode
                </span>
              )}
            </div>
          </Link>

          {/* Search Bar (Customer Marketplace) */}
          {setSearchQuery && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products across verified stores..."
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-medium"
                />
                <svg
                  className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold">
            
            {/* Customer Links */}
            <Link
              to="/"
              className="text-slate-600 hover:text-indigo-600 px-2 py-1 transition"
            >
              Shop
            </Link>

            <Link
              to="/my-orders"
              className="text-slate-600 hover:text-indigo-600 px-2 py-1 transition"
            >
              My Orders
            </Link>

            {/* ONLY VISIBLE IF LOGGED IN AS VENDOR */}
            {isVendor && (
              <Link
                to="/vendor/dashboard"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
              >
                <span>🏪</span> Vendor Console
              </Link>
            )}

            {/* ONLY VISIBLE IF LOGGED IN AS ADMIN */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-xs"
              >
                <span>👑</span> Super Admin
              </Link>
            )}

            {/* Cart Icon Button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition group"
              title="Shopping Cart"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ffd814] text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-[#fcd200] animate-bounce">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Auth Buttons / User Profile */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <span className="hidden xl:inline-block text-xs font-bold text-slate-700">
                  Hi, {user.name || (isVendor ? "Vendor" : "Customer")}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-200 hover:border-red-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-slate-900 px-3 py-1.5 text-xs font-bold rounded-xl hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 px-4 py-1.5 rounded-xl text-xs font-black shadow-xs border border-[#fcd200] transition active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
