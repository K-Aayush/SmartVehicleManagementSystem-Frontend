import {
  Home,
  LayoutDashboard,
  MessageSquare,
  SquarePlus,
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
        to={"/vendor/dashboard"}
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
        to={"/vendor/manageProducts"}
      >
        <Home />
        <p>Manage Products</p>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-700 ${
            isActive && "bg-gray-700 border-r-4 border-primary"
          }`
        }
        to={"/vendor/chat"}
      >
        <MessageSquare />
        <p>Messages</p>
      </NavLink>
    </ul>
  );
};

const VendorDashboard = () => {
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

export default VendorDashboard;
