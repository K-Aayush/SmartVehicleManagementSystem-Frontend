import { LayoutDashboard, Car, MessageSquare } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const ServiceProviderDashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="flex items-start overflow-y-auto">
        <div className="inline-block min-h-screen border-r-2">
          <ul className="flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/service-provider/dashboard"}
              end
            >
              <LayoutDashboard />
              <p>Dashboard</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/service-provider/vehicles"}
            >
              <Car />
              <p>Manage Vehicles</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/service-provider/chat"}
            >
              <MessageSquare />
              <p>Messages</p>
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

export default ServiceProviderDashboard;
