import { Product } from "../../lib/types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";

interface SuggestedProductListProp {
  product: Product[];
}

const SuggestedProductList = ({ product }: SuggestedProductListProp) => {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (product.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {product.map((item) => (
        <Link to={`/productDetails/${item.id}`} key={item.id}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <div className="relative w-full overflow-hidden bg-gray-100 aspect-square">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0].imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-1">{item.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {item.category}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="font-semibold">{formatPrice(item.price)}</div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedProductList;
