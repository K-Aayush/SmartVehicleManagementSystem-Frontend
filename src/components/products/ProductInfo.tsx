import { useState } from "react";
import { Product } from "../../lib/types";

interface productDetailsProp {
  product: Product | null;
}

const ProductInfo = ({ product }: productDetailsProp) => {
  // State to track the currently selected image index
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  if (!product) return null;

  // Get the currently selected image URL
  const currentImageUrl =
    product.images && product.images.length > 0
      ? product.images[selectedImageIndex]?.imageUrl
      : null;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square">
        {currentImageUrl ? (
          <img
            src={currentImageUrl || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-all duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {product.images.map((image, index) => (
            <div
              key={image.id || index}
              className={`w-20 h-20 overflow-hidden border rounded cursor-pointer transition-all duration-200 ${
                selectedImageIndex === index
                  ? "border-2 border-primary shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image.imageUrl || "/placeholder.svg"}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
