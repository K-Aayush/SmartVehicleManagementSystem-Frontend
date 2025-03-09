import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Edit, Save, Settings } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { profileSchema, profileSchemaData } from "../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateUserDataParams {
  field: string;
  value: string | number;
}

const Profile = () => {
  const { userData, isLoading, backendUrl, token } = useContext(AppContext);
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
      oldPassword: "",
      newPassword: "",
    },
    mode: "onChange",
  });

  const updateUserData = async ({ field, value }: UpdateUserDataParams) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/auth/${field}`,
        { [field]: value },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      //status axios error
      if (error instanceof AxiosError && error.response?.data) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message || "Error while updating data");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  //react query mutaion hook
  const mutation = useMutation({
    mutationFn: ({ field, value }: { field: string; value: string | number }) =>
      updateUserData({ field, value }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      setIsEditing((prev) => ({ ...prev, [variables.field]: false }));
    },
  });

  // Handle Save action
  const onSubmit = ({
    data,
    field,
  }: {
    data: Record<string, string>;
    field: string;
  }) => {
    mutation.mutate({ field, value: data[field] });
  };

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
                    onClick={handleSubmit((data) =>
                      onSubmit({ data, field: "name" })
                    )}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing({ ...isEditing, name: true })}
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
                value={userData?.phone}
                disabled={!isEditing.phone}
              />
              {isEditing.phone ? (
                <Button
                  onClick={handleSubmit((data) =>
                    onSubmit({ data, field: "phone" })
                  )}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing({ ...isEditing, phone: true })}
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
                    onClick={handleSubmit((data) =>
                      onSubmit({ data, field: "password" })
                    )}
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
                    variant="outline"
                    onClick={() =>
                      setIsEditing({ ...isEditing, password: true })
                    }
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
    </div>
  );
};

export default Profile;
