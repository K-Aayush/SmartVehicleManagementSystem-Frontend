import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "../../components/Form-Input";
import { Form } from "../../components/ui/form";
import { addProductFormData, addProductSchema } from "../../lib/validator";

const AddProduct = () => {
  const form = useForm<addProductFormData>({
    resolver: zodResolver(addProductSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      imageUrl: [],
    },
  });

  return (
    <div className="flex flex-col w-full">
      <form action="" className="w-full max-w-3xl">
        <Form {...form}>
          <FormInput
            control={form.control}
            name="name"
            label="Product Title"
            placeholder="Add product Title"
            type="text"
            required
          />
        </Form>
      </form>
    </div>
  );
};

export default AddProduct;
