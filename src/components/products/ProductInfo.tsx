import { Product } from "../../lib/types";

interface productDetailsProp {
  product: Product | null;
}

const ProductInfo = ({ product }: productDetailsProp) => {
  if (!product) return null;

  return (
    <div className="space-y-6">
      {/* Product Images */}
      <div className="overflow-hidden bg-gray-100 rounded-lg aspect-square">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].imageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {product.images.map((image, index) => (
            <div
              key={image.id || index}
              className="w-20 h-20 overflow-hidden border rounded cursor-pointer"
            >
              <img
                src={image.imageUrl}
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
