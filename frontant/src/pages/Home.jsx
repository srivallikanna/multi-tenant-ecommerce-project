import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('userCart') || '[]');
    const totalQty = storedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQty);
  }, []);

  const products = [
    { id: '1', name: 'Wireless Headphones', desc: 'High quality bass headphones', price: 1500 },
    { id: '2', name: 'Wireless Mouse', desc: 'Smooth wireless mouse', price: 800 },
    { id: '3', name: 'Keyboard', desc: 'Comfortable wireless keyboard', price: 1200 }
  ];

  const handleAddToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem('userCart') || '[]');
    const existingIndex = storedCart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      storedCart[existingIndex].quantity += 1;
    } else {
      storedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('userCart', JSON.stringify(storedCart));
    const totalQty = storedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQty);
    alert('Product Added to Cart!');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #f1f5f9', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛍️</span>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>MultiTenant Store</h1>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>
          <Link to="/" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
          <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: '#475569', textDecoration: 'none' }}>Signup</Link>
          <Link to="/cart" style={{ color: '#475569', textDecoration: 'none' }}>Cart 🛒 {cartCount > 0 && `(${cartCount})`}</Link>
          <Link to="/orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Products List</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Browse available items and add them to your cart.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>{p.name}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>{p.desc}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹{p.price}</span>
                <button
                  onClick={() => handleAddToCart(p)}
                  style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}