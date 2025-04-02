import { Link } from "react-router-dom";
import ProfileHudTop from "./ProfileHudTop";
import logo from "../assets/vehiclemanagementlogo.svg";
import { ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  return (
    <nav className="flex justify-between px-6 py-3 mx-auto border-b-2 shadow-sm">
      <Link to={"/"} className="flex items-center">
        <img src={logo} alt="Logo" width={200} height={200} />
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          className="relative p-3 transition-all duration-300 ease-in-out bg-white border rounded-full cursor-pointer dark:bg-gray-800 dark:border-white/20 hover:dark:border-white border-black/40 hover:border-black"
          to={"/cart"}
        >
          <ShoppingCart className="w-4 h-4 " />
          {cartCount > 0 && (
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
        <ProfileHudTop />
      </div>
    </nav>
  );
};

export default Navbar;
