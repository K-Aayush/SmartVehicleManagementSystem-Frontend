import { Link } from "react-router-dom";
import ProfileHudTop from "./ProfileHudTop";
import logo from "../assets/vehiclemanagementlogo.svg";

const Navbar = () => {
  return (
    <nav className="mx-auto py-3 px-6 flex justify-between border-b-2 shadow-sm">
      <Link to={"/"} className="flex items-center">
        <img src={logo} alt="Logo" width={200} height={200} />
      </Link>

      <ProfileHudTop />
    </nav>
  );
};

export default Navbar;
