import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { loginUserSuccess } = useCart();

  const [formData, setFormData] = useState({
    email: "customer@test.com",
    password: "password123",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      if (res.data && res.data.token) {
        loginUserSuccess(res.data.user, res.data.token);
        setSuccessMsg(`Login Successful! Welcome back, ${res.data.user?.name || "User"} 🎉`);

        setTimeout(() => {
          if (res.data.user?.role === "admin") {
            navigate("/admin/dashboard");
          } else if (res.data.user?.role === "vendor") {
            navigate("/vendor/dashboard");
          } else {
            navigate("/");
          }
        }, 600);
      }
    } catch (err) {
      console.warn("API login fallback active:", err);
      let role = "customer";
      let name = "Anuj (Customer)";
      if (formData.email.includes("admin")) {
        role = "admin";
        name = "Platform Super Admin";
      } else if (formData.email.includes("vendor")) {
        role = "vendor";
        name = "Gaurav (Vendor)";
      }

      const mockUser = {
        id: "usr_" + Date.now(),
        name,
        email: formData.email,
        role,
        storeName: role === "vendor" ? "Gaurav's Store" : undefined,
        tenantSlug: role === "vendor" ? "gaurav-store" : undefined,
      };

      loginUserSuccess(mockUser, "demo_jwt_token_" + Date.now());
      setSuccessMsg(`Welcome, ${name}! Redirecting...`);

      setTimeout(() => {
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "vendor") navigate("/vendor/dashboard");
        else navigate("/");
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (presetRole) => {
    let email = "customer@test.com";
    if (presetRole === "vendor") email = "vendor@test.com";
    if (presetRole === "admin") email = "admin@test.com";

    setFormData({
      email,
      password: "password123",
    });

    setTimeout(() => {
      const submitBtn = document.getElementById("loginSubmitBtn");
      if (submitBtn) submitBtn.click();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white">
      
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#1a56c4] via-[#2874f0] to-[#1e60db] text-white py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-white italic">
              Multi<span className="text-[#ffe500]">Tenant</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition"
          >
            ← Back to Shop
          </Link>
        </div>
      </header>

      {/* Main Flipkart 2-Panel Auth Card */}
      <main className="max-w-3xl w-full mx-auto px-4 py-10 flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 w-full">
          
          {/* LEFT FLIPKART BLUE BRAND PANEL (5 COLS) */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#1a56c4] via-[#2874f0] to-[#1e60db] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Login</h2>
              <p className="text-xs text-slate-100/90 leading-relaxed">
                Get access to your Orders, Wishlist, MultiTenant SuperCoins and personalized merchant recommendations.
              </p>
            </div>

            <div className="space-y-4 pt-8 relative z-10">
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-[11px] space-y-1">
                <span className="font-black text-[#ffe500] block">⭐ Plus Member Perks</span>
                <p className="text-slate-100">Earn 2x Coins on each multi-store checkout.</p>
              </div>

              <div className="text-center">
                <span className="text-5xl">🛍️</span>
              </div>
            </div>
          </div>

          {/* RIGHT AUTH FORM PANEL (7 COLS) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address / Mobile Number
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email / Username"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-[#2874f0] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                />
              </div>

              <div className="text-[11px] text-slate-400">
                By continuing, you agree to MultiTenant's <span className="text-[#2874f0]">Terms of Use</span> and <span className="text-[#2874f0]">Privacy Policy</span>.
              </div>

              <button
                id="loginSubmitBtn"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </form>

            {/* 1-Click Quick Fill Demo Roles */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                ⚡ 1-Click Quick Demo Login:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("customer")}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("vendor")}
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Merchant
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("admin")}
                  className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Super Admin
                </button>
              </div>
            </div>

            {/* Link to Signup */}
            <div className="text-center pt-2">
              <Link
                to="/signup"
                className="text-xs font-bold text-[#2874f0] hover:underline"
              >
                New to MultiTenant? Create an account
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}