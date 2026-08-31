import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get(`/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data?.cart || res.data);
      } catch (err) {
        console.error('Fetch Cart Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.price || item.productId?.price || 0) * (item.quantity || 1), 0);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header Bar */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛍️ MultiTenant Store</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '600' }}>
          <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}>Home</Link>
          <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: '#475569', textDecoration: 'none' }}>Signup</Link>
          <Link to="/cart" style={{ color: '#4f46e5', textDecoration: 'none' }}>Cart</Link>
          <Link to="/orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      {/* Main Cart Content */}
      <main style={{ maxWidth: '750px', width: '100%', margin: '40px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Your Shopping Cart</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Review the items you added from the store</p>
        </div>

        {loading ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading cart items...
          </div>
        ) : items.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>Your cart is empty</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Add items from the home page to start shopping.</p>
            <Link to="/" style={{ backgroundColor: '#4f46e5', color: '#ffffff', textDecoration: 'none', padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', display: 'inline-block' }}>
              Explore Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dynamic Items Mapping */}
            {items.map((item, index) => {
              const name = item.productId?.name || item.name || 'Product';
              const price = item.productId?.price || item.price || 0;
              const qty = item.quantity || 1;

              return (
                <div key={item._id || index} style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>{name}</h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Price: ₹{price}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Quantity: {qty}</span>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>₹{price * qty}</div>
                  </div>
                </div>
              );
            })}

            {/* Total & Checkout Button */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Total Payable</span>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>₹{total}</div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)' }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;