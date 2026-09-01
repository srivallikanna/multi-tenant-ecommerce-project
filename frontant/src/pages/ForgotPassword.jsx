import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data?.message || 'Password reset link sent to your email. Please check your inbox.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #f1f5f9', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>MultiTenant Store</h1>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>
          <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}>Home</Link>
          <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: '#475569', textDecoration: 'none' }}>Signup</Link>
          <Link to="/cart" style={{ color: '#475569', textDecoration: 'none' }}>Cart 🛒</Link>
          <Link to="/orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ width: '100%', maxWidth: '380px', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px 32px', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '22px' }}>
            🔑
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Forgot Password</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 24px 0' }}>Enter your registered email to receive a password reset link.</p>

          {message && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px', borderRadius: '10px', fontSize: '12px', marginBottom: '16px', lineHeight: '1.4' }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '10px', fontSize: '12px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '20px', marginBottom: 0 }}>
            Remember your password? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Back to Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}