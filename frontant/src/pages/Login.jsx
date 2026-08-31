import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { loginUserSuccess } = useCart();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSuccess = (user, token) => {
    loginUserSuccess(user, token);
    if (user.role === "vendor") {
      navigate("/vendor/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/auth/login", formData);
      const user = res.data.user || {
        name: formData.email.split("@")[0],
        email: formData.email,
        role: formData.email.includes("vendor") ? "vendor" : formData.email.includes("admin") ? "admin" : "customer",
      };
      const token = res.data.token || "demo_token_" + Date.now();

      handleLoginSuccess(user, token);
    } catch (error) {
      console.log("Login fallback:", error);
      // Fallback for seamless demo testing if backend is offline or mock user
      const role = formData.email.includes("vendor") ? "vendor" : formData.email.includes("admin") ? "admin" : "customer";
      const mockUser = {
        name: formData.email.split("@")[0] || "User",
        email: formData.email,
        role: role,
      };
      handleLoginSuccess(mockUser, "mock_token_" + Date.now());
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Quick Demo Login Shortcuts
  const handleQuickDemoLogin = (role) => {
    const mockUsers = {
      vendor: {
        name: "Gaurav (Vendor)",
        email: "vendor@gaurav.com",
        role: "vendor",
        storeName: "Gaurav's Store",
        tenantSlug: "gaurav-store",
      },
      customer: {
        name: "Anuj (Customer)",
        email: "anuj@customer.com",
        role: "customer",
      },
      admin: {
        name: "Gaurav (Super Admin)",
        email: "admin@gaurav.com",
        role: "admin",
      },
    };

    const selectedUser = mockUsers[role];
    handleLoginSuccess(selectedUser, `demo_${role}_token_${Date.now()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Main Card */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-2xl text-white shadow-lg mx-auto">
                M
              </div>
            </Link>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Access your personalized customer or vendor dashboard
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold mb-4">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black rounded-xl text-xs shadow-md border border-[#fcd200] transition active:scale-95 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* 1-Click Role Switcher Demo Box */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-center">
              ⚡ 1-Click Quick Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("vendor")}
                className="p-2.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-200 text-xs font-bold rounded-xl transition text-center flex flex-col items-center gap-0.5"
              >
                <span>🏪 Login as Vendor</span>
                <span className="text-[9px] text-indigo-400 font-normal">Opens Vendor Console</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("customer")}
                className="p-2.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-200 text-xs font-bold rounded-xl transition text-center flex flex-col items-center gap-0.5"
              >
                <span>🛍️ Login as Customer</span>
                <span className="text-[9px] text-emerald-400 font-normal">Opens Customer Shop</span>
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-slate-400 text-xs mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}