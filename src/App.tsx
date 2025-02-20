import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterVendor from "./pages/auth/RegisterVendor";
import RegisterUser from "./pages/auth/RegisterUser";
import RegisterServiceProvider from "./pages/auth/RegisterServiceProvider";

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
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
