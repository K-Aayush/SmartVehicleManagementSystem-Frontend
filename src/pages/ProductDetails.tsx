import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Product } from "../lib/types";
import axios from "axios";

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="min-h-screen px-10 py-8 mx-6 md:py-20 md:px-26 lg:px-36 md:mx-16">
      <ProductInfo product={productData} />

      <div className="grid grid-cols-4 mt-16">
        <div className="col-span-4 md:col-span-3">
          <ProductDescription product={productData} />
        </div>
        <div className="hidden md:block">
          <SuggestedProductList
            product={productByCategory.filter(
              (product) => product.id !== productData?.id
            )}
            selectedProductId={productData?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
