import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message || "Password reset failed"
      );
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
      {/* Top Header Navbar */}
      <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>🛍️ MultiTenant Store</h1>
        <div style={{ display: "flex", gap: "20px", fontSize: "13px", fontWeight: "600" }}>
          <Link to="/" style={{ color: "#475569", textDecoration: "none" }}>Home</Link>
          <Link to="/login" style={{ color: "#4f46e5", textDecoration: "none" }}>Login</Link>
          <Link to="/signup" style={{ color: "#475569", textDecoration: "none" }}>Signup</Link>
        </div>
      </header>

      {/* Main Center Card */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", padding: "36px", width: "100%", maxWidth: "380px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#eef2ff", color: "#4f46e5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto", fontSize: "20px" }}>🔒</div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Reset Password</h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Create a new password for your account</p>
          </div>

          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>New Password</label>
              <input
                type="password"
                placeholder="New Password (min 6 characters)"
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm New Password"
                required
                minLength="6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
              />
            </div>

            <button
              type="submit"
              style={{ width: "100%", padding: "12px", backgroundColor: "#4f46e5", color: "#ffffff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginTop: "6px" }}
            >
              Reset Password
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f1f5f9", fontSize: "12px", color: "#64748b" }}>
            Remember your credentials? <Link to="/login" style={{ color: "#4f46e5", fontWeight: "700", textDecoration: "none" }}>Back to Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;