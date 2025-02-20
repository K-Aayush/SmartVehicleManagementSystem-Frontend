import { Navigate, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <div>
      <Navbar />
      <Toaster richColors duration={5000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/vendor" element={<RegisterVendor />} />
        <Route path="/register/user" element={<RegisterUser />} />
        <Route
          path="/register/service-provider"
          element={<RegisterServiceProvider />}
        />
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["USER"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["VENDOR"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        </Route>

        <Route
          element={<ProtectedRoutes allowedRoles={["SERVICE_PROVIDER"]} />}
        >
          <Route
            path="/service-provider/dashboard"
            element={<ServiceProviderDashboard />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
