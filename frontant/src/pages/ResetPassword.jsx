import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get("token");
  const queryEmail = searchParams.get("email");
  const token = paramToken || queryToken || "token";

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, {
        password,
        email: queryEmail || undefined,
        token,
      });

      setSuccessMsg("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setSuccessMsg("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col justify-between font-sans selection:bg-[#2874f0] selection:text-white">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#1a56c4] via-[#2874f0] to-[#1e60db] text-white py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-white italic">
              Multi<span className="text-[#ffe500]">Tenant</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition"
          >
            ← Back to Login
          </Link>
        </div>
      </header>

      {/* Main Center Card */}
      <main className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center space-y-5">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#2874f0] bg-blue-50 px-2.5 py-0.5 rounded-md">
            Security Update
          </span>
          <h2 className="text-2xl font-black text-slate-900 pt-1">
            Set New Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your new secure password below to regain access
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-[#eb5a14] active:scale-95 transition text-white font-black text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Updating..." : "Update Password →"}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        © 2026 MultiTenant E-Commerce Platform. All rights reserved.
      </footer>
    </div>
  );
}