import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Productdetails from "./pages/Productdetails";
import Cart from "./pages/Cart";
import CustomerOrders from "./pages/CustomerOrders";
import TenantStore from "./pages/TenantStore";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/product/:id", element: <Productdetails /> },
  { path: "/cart", element: <Cart /> },
  { path: "/my-orders", element: <CustomerOrders /> },
  { path: "/store/:tenantSlug", element: <TenantStore /> },
  { path: "/vendor/dashboard", element: <VendorDashboard /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}