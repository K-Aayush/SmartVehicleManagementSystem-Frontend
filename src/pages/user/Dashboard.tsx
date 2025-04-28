import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  HistoryIcon,
  Menu,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useState } from "react";

const Sidebar = () => {
  return (
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
        to={"/user/dashboard/orders"}
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
        to={"/user/dashboard/chat"}
      >
        <MessageSquare className="w-5 h-5" />
        <p>Messages</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
            isActive && "bg-gray-700 border-r-4 border-primary"
          }`
        }
        to={"/user/dashboard/emergency"}
      >
        <AlertTriangle className="w-5 h-5" />
        <p>Emergency Service</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
            isActive && "bg-gray-700 border-r-4 border-primary"
          }`
        }
        to={"/user/dashboard/emergencyHistory"}
      >
        <HistoryIcon className="w-5 h-5" />
        <p>Emergency History</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
            isActive && "bg-gray-700 border-r-4 border-primary"
          }`
        }
        to={"/profile"}
      >
        <Settings className="w-5 h-5" />
        <p>Settings</p>
      </NavLink>
    </ul>
  );
};

const UserDashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Mobile Menu Button */}
        <div className="fixed z-40 top-4 left-4 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="sticky top-0 hidden h-screen border-r-2 lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-screen p-5 overflow-y-auto lg:ml-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
