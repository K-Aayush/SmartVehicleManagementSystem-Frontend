import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/register";
import RegisterVendor from "./pages/RegisterVendor";
import RegisterUser from "./pages/RegisterUser";
import RegisterServiceProvider from "./pages/RegisterServiceProvider";

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
