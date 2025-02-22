import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "../../components/Form-Input";
import { Form } from "../../components/ui/form";
import { loginFormData, loginFormSchema } from "../../lib/validator";

const AddProduct = () => {
  const form = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div>
      <Form {...form}>
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="Email"
          type="text"
          required
        />
      </Form>
    </div>
  );
};

export default AddProduct;
