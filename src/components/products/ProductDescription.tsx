import { Product } from "../../lib/types";
import { Button } from "../ui/button";
import { Heart, ShoppingCart } from "lucide-react";
interface productDetailsProp {
  product: Product | null;
}

const ProductDescription = ({ product }: productDetailsProp) => {
  if (!product) return null;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <div className="text-2xl font-semibold">{formatPrice(product.price)}</div>

      <div>
        <span className="text-sm text-gray-500">Category:</span>
        <span className="ml-2">{product.category}</span>
      </div>

      <div>
        <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </span>
      </div>

      {product.Vendor && (
        <div>
          <span className="text-sm text-gray-500">Sold by:</span>
          <span className="ml-2">
            {product.Vendor.companyName || product.Vendor.name}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button className="flex-1" disabled={product.stock <= 0}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <Button variant="outline" className="flex-1">
          <Heart className="w-4 h-4 mr-2" />
          Add to Wishlist
        </Button>
      </div>

      <div className="pt-6 mt-6 border-t">
        <h2 className="mb-4 text-xl font-semibold">Product Description</h2>
        <p className="text-gray-700">
          {product.description || "No description available for this product."}
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
