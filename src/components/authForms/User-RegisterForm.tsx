import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "../Form-Input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { registerFormSchema } from "../../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useContext, useState } from "react";
import { registerFormData } from "../../lib/types";
import image from "../../assets/upload.png";

import { AppContext } from "../../context/AppContext";

const UserRegisterForm = () => {
  const { isLoading, registerUser } = useContext(AppContext);
  const [isTextDataSubmitted, setIsTextDataSubmitted] =
    useState<boolean>(false);
  const form = useForm<registerFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      profileImage: "",
      role: "USER",
    },
  });

  return (
    <div>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">User Register Form</CardTitle>
        <CardDescription>
          Register your account by filling out the form below, make sure the
          data you enter is correct.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit()}>
            {isTextDataSubmitted ? (
              <>
                <div className="flex flex-col my-10">
                  <div className="flex items-center gap-4">
                    <label htmlFor="profileImage">
                      <img
                        src={image}
                        alt="image"
                        className="flex w-16 rounded-full cursor-pointer dark:bg-gray-800"
                      />
                      <input
                        {...form.register("profileImage")}
                        type="file"
                        id="profileImage"
                        hidden={true}
                      />
                    </label>
                    <p>Upload Profile Image</p>
                  </div>
                  {form.formState.errors.profileImage &&
                    typeof form.formState.errors.profileImage.message ===
                      "string" && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.profileImage.message}
                      </p>
                    )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <FormInput
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="enter your full name"
                  type="text"
                  isPending={isLoading}
                  required
                />
                <FormInput
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="enter your phone number"
                  type="text"
                  isPending={isLoading}
                  required
                />
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="text"
                  isPending={isLoading}
                  required
                />
                <FormInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="********"
                  type="password"
                  isPending={isLoading}
                  required
                />
              </div>
            )}

            <Button className="w-full" type="submit">
              {!isTextDataSubmitted
                ? "Next"
                : isLoading
                ? "processing..."
                : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default UserRegisterForm;
