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
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileHudTop() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    console.log("logout");
  };

  return (
    <div className="flex size-[40px] select-none items-center rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="relative overflow-visible size-[40px] rounded-full bg-white dark:bg-gray-800 border transition-all duration-300 ease-in-out dark:border-white/20 hover:dark:border-white border-black/40 hover:border-black cursor-pointer">
            <div className="relative size-full flex justify-center items-center rounded-full">
              <AvatarImage
                className="size-full rounded-full"
                src={""}
                alt={"username"}
              />
              <AvatarFallback>
                <UserRound className="size-[20px] dark:text-white text-black" />
              </AvatarFallback>
            </div>
            <div className="absolute bottom-0 right-0 overflow-hidden outline-none flex justify-center items-center size-3 rounded-full dark:bg-white text-white dark:text-black bg-black">
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
            className="cursor-pointer text-red-600 dark:text-red-400"
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
