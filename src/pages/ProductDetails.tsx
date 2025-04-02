import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Product } from "../lib/types";
import axios from "axios";
import ProductInfo from "../components/products/ProductInfo";
import ProductDescription from "../components/products/ProductDescription";
import SuggestedProductList from "../components/products/SuggestedProductList";

const ProductDetails = () => {
  const { id } = useParams();

  //scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const {
    backendUrl,
    setIsLoading,
    isLoading,
    products,

    setError,
    error,
  } = useContext(AppContext);
  const [productByCategory, setProductByCategory] = useState<Product[]>([]);
  const [productData, setProductData] = useState<Product | null>(null);

  //function to fetch product by category
  const fetchProductByCategory = useCallback(
    (categoryName: string) => {
      if (products.length === 0) return;
      const filteredProductList = products.filter(
        (product) =>
          product.category.toLowerCase() === categoryName.toLowerCase()
      );
      setProductByCategory(filteredProductList);
    },
    [products]
  );

  // fetching the product data by id
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/vendor/getProductById/${id}`
        );

        if (data.success) {
          setProductData(data.product);
          console.log(data.product);
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.log("product fetching error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [id, backendUrl, setError, setIsLoading]);

  useEffect(() => {
    if (productData?.category) {
      fetchProductByCategory(productData?.category);
    }
  }, [productData, fetchProductByCategory]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl md:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div>
          <ProductInfo product={productData} />
        </div>

        <div>
          <ProductDescription product={productData} />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
        <SuggestedProductList
          product={productByCategory.filter(
            (product) => product.id !== productData?.id
          )}
          selectedProductId={productData?.id}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
