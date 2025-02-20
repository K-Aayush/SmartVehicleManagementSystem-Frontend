"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ArrowDown, LogIn, LogOut, UserRound } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "sonner";

export default function ProfileHudTop() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.success("Loggingout...");

    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      navigate("/");
    }, 500);
  };

  return (
    <div className="flex size-[40px] select-none items-center rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="relative overflow-visible size-[40px] rounded-full bg-white dark:bg-gray-800 border transition-all duration-300 ease-in-out dark:border-white/20 hover:dark:border-white border-black/40 hover:border-black cursor-pointer">
            <div className="relative flex items-center justify-center rounded-full size-full">
              <AvatarImage
                className="rounded-full size-full"
                src={""}
                alt={"username"}
              />
              <AvatarFallback>
                <UserRound className="size-[20px] dark:text-white text-black" />
              </AvatarFallback>
            </div>
            <div className="absolute bottom-0 right-0 flex items-center justify-center overflow-hidden text-white bg-black rounded-full outline-none size-3 dark:bg-white dark:text-black">
              <ArrowDown />
            </div>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <Link to={"/login"}>
            <DropdownMenuItem className="cursor-pointer">
              <LogIn className="mr-2 size-4" />
              Login
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">
            <CgProfile className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 cursor-pointer dark:text-red-400"
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 size-4" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
