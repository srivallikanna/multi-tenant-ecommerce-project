import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ResetPassword  from './pages/ResetPassword';
import MyOrders from './pages/MyOrders';
import ForgotPassword from './pages/ForgotPassword';
function App() {
  return (
    <Router>
      <nav style={{ padding: '10px 20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '15px' }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/cart">Cart 🛒</Link>
        <Link to="/orders">My Orders</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;