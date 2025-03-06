import { Home, LayoutDashboard, Search, User } from "lucide-react";
import logo from "../../assets/vehiclemanagementlogo.svg";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { logout, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/");
  };
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
              to={"/adminDashboard/dashboard"}
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
              to={"/adminDashboard/viewUsers"}
            >
              <Search />
              <p>View All Users</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-indigo-100 border-r-4 border-primary"
                }`
              }
              to={"/adminDashboard/manage-service"}
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
