import React from "react";
import { Product } from "../../lib/types";

interface SuggestedProductListProp {
  product: Product[];
  selectedProductId?: string;
}

const SuggestedProductList = ({
  product,
  selectedProductId,
}: SuggestedProductListProp) => {
  return <div>SuggestedProductList</div>;
};

export default SuggestedProductList;
