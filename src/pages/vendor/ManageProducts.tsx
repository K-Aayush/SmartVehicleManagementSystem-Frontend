import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Pencil, Save, Trash2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
  images?: { imageUrl: string }[];
}

const ManageProducts = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<
    Partial<Product> & { images?: FileList }
  >({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/vendor/getProducts`, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product.id);
    setEditValues({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleSave = async (productId: string) => {
    try {
      const formData = new FormData();

      // Append text fields
      if (editValues.name) formData.append("name", editValues.name);
      if (editValues.price)
        formData.append("price", editValues.price.toString());
      if (editValues.stock)
        formData.append("stock", editValues.stock.toString());

      // Append images if any
      if (editValues.images) {
        Array.from(editValues.images).forEach((file) => {
          formData.append("imageUrl", file);
        });
      }

      const response = await axios.put(
        `${backendUrl}/api/vendor/updateProduct`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        await fetchProducts(); // Refresh products to get updated images
        setEditingProduct(null);
        setEditValues({});
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/vendor/deleteProduct/${productId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditValues((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {editingProduct === product.id ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 overflow-hidden rounded-md">
                        {editValues.images ? (
                          <img
                            src={URL.createObjectURL(editValues.images[0])}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : product.images && product.images[0] ? (
                          <img
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor={`image-${product.id}`}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-sm text-blue-500">
                            <Upload className="w-4 h-4" />
                            Change Image
                          </div>
                        </Label>
                        <Input
                          id={`image-${product.id}`}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 overflow-hidden rounded-md">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                          No image
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Input
                      value={editValues.name}
                      onChange={(e) =>
                        setEditValues({ ...editValues, name: e.target.value })
                      }
                    />
                  ) : (
                    product.name
                  )}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Input
                      type="number"
                      value={editValues.price}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Input
                      type="number"
                      value={editValues.stock}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          stock: parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product.id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(product.id)}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManageProducts;
