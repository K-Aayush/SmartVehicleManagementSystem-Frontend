import { useContext } from "react";
import { Product } from "../../lib/types";
import { Button } from "../ui/button";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { CartContext } from "../../context/CartContext";
interface productDetailsProp {
  product: Product | null;
}

const ProductDescription = ({ product }: productDetailsProp) => {
  const { addToCart, cartItems, updateQuantity } = useContext(CartContext);
  if (!product) return null;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Check if product is in cart
  const cartItem = cartItems.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    if (product && cartItem) {
      const newQuantity = cartItem.quantity + change;
      updateQuantity(product.id, newQuantity);
    }
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
        {!isInCart ? (
          <Button
            className="flex-1"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 font-medium">{cartItem.quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleQuantityChange(1)}
              disabled={cartItem.quantity >= product.stock}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        <Button variant="outline" className="flex-1">
          <Heart className="w-4 h-4 mr-2" />
          Add to Wishlist
        </Button>
      </div>

      {/* Description */}
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
