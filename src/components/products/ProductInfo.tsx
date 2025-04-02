import React from "react";
import { Product } from "../../lib/types";

interface productDetailsProp {
  product: Product | null;
}

const ProductInfo = ({ product }: productDetailsProp) => {
  return <div>ProductInfo</div>;
};

export default ProductInfo;
