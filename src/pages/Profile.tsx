import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Edit, Settings } from "lucide-react";
import { FormInput } from "../components/Form-Input";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const Profile = () => {
  const { userData, isLoading } = useContext(AppContext);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen ">
      <div className="flex flex-col justify-center px-6 py-16 space-y-6 md:mx-16">
        <img
          src={userData?.profileImage}
          alt="profile"
          className="object-cover w-32 h-32 border rounded-full cursor-pointer"
          loading="lazy"
          decoding="async"
        />

        <div className="max-w-screen-lg space-y-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold md:text-3xl">
            <Settings className="w-6 h-6 md:w-10 md:h-10" />
            Account Settings
          </h2>

          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Email</Label>
            <div className="flex items-center w-full max-w-md gap-6">
              <Input
                className="w-full"
                placeholder={userData?.email}
                disabled
              />
              <div className="w-[110px]"></div>
            </div>
          </div>

          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Full Name</Label>
            <div className="flex items-center w-full max-w-md gap-6">
              <Input className="w-full" placeholder={userData?.name} disabled />
              <Button variant={"outline"}>
                <Edit /> Edit
              </Button>
            </div>
          </div>

          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Phone Number</Label>
            <div className="flex items-center w-full max-w-md gap-6">
              <Input
                className="w-full"
                placeholder={userData?.phone}
                disabled
              />
              <Button variant={"outline"}>
                <Edit /> Edit
              </Button>
            </div>
          </div>

          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Password</Label>
            <div className="flex items-center w-full max-w-md gap-6">
              <Input className="w-full" placeholder="***********" disabled />
              <Button variant={"outline"}>
                <Edit /> Edit
              </Button>
            </div>
          </div>

          {userData?.role === "VENDOR" && (
            <div className="items-center justify-between w-full md:flex">
              <Label className="text-lg min-w-max">Company Name</Label>
              <Input
                className="w-full max-w-md mt-2"
                placeholder={userData?.companyName}
                disabled
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
