import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Password updated successfully! Please login with your new password.');
      navigate('/login');
    }, 600);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #f1f5f9', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>MultiTenant Store</h1>
        </div>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ width: '100%', maxWidth: '380px', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px 32px', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '22px' }}>
            🔒
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Set New Password</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 24px 0' }}>Resetting password for: <strong>{email}</strong></p>

          <form onSubmit={handleReset} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '20px', marginBottom: 0 }}>
            Back to <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}