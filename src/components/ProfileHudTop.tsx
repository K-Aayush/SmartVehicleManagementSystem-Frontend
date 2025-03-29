"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ArrowDown, LogIn, LogOut, UserRound, View } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function ProfileHudTop() {
  const { token, logout, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();

    navigate("/");
  };

  return (
    <div className="flex size-[40px] select-none items-center rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="relative overflow-visible size-[40px] rounded-full bg-white dark:bg-gray-800 border transition-all duration-300 ease-in-out dark:border-white/20 hover:dark:border-white border-black/40 hover:border-black cursor-pointer">
            <div className="relative flex items-center justify-center rounded-full size-full">
              <AvatarImage
                className="object-cover object-top rounded-full size-full"
                src={userData?.profileImage}
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
          {!token ? (
            <>
              {" "}
              <Link to={"/login"}>
                <DropdownMenuItem className="cursor-pointer">
                  <LogIn className="mr-2 size-4" />
                  Login
                </DropdownMenuItem>
              </Link>
              <Link to={"/products"}>
                <DropdownMenuItem className="cursor-pointer">
                  <View className="mr-2 size-4" />
                  View Products
                </DropdownMenuItem>
              </Link>
            </>
          ) : (
            <>
              <Link to={"/Profile"}>
                <DropdownMenuItem className="cursor-pointer">
                  <CgProfile className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link to={"/products"}>
                <DropdownMenuItem className="cursor-pointer">
                  <View className="mr-2 size-4" />
                  View Products
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer dark:text-red-400"
              >
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
