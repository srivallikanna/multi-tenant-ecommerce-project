// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUserSuccess } = useCart();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful 🎉");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message || "Login Failed"
      );
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-gray-300 mt-2">
              Login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-500"></div>
            <span className="px-3 text-gray-300 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-200 transition">
              Google
            </button>

            <button className="bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
              Facebook
            </button>
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-300 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-400 hover:text-pink-300 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}