import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "../Form-Input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { loginFormSchema, loginFormData } from "../../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useContext, useState } from "react";
import { authResponse, loginForm } from "../../lib/types";
import axios, { AxiosError } from "axios";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserRegisterForm = () => {
  const [ispending, setIsPending] = useState(false);
  const { backendUrl, setUserData, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit: SubmitHandler<loginFormData> = async (formdata) => {
    setIsPending(true);
    try {
      const loginPayload: loginForm = {
        email: formdata.email,
        password: formdata.password,
      };

      const { data } = await axios.post<authResponse>(
        backendUrl + "/api/auth/login",
        loginPayload
      );

      if (data.success) {
        console.log(data);
        setToken(data.token);
        setUserData(data.user);
        localStorage.setItem("token", data.token);

        if (data.user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "USER") {
          navigate("/user/dashboard");
        } else if (data.user.role === "SERVICE_PROVIDER") {
          navigate("/service-provider/dashboard");
        } else if (data.user.role === "VENDOR") {
          navigate("/vendor/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      //error handling
      if (error instanceof AxiosError && error.response) {
        //400 / 401 or 500 error
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        //unexpected error
        toast.error(error.message || "An error occured while logging");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Login Form</CardTitle>
        <CardDescription>
          Welcome back! Login to your account by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
            <div className="space-y-4">
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Email"
                type="text"
                isPending={ispending}
                required
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="********"
                type="password"
                isPending={ispending}
                required
              />
            </div>
            <Button className="w-full" type="submit">
              {ispending ? "processing..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default UserRegisterForm;
