import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProductDetails from "./pages/Productdetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomerOrders from "./pages/CustomerOrders";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import TenantStore from "./pages/TenantStore";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/product/:id", element: <ProductDetails /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/orders", element: <CustomerOrders /> },
  { path: "/my-orders", element: <CustomerOrders /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/vendor", element: <VendorDashboard /> },
  { path: "/vendor/dashboard", element: <VendorDashboard /> },
  { path: "/store/:slug", element: <TenantStore /> }
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
