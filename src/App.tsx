import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterVendor from "./pages/auth/RegisterVendor";
import RegisterUser from "./pages/auth/RegisterUser";
import RegisterServiceProvider from "./pages/auth/RegisterServiceProvider";
import ProtectedRoutes from "./middleware/ProtectedRoutes";
import UserDashboard from "./pages/user/Dashboard";
import ServiceProviderDashboard from "./pages/service-provider/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import RedirectIfAuthenticated from "./middleware/RedirectIfAuthenticated";
import ServiceProviderDashboardPage from "./pages/service-provider/ServiceProviderDashboardPage";
import VendorDashboardPage from "./pages/vendor/VendorDashboardPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import AddProduct from "./pages/vendor/AddProduct";
import AdminDashboard from "./pages/admin/AdminDashboars";
import ViewAdminDashboard from "./pages/admin/ViewAdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import Profile from "./pages/Profile";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import UserOrders from "./pages/user/UserOrders";
import OrderDetails from "./pages/OrderDetails";
import Chat from "./pages/user/Chat";
import EmergencyService from "./pages/user/EmergencyService";
import ManageProducts from "./pages/vendor/ManageProducts";
import VendorChat from "./pages/vendor/VendorChat";
import VehicleManagement from "./pages/service-provider/VehicleManagement";

const App = () => {
  const location = useLocation();
  const { token } = useContext(AppContext);

  const hideNavbarRoutes = ["/login", "/register"];
  const hideFooterRoutes = [
    "/login",
    "/register",
    "/user",
    "/vendor",
    "/service-provider",
    "/admin",
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(
    `/${location.pathname.split("/")[1]}`
  );

  const shouldHideFooter = hideFooterRoutes.includes(
    `/${location.pathname.split("/")[1]}`
  );

  const queryClient = new QueryClient();

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Toaster richColors duration={5000} />
      <Routes>
        <Route path="/" element={<Home />} />
        {token && (
          <Route
            path="/profile"
            element={
              <QueryClientProvider client={queryClient}>
                <Profile />
              </QueryClientProvider>
            }
          />
        )}

        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/products" element={<ProductList />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/vendor"
          element={
            <RedirectIfAuthenticated>
              <RegisterVendor />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/user"
          element={
            <RedirectIfAuthenticated>
              <RegisterUser />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/service-provider"
          element={
            <RedirectIfAuthenticated>
              <RegisterServiceProvider />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoutes requiredRole="USER">
              <UserDashboard />
            </ProtectedRoutes>
          }
        >
          <Route path="" element={<UserDashboardPage />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="chat" element={<Chat />} />
          <Route path="emergency" element={<EmergencyService />} />
        </Route>

        <Route
          path="/vendor"
          element={
            <ProtectedRoutes requiredRole="VENDOR">
              <VendorDashboard />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<VendorDashboardPage />} />
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="manageProducts" element={<ManageProducts />} />
          <Route path="chat" element={<VendorChat />} />
        </Route>

        <Route
          path="/service-provider"
          element={
            <ProtectedRoutes requiredRole="SERVICE_PROVIDER">
              <ServiceProviderDashboard />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<ServiceProviderDashboardPage />} />
          <Route path="vehicles" element={<VehicleManagement />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoutes requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<ViewAdminDashboard />} />
          <Route path="manageUsers" element={<ManageUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
