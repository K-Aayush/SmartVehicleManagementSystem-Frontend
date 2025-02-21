import { Home, LayoutDashboard, SquarePlus } from "lucide-react";
// import logo from "../assets/Logo.svg";

import { NavLink, Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="flex items-start">
        {/*sidebar for requiter pannel*/}
        <div className="inline-block min-h-screen border-r-2">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-indigo-100 border-r-4 border-primary"
                }`
              }
              to={"/requiterDashboard/dashboard"}
            >
              <LayoutDashboard />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-indigo-100 border-r-4 border-primary"
                }`
              }
              to={"/requiterDashboard/add-service"}
            >
              <SquarePlus />
              <p>Add Service</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-indigo-100 border-r-4 border-primary"
                }`
              }
              to={"/requiterDashboard/manage-service"}
            >
              <Home />
              <p>Manage Services</p>
            </NavLink>
          </ul>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
