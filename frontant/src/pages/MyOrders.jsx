import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const localPlacedOrders = JSON.parse(localStorage.getItem('all_placed_orders') || '[]');

      try {
        if (token && userId) {
          const res = await API.get(`/orders/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const apiOrders = res.data?.orders || (Array.isArray(res.data) ? res.data : []);
          
          if (localPlacedOrders.length > 0) {
            setOrders(localPlacedOrders);
          } else {
            setOrders(apiOrders.reverse());
          }
        } else {
          setOrders(localPlacedOrders);
        }
      } catch (err) {
        setOrders(localPlacedOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛍️ MultiTenant Store</h1>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '600' }}>
          <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}>Home</Link>
          <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: '#475569', textDecoration: 'none' }}>Signup</Link>
          <Link to="/cart" style={{ color: '#475569', textDecoration: 'none' }}>Cart</Link>
          <Link to="/orders" style={{ color: '#4f46e5', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ maxWidth: '680px', width: '100%', margin: '36px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>My Orders ({orders.length})</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Showing all confirmed orders placed by you</p>
          </div>
          <Link to="/" style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', textDecoration: 'none' }}>← Back to Shop</Link>
        </div>

        {loading ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>No orders placed yet</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Add products from store and checkout to view here.</p>
            <Link to="/" style={{ backgroundColor: '#4f46e5', color: '#ffffff', textDecoration: 'none', padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', display: 'inline-block' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((o, idx) => {
              const orderId = o._id || `ORD-${idx + 1}`;
              const status = o.status || 'Placed';
              const totalAmount = o.totalAmount || o.totalPrice || 0;
              const addr = o.address || o.shippingAddress || {};

              return (
                <div key={orderId} style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Order ID</span>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#4f46e5', fontFamily: 'monospace' }}>#{orderId}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                        {o.paymentMethod || 'UPI'}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', backgroundColor: '#dcfce7', color: '#15803d' }}>
                        ● {status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>Ordered Items:</span>
                    {Array.isArray(o.items) && o.items.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {o.items.map((it, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                            <span style={{ color: '#0f172a', fontWeight: '600' }}>{it.name || it.productId?.name || 'Product'} × {it.quantity || 1}</span>
                            <span style={{ color: '#0f172a', fontWeight: '700' }}>₹{(it.price || it.productId?.price || 0) * (it.quantity || 1)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', color: '#0f172a', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontWeight: '600' }}>
                        {o.products || 'Selected Store Products'}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                      <strong style={{ color: '#334155' }}>Delivering to:</strong><br />
                      {addr.fullName || 'Customer'}<br />
                      {addr.address ? `${addr.address}, ` : ''}{addr.city || ''} {addr.state ? `, ${addr.state}` : ''} {addr.pincode ? `- ${addr.pincode}` : ''}<br />
                      {addr.mobile && <span style={{ color: '#475569', fontWeight: '600' }}>Mobile: {addr.mobile}</span>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Total Paid</span>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>₹{totalAmount}</div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;