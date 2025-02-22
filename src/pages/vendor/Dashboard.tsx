import { Home, LayoutDashboard, SquarePlus } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const VendorDashboard = () => {
  return (
    <div className="flex">
      <div className="flex items-start w-full overflow-y-auto">
        {/*sidebar for requiter pannel*/}
        <div className="inline-block min-h-screen border-r-2">
          <ul className="flex flex-col items-start pt-5 text-gray-800 dark:text-gray-300">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/vendor/dashboard"}
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
              to={"/vendor/addProduct"}
            >
              <SquarePlus />
              <p>Add Product</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
                  isActive && "bg-gray-700 border-r-4 border-primary"
                }`
              }
              to={"/requiterDashboard/manage-service"}
            >
              <Home />
              <p>Manage Product</p>
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

export default VendorDashboard;
