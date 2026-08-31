import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then((res) => {
        if (res.data?.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => console.log('Fetch Products Error:', err));
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Pehle Login karein!');
      return;
    }
    try {
      await API.post(
        '/cart/add',
        {
          productId,
          quantity: 1,
          userId: localStorage.getItem('userId')
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Product Added to Cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header Bar */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛍️ MultiTenant Store</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '600' }}>
          <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>Home</Link>
          <Link to="/checkout" style={{ color: '#475569', textDecoration: 'none' }}>Checkout</Link>
          <Link to="/my-orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
          <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>Login</Link>
        </div>
      </header>

      {/* Product List Grid */}
      <main style={{ maxWidth: '1000px', margin: '36px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Products List</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Browse available items and add them to your cart.</p>
        </div>

        {products.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
            Loading products from database...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {products.map((p) => (
              <div key={p._id} style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.4' }}>{p.description || 'Verified merchant item'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹{p.price}</span>
                  <button 
                    onClick={() => handleAddToCart(p._id)} 
                    style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;