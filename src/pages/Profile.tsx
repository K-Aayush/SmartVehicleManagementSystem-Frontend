import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Edit, Save, Settings } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import { profileSchema, profileSchemaData } from "../lib/validator";
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
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<profileSchemaData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name,
      phone: userData?.phone,
      oldPassword: "",
      newPassword: "",
      profileImage: "",
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

  // Handle Save action
  const onSubmit = async (user: profileSchemaData) => {
    try {
      const formData = new FormData();
      // Append profile image if exists
      if (
        user.profileImage instanceof FileList &&
        user.profileImage.length > 0
      ) {
        formData.append("profileImage", user.profileImage[0]);
      }

      formData.append("name", user.name);
      formData.append("phone", user.phone);

      // Only append passwords if editing password
      if (isEditing.password) {
        formData.append("oldPassword", user.oldPassword || "");
        formData.append("newPassword", user.newPassword || "");
      }

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

        reset({
          name: data.user.name,
          phone: data.user.phone,
          oldPassword: "",
          newPassword: "",
          profileImage: "",
        });
        setIsEditing({ name: false, phone: false, password: false });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message || "Error while updating data");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen ">
      <form>
        <div className="flex flex-col justify-center px-6 py-16 space-y-6 md:mx-16">
          <div className="relative w-32 h-32">
            <img
              src={userData?.profileImage}
              alt="profile"
              className="object-cover w-full h-full border rounded-full"
            />
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              {...register("profileImage")}
            />
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

            {/* Full Name */}
            <div className="items-center justify-between w-full pb-6 border-b md:flex">
              <Label className="text-lg min-w-max">Full Name</Label>
              <div className="flex flex-col w-full max-w-md">
                <div className="flex w-full gap-6">
                  <Input
                    className="w-full"
                    {...register("name")}
                    disabled={!isEditing.name}
                  />
                  {isEditing.name ? (
                    <Button
                      type="button"
                      onClick={() => {
                        handleSubmit((data) => {
                          onSubmit({
                            ...data,
                            oldPassword: "",
                            newPassword: "",
                          });
                        })();
                        setIsEditing((prev) => ({ ...prev, name: false }));
                      }}
                    >
                      <Save /> Save
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setIsEditing((prev) => ({ ...prev, name: true }))
                      }
                    >
                      <Edit /> Edit
                    </Button>
                  )}
                </div>

                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="items-center justify-between w-full pb-6 border-b md:flex">
              <Label className="text-lg min-w-max">Phone Number</Label>
              <div className="flex items-center w-full max-w-md gap-6 mt-2">
                <Input
                  className="w-full"
                  {...register("phone")}
                  disabled={!isEditing.phone}
                />
                {isEditing.phone ? (
                  <Button
                    type="button"
                    onClick={() => {
                      handleSubmit((data) => {
                        onSubmit({
                          ...data,
                          oldPassword: "",
                          newPassword: "",
                        });
                      })();
                      setIsEditing((prev) => ({ ...prev, phone: false }));
                    }}
                  >
                    <Save /> Save
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setIsEditing((prev) => ({ ...prev, phone: true }))
                    }
                  >
                    <Edit /> Edit
                  </Button>
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
                    <Button
                      type="button"
                      onClick={() => {
                        handleSubmit((data) => {
                          onSubmit(data);
                        })();
                        setIsEditing((prev) => ({ ...prev, password: false }));
                      }}
                    >
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
      </form>
    </div>
  );
};

export default Profile;
