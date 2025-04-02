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
    setProducts,
    setError,
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

  return <div>ProductDetails</div>;
};

export default ProductDetails;
