import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Login Successful');
      navigate('/checkout');
    }, 600);
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
          <Link to="/login" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
          <Link to="/signup" style={{ color: '#475569', textDecoration: 'none' }}>Signup</Link>
          <Link to="/cart" style={{ color: '#475569', textDecoration: 'none' }}>Cart 🛒</Link>
          <Link to="/orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ width: '100%', maxWidth: '380px', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px 32px', textAlign: 'center', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '22px' }}>
            🔐
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Welcome Back</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 24px 0' }}>Sign in to continue to checkout</p>

          <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '20px', marginBottom: 0 }}>
            Don't have an account? <Link to="/signup" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}