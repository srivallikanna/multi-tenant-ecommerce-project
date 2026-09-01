import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userOrders') || '[]');
    setOrders(stored);
  }, []);

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
          <Link to="/orders" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '600' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              My Orders ({orders.length})
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Showing all confirmed orders placed by you</p>
          </div>
          <Link to="/" style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textDecoration: 'none' }}>
            ← Back to Shop
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📦</div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>No orders yet</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>Your completed orders will appear here.</p>
            <Link to="/" style={{ backgroundColor: '#4f46e5', color: '#ffffff', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((o, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>ORDER ID</span>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>#{o.orderId}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
                      {o.paymentMethod}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '6px' }}>
                      ● {o.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>Ordered Items:</span>
                  {o.items?.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                      <span style={{ color: '#0f172a', fontWeight: '600' }}>{it.name} × {it.quantity}</span>
                      <span style={{ color: '#0f172a', fontWeight: '700' }}>₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#334155' }}>Delivering to:</span>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>{o.name}</div>
                    <div style={{ color: '#64748b' }}>{o.address}</div>
                    <div style={{ color: '#64748b' }}>Mobile: {o.mobile}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#64748b', fontWeight: '600' }}>Total Paid</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹{o.total}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}