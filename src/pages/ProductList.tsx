"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";
import { AppContext } from "../context/AppContext";

// Define types
interface ProductImage {
  id: string;
  imageUrl: string;
  productId: string;
}

interface Vendor {
  name: string;
  companyName: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
  vendorId: string;
  images: ProductImage[];
  Vendor: Vendor;
}

const ProductList = () => {
  // State
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [displayCount, setDisplayCount] = useState(9);

  const { error, setError, isLoading, setIsLoading, backendUrl } =
    useContext(AppContext);

  // URL params for persistence
  const [searchParams, setSearchParams] = useSearchParams();

  // Get sort params from URL or use defaults
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";

  // Update URL when sort changes
  const updateSortParams = (newSortBy: string, newOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortBy);
    params.set("order", newOrder);
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/vendor/getProducts?sortBy=${sortBy}&order=${order}`
        );

        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error Fetching Products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl, sortBy, order, setError, setIsLoading]);

  // Handle sort field change
  const handleSortFieldChange = (value: string) => {
    updateSortParams(value, order);
  };

  // Handle sort direction change
  const handleSortDirectionChange = (checked: boolean) => {
    updateSortParams(sortBy, checked ? "asc" : "desc");
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Sidebar content (shared between desktop and mobile)
  const SortingOptions = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Sort Products</h3>
        <RadioGroup
          defaultValue={sortBy}
          value={sortBy}
          onValueChange={handleSortFieldChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createdAt" id="sort-date" />
            <Label htmlFor="sort-date">Date Added</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price" id="sort-price" />
            <Label htmlFor="sort-price">Price</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="sort-name" />
            <Label htmlFor="sort-name">Name</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stock" id="sort-stock" />
            <Label htmlFor="sort-stock">Stock</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-2 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="sort-direction">
            Sort Direction: {order === "asc" ? "Ascending" : "Descending"}
          </Label>
          <div className="flex items-center">
            {order === "desc" ? (
              <ArrowDownAZ className="w-4 h-4 mr-2" />
            ) : (
              <ArrowUpAZ className="w-4 h-4 mr-2" />
            )}
            <Switch
              id="sort-direction"
              checked={order === "asc"}
              onCheckedChange={handleSortDirectionChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        {/* Mobile filter button */}
        <Sheet open={openMobileFilters} onOpenChange={setOpenMobileFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filter & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SortingOptions />
          </SheetContent>
        </Sheet>

        {/* Desktop sort dropdown */}
        <div className="items-center hidden gap-2 lg:flex">
          <Select value={sortBy} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Added</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateSortParams(sortBy, order === "asc" ? "desc" : "asc")
            }
          >
            {order === "asc" ? (
              <ArrowUpAZ className="w-4 h-4" />
            ) : (
              <ArrowDownAZ className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="sticky p-6 border rounded-lg top-20">
            <SortingOptions />
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-4">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-1/2 h-4" />
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <Skeleton className="w-1/4 h-4" />
                    <Skeleton className="w-1/4 h-8" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => updateSortParams("createdAt", "desc")}
              >
                Try Again
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, displayCount).map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative w-full h-48 bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          By{" "}
                          {product.Vendor?.companyName ||
                            product.Vendor?.name ||
                            "Unknown vendor"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Added {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <div className="font-semibold">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-sm">
                        {product.stock > 0 ? (
                          <span className="text-green-600">
                            In Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {products.length > displayCount && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setDisplayCount((prevCount) => prevCount + 9)
                    }
                  >
                    View More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
