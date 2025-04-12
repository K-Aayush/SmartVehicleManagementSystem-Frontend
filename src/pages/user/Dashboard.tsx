import {
  Bell,
  CreditCard,
  Home,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  SquarePlus,
} from "lucide-react";
// import logo from "../assets/Logo.svg";

import { NavLink, Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="flex items-start overflow-y-auto">
        {/*sidebar for user panel*/}
        <div className="inline-block min-h-screen border-r-2">
          <ul className="flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/dashboard"}
              end
            >
              <LayoutDashboard className="w-5 h-5" />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/orders"}
            >
              <ShoppingBag className="w-5 h-5" />
              <p>My Orders</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/notifications"}
            >
              <Bell className="w-5 h-5" />
              <p>Notifications</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/payment-history"}
            >
              <CreditCard className="w-5 h-5" />
              <p>Payment History</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/add-product"}
            >
              <SquarePlus className="w-5 h-5" />
              <p>Add Product</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/manage-product"}
            >
              <Home className="w-5 h-5" />
              <p>Manage Product</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/user/settings"}
            >
              <Settings className="w-5 h-5" />
              <p>Settings</p>
            </NavLink>
          </ul>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
