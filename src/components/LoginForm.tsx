import { SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "./Form-Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { loginFormSchema, loginFormData } from "../lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const LoginForm = () => {
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit: SubmitHandler<loginFormData> = (data) => {
    console.log(data);
  };

  return (
    <Card>
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
                required
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="********"
                type="password"
                required
              />
            </div>

            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
