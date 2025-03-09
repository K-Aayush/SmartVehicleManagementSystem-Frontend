import { Home, LayoutDashboard } from "lucide-react";
import { FaMarker } from "react-icons/fa";

import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="flex items-start">
        {/*sidebar for requiter pannel*/}
        <div className="inline-block min-h-screen border-r-2">
          <ul className="flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-800 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/admin/dashboard"}
            >
              <LayoutDashboard />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-800 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/admin/manageUsers"}
            >
              <FaMarker />
              <p>Manage Users</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-800 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/admin/manage-service"}
            >
              <Home />
              <p>Manage Services</p>
            </NavLink>
          </ul>
        </div>

        <div className="flex-1 pt-5 ml-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
