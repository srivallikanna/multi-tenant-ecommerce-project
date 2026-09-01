import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [fullName, setFullName] = useState('');
  const [flat, setFlat] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobile, setMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userCart') || '[]');
    setItems(stored);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Your cart is empty!');
      navigate('/');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newOrder = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: items,
        total: total,
        name: fullName,
        address: `${flat}, ${city}, ${state} - ${pincode}`,
        mobile: mobile,
        paymentMethod: paymentMethod === 'upi' ? 'UPI (9955543817)' : 'Cash on Delivery',
        status: 'Placed',
        date: new Date().toLocaleDateString()
      };

      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));
      localStorage.removeItem('userCart');

      setLoading(false);
      alert('Order Placed Successfully!');
      navigate('/orders');
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
          <Link to="/login" style={{ color: '#475569', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: '#475569', textDecoration: 'none' }}>Signup</Link>
          <Link to="/cart" style={{ color: '#475569', textDecoration: 'none' }}>Cart 🛒</Link>
          <Link to="/orders" style={{ color: '#475569', textDecoration: 'none' }}>My Orders</Link>
        </div>
      </header>

      <main style={{ maxWidth: '580px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', textAlign: 'center', margin: '0 0 20px 0' }}>
          Delivery & Checkout
        </h2>

        {/* Order Summary box */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', backgroundColor: '#f8fafc', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Items to Order:</span>
          {items.map((item, idx) => (
            <div key={idx} style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              • {item.name} × {item.quantity} = ₹{item.price * item.quantity}
            </div>
          ))}
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
            Total: ₹{total}
          </div>
        </div>

        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Delivery Address</label>
            <input
              type="text"
              required
              placeholder="Flat / Street / Area"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>City</label>
              <input
                type="text"
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>State</label>
              <input
                type="text"
                required
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Pincode</label>
              <input
                type="text"
                required
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Mobile Number</label>
            <input
              type="tel"
              required
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                style={{ padding: '10px', borderRadius: '10px', border: paymentMethod === 'upi' ? '2px solid #4f46e5' : '1px solid #cbd5e1', backgroundColor: paymentMethod === 'upi' ? '#eef2ff' : '#ffffff', color: '#0f172a', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
              >
                ✓ UPI / QR Scan
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                style={{ padding: '10px', borderRadius: '10px', border: paymentMethod === 'cod' ? '2px solid #4f46e5' : '1px solid #cbd5e1', backgroundColor: paymentMethod === 'cod' ? '#eef2ff' : '#ffffff', color: '#0f172a', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
              >
                💵 Cash on Delivery
              </button>
            </div>
          </div>

          {/* UPI Live QR Section */}
          {paymentMethod === 'upi' && (
            <div style={{ textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '16px', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Scan & Pay with Any UPI App</span>
              <div style={{ margin: '10px auto', display: 'flex', justifyContent: 'center' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=user@okaxis&pn=Store&am=${total}&cu=INR`}
                  alt="UPI QR Code"
                  style={{ width: '130px', height: '130px', borderRadius: '8px' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Or Enter UPI ID: <strong>user@okhdfcbank</strong></span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }}
          >
            {loading ? 'Processing Order...' : `Pay & Confirm Order (₹${total})`}
          </button>
        </form>
      </main>
    </div>
  );
}