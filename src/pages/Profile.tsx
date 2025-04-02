import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Edit, Save, Settings } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import { profileSchema, type profileSchemaData } from "../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const Profile = () => {
  const { userData, isLoading, backendUrl, token, setUserData } =
    useContext(AppContext);

  // State variables to manage input and editing mode
  const [isEditing, setIsEditing] = useState({
    name: false,
    phone: false,
    password: false,
  });

  const {
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<profileSchemaData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name,
      phone: userData?.phone,
      oldPassword: "",
      newPassword: "",
      profileImage: undefined,
    },
    mode: "onChange",
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      setValue("name", userData.name || "");
      setValue("phone", userData.phone || "");
    }
  }, [userData, setValue]);

  // Handle name update
  const updateName = async () => {
    try {
      const values = getValues();
      const formData = new FormData();

      formData.append("name", values.name || "");

      const { data } = await axios.put(
        `${backendUrl}/api/auth/updateProfile`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setUserData(data.user);
        setIsEditing((prev) => ({ ...prev, name: false }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle name update
  const updatePhone = async () => {
    try {
      const values = getValues();
      const formData = new FormData();

      formData.append("phone", values.name || "");

      const { data } = await axios.put(
        `${backendUrl}/api/auth/updateProfile`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setUserData(data.user);
        setIsEditing((prev) => ({ ...prev, phone: false }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle password update
  const updatePassword = async () => {
    try {
      const values = getValues();
      const formData = new FormData();

      formData.append("oldPassword", values.oldPassword || "");
      formData.append("newPassword", values.newPassword || "");

      const { data } = await axios.put(
        `${backendUrl}/api/auth/updateProfile`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setUserData(data.user);
        setIsEditing((prev) => ({ ...prev, password: false }));
        reset({ oldPassword: "", newPassword: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle profile image update separately
  const handleProfileImageUpdate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const { data } = await axios.put(
        `${backendUrl}/api/auth/updateProfile`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProfileImageUpdate(e.target.files[0]);
    }
  };

  // Error handler
  const handleError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data) {
      toast.error(error.response.data.message);
    } else if (error instanceof Error) {
      toast.error(error.message || "Error while updating data");
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this Account?")) {
        const { data } = await axios.delete(`${backendUrl}/api/auth/me`, {
          headers: {
            Authorization: token,
          },
        });

        if (data.success) {
          toast.success(data.message);
          // Redirect or logout user after successful deletion
          // This depends on your app's authentication flow
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message || "Error while deleting user");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col justify-center px-6 py-16 space-y-6 md:mx-16">
        <div className="relative w-32 h-32">
          <label htmlFor="image">
            <img
              src={
                userData?.profileImage ||
                "/placeholder.svg?height=128&width=128"
              }
              alt="profile"
              className="object-cover w-full h-full border rounded-full cursor-pointer"
            />
            <Input
              id="image"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0"
              onChange={handleFileChange}
            />
          </label>
        </div>

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

          {/* full name Section */}
          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Full Name</Label>
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
              {isEditing.name ? (
                <>
                  <div className="w-full">
                    <Input
                      type="text"
                      className="w-full"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <Button type="button" onClick={updateName}>
                    <Save /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    className="w-full"
                    placeholder={userData?.name}
                    disabled
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing((prev) => ({ ...prev, name: true }));
                    }}
                  >
                    <Edit /> Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Phone Number</Label>
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
              {isEditing.phone ? (
                <>
                  <div className="w-full">
                    <Input
                      type="number"
                      className="w-full"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <Button type="button" onClick={updatePhone}>
                    <Save /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    className="w-full"
                    placeholder={userData?.phone}
                    disabled
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing((prev) => ({ ...prev, phone: true }));
                    }}
                  >
                    <Edit /> Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="items-center justify-between w-full pb-6 border-b md:flex">
            <Label className="text-lg min-w-max">Password</Label>
            <div className="flex items-center w-full max-w-md gap-6 mt-2">
              {isEditing.password ? (
                <>
                  <div className="flex flex-col w-full">
                    <div className="w-full">
                      <Input
                        type="password"
                        className="w-full"
                        placeholder="Current password"
                        {...register("oldPassword")}
                      />
                      {errors.oldPassword && (
                        <p className="text-red-500">
                          {errors.oldPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full mt-2">
                      <Input
                        type="password"
                        className="w-full"
                        placeholder="New password"
                        {...register("newPassword")}
                      />
                      {errors.newPassword && (
                        <p className="text-red-500">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button type="button" onClick={updatePassword}>
                    <Save /> Save
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    className="w-full"
                    placeholder="***********"
                    disabled
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing((prev) => ({ ...prev, password: true }));
                      reset({ oldPassword: "", newPassword: "" });
                    }}
                  >
                    <Edit /> Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="items-center justify-between w-full py-6 border-b md:flex">
            <div className="flex flex-col ">
              <h2 className="text-lg min-w-max">Delete Account</h2>
              <p className="max-w-xs text-xs">
                Please note: This action cannot be undone and will permanently
                delete your account.
              </p>
            </div>
            <div className="flex items-center w-full max-w-md gap-6">
              <Button
                onClick={handleDelete}
                className="mt-2"
                variant={"destructive"}
              >
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
