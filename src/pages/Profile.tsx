import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Edit, Settings } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { profileSchema, profileSchemaData } from "../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";

const Profile = () => {
  const { userData, isLoading } = useContext(AppContext);
  const queryClient = useQueryClient();

  // State variables to manage input and editing mode
  const [isEditing, setIsEditing] = useState({
    name: false,
    phone: false,
    password: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<profileSchemaData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || "",
      phone: userData?.phone || "",
      password: "",
    },
    mode: "onChange",
  });

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
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
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
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
              <Input className="w-full" placeholder={userData?.name} disabled />
              <Button variant={"outline"}>
                <Edit /> Edit
              </Button>
            </div>
          </div>

          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Phone Number</Label>
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
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
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
              <Input className="w-full" placeholder="***********" disabled />
              <Button variant={"outline"}>
                <Edit /> Edit
              </Button>
            </div>
          </div>

          {userData?.role === "VENDOR" && (
            <div className="items-center justify-between w-full md:flex">
              <Label className="text-lg min-w-max">Company Name</Label>
              <div className="flex items-center w-full max-w-md gap-6 mt-2">
                <Input
                  className="w-full"
                  placeholder={userData?.companyName}
                  disabled
                />
                <div className="w-[110px]"></div>
              </div>
            </div>
          )}

          <div className="items-center justify-between w-full py-6 border-b md:flex">
            <div className="flex flex-col ">
              <h2 className="text-lg min-w-max">Delete Account</h2>
              <p className="max-w-xs text-xs">
                Please note: This action cannot be undone and will permanently
                delete your account.
              </p>
            </div>
            <div className="flex items-center w-full max-w-md gap-6">
              <Button className="mt-2" variant={"destructive"}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
