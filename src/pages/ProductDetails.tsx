import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Product } from "../lib/types";

const ProductDetails = () => {
  const { id } = useParams();

  //scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { backendUrl, setIsLoading, isLoading, products, setProducts } =
    useContext(AppContext);
  const [productByCategory, setProductByCategory] = useState<Product[]>([]);

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

  
  return <div>ProductDetails</div>;
};

export default ProductDetails;
