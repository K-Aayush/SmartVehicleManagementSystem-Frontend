import { FormInput } from "../Form-Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { addProductFormData, addProductSchema } from "../../lib/validator";
import { Form } from "../ui/form";
import image from "../../assets/add-image.png";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import { AppContext } from "../../context/AppContext";
import { vendorProductResponse } from "../../lib/types";
import { toast } from "sonner";

const AddProductForm = () => {
  const motorVehicleCategories = [
    "Vehicle Parts & Accessories",
    "Vehicle Maintenance & Repair",
    "Vehicle Electronics & Gadgets",
    "Motorcycle & Two-Wheeler Accessories",
    "Commercial & Heavy-Duty Vehicle Equipment",
    "Customization & Performance Upgrades",
    "Vehicle Rental & Leasing Services",
  ];

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { backendUrl, token } = useContext(AppContext);
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

      // Set file for form validation (imageUrl expects an array of strings
      const currentFiles = form.getValues("imageUrl");
      currentFiles[index] = file;
      form.setValue("imageUrl", currentFiles, { shouldValidate: true });
    }
  };

  // Submit Handler
  const handleSubmit: SubmitHandler<addProductFormData> = async (
    productData
  ) => {
    console.log("Form Submitted: ", productData);
    setIsSubmitting(true);
    try {
      //creating new formdata
      const formData = new FormData();

      //append each formData
      formData.append("name", productData.name);
      formData.append("category", productData.category);
      formData.append("price", productData.price.toString());
      formData.append("stock", productData.stock.toString());

      if (Array.isArray(productData.imageUrl)) {
        productData.imageUrl.forEach((image) => {
          if (image instanceof File) {
            formData.append("imageUrl", image);
          }
        });
      }

      const { data } = await axios.post<vendorProductResponse>(
        backendUrl + "/api/vendor/addProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      if (data.success) {
        console.log(data);
        toast.success(data.message);
        form.reset({
          name: "",
          category: "",
          price: 0,
          stock: 0,
          imageUrl: [],
        });
        setPreviewImages([]);
      } else toast.error(data.message);
    } catch (error) {
      //Error handling
      if (error instanceof AxiosError && error.response) {
        //400, 401 or 500 error
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        //unexpected error
        toast.error(error.message || "An error occured while registering");
      } else {
        toast.error("Internal Server Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col max-w-3xl gap-4">
            <FormInput
              control={form.control}
              name="name"
              label="Product Title"
              placeholder="Add product Title"
              type="text"
              required
            />

            {/* Updated Category Field with Dropdown */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">
                Product Category
              </label>
              <select
                {...form.register("category")}
                className="px-4 py-2 bg-[#020817] border border-gray-300 rounded-md"
              >
                <option value="">Select a Category</option>
                {motorVehicleCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {form.formState.errors.category && (
                <span className="mt-1 text-sm text-red-500">
                  {form.formState.errors.category.message}
                </span>
              )}
            </div>

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
          <Button
            type="submit"
            disabled={isSubmitting}
            variant={"secondary"}
            className="mt-5"
          >
            {isSubmitting ? "Loading..." : "Add Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProductForm;
