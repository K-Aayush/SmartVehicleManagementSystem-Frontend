import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "../Form-Input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { registerFormSchema, registerFormData } from "../../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useContext, useEffect, useState } from "react";
import image from "../../assets/upload.png";

import { AppContext } from "../../context/AppContext";

const ServiceProviderRegisterForm = () => {
  const { isLoading, registerUser } = useContext(AppContext);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<registerFormData | null>(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState<boolean>(true);

  const form = useForm<registerFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      profileImage: "",
      role: "SERVICE_PROVIDER",
    },
  });

  const handleSubmit: SubmitHandler<registerFormData> = async (userData) => {
    console.log("Before submission:", userData);
    console.log(form.formState.errors);

    try {
      if (isTextDataSubmitted) {
        setIsTextDataSubmitted(false);
        setFormValues(userData);
      } else {
        await registerUser(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Set file for form validation
      form.setValue("profileImage", file, { shouldValidate: true });

      // Generate previewImage
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  //store the data after going nextpage for logo upload
  useEffect(() => {
    if (isTextDataSubmitted && formValues) {
      form.setValue("name", formValues.name);
      form.setValue("phone", formValues.phone);
      form.setValue("role", formValues.role);
      form.setValue("email", formValues.email);
      form.setValue("password", formValues.password);
    }
  }, [isTextDataSubmitted, formValues, form]);

  return (
    <div>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">
          Service Provider Register Form
        </CardTitle>
        <CardDescription>
          Register your account by filling out the form below, make sure the
          data you enter is correct.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {isTextDataSubmitted ? (
              <>
                <div className="space-y-4">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    type="text"
                    isPending={isLoading}
                    required
                  />
                  <FormInput
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter your phone number"
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

                <Button className="w-full" type="submit">
                  {isLoading ? "Processing..." : "Next"}
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col my-10">
                  <div className="flex items-center gap-4">
                    <label htmlFor="profileImage">
                      <img
                        src={previewImage || image}
                        alt="image"
                        className="object-cover w-16 h-16 rounded-full cursor-pointer"
                      />
                      <input
                        {...form.register("profileImage")}
                        type="file"
                        id="profileImage"
                        hidden={true}
                        onChange={handleImageChange}
                      />
                    </label>
                    <p>Upload Profile Image</p>
                  </div>
                </div>

                <Button className="w-full" type="submit">
                  {isLoading ? "Processing..." : "Register"}
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default ServiceProviderRegisterForm;
