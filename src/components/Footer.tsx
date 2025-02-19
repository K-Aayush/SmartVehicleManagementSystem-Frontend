import logo from "../assets/vehiclemanagementlogo.svg";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 mx-auto mt-20 border md:px-20 dark:border">
      <img src={logo} alt="logo" width={200} height={200} />
      <p className="flex-1 pl-4 text-sm text-gray-600 border-l border-gray-500 dark:text-gray-300 max-sm:hidden">
        Copyright ©2025 | All rights reserved
      </p>
      <div className="flex items-center gap-3">
        <FaFacebook size={25} className="text-blue-700" />
        <FaInstagram size={25} className="text-pink-600" />
        <FaTwitter size={25} className="text-cyan-500" />
      </div>
    </div>
  );
};

export default Footer;
