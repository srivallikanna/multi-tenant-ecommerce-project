import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userCart') || '[]');
    setItems(stored);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          <Link to="/cart" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '600' }}>Cart 🛒</Link>
          <Link to="/orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Your Shopping Cart</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Review the items you added from the store</p>
        </div>

        {items.length === 0 ? (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛒</div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>Your cart is empty</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>Add items from the home page to start shopping.</p>
            <Link to="/" style={{ backgroundColor: '#4f46e5', color: '#ffffff', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', display: 'inline-block' }}>
              Explore Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>{item.name}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Price: ₹{item.price}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Quantity: {item.quantity}</span>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>₹{item.price * item.quantity}</div>
                </div>
              </div>
            ))}

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', marginTop: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>Total Payable</span>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>₹{total}</div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}