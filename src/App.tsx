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
import VendorDashboard from "./pages/vendor/VendorDashboard";
import RedirectIfAuthenticated from "./middleware/RedirectIfAuthenticated";


const App = () => {
  const location = useLocation();
  return (
    <div>

      <Navbar />
      <Toaster richColors duration={5000} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
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
        />

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoutes requiredRole="VENDOR">
              <VendorDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/service-provider/dashboard"
          element={
            <ProtectedRoutes requiredRole="SERVICE_PROVIDER">
              <ServiceProviderDashboard />
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
