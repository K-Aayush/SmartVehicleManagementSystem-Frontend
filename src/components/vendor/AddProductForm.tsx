import { FormInput } from "../Form-Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addProductFormData, addProductSchema } from "../../lib/validator";
import { Form } from "../ui/form";
import image from "../../assets/add-image.png";
import { useState } from "react";

const AddProductForm = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
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

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Generate previewImage
      const previewUrl = URL.createObjectURL(file);

      // Update the specific image preview based on the index
      setPreviewImages((prev) => {
        const newImages = [...prev];
        newImages[index] = previewUrl;
        return newImages;
      });

      // Set file for form validation (imageUrl expects an array of strings)
      form.setValue("imageUrl", [...form.getValues("imageUrl"), previewUrl], {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form>
        <Form {...form}>
          <div className="flex flex-col max-w-3xl gap-4">
            <FormInput
              control={form.control}
              name="name"
              label="Product Title"
              placeholder="Add product Title"
              type="text"
              required
            />
            <FormInput
              control={form.control}
              name="category"
              label="Product Category"
              placeholder="Add Category Name"
              type="text"
              required
            />

            <div className="flex w-full gap-5">
              <div className="flex-1">
                <FormInput
                  control={form.control}
                  name="price"
                  label="Product Price"
                  placeholder="0"
                  type="number"
                  required
                />
              </div>
              <div className="flex-1">
                <FormInput
                  control={form.control}
                  name="stock"
                  label="Product In stock"
                  placeholder="0"
                  type="number"
                  required
                />
              </div>
            </div>
            <label>Product Images</label>
            <div className="flex items-center gap-4">
              {[...Array(4)].map((_, index) => (
                <label key={index} htmlFor={`profileImage-${index}`}>
                  <img
                    src={previewImages[index] || image}
                    alt="image"
                    className="object-cover w-32 h-32 rounded-sm cursor-pointer"
                  />
                  <input
                    {...form.register(`imageUrl.${index}`)}
                    type="file"
                    id={`profileImage-${index}`}
                    hidden={true}
                    onChange={(e) => handleImageChange(index, e)}
                  />
                </label>
              ))}
            </div>
          </div>
        </Form>
      </form>
    </div>
  );
};

export default AddProductForm;
