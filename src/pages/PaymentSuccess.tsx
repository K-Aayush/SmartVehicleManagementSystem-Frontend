import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Separator } from "../components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  images?: { imageUrl?: string }[];
}

interface OrderDetails {
  orderId: string;
  paymentId: string;
  items: OrderItem[];
  total: number;
}

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");

    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));

      localStorage.removeItem("currentOrder");
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl px-4 py-8 mx-auto">
      <div className="p-6 text-center border rounded-lg shadow-sm">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
        <p className="mb-6 text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="p-4 mb-6 text-left rounded-md bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order ID:</span>
            <span className="font-mono">
              {orderDetails.orderId.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment ID:</span>
            <span className="font-mono">
              {orderDetails.paymentId.slice(0, 8)}...
            </span>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-bold text-left">Order Summary</h2>

        <div className="mb-6 space-y-4">
          {orderDetails.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-white border rounded-md"
            >
              <div className="w-12 h-12 overflow-hidden bg-gray-100 rounded-md">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.quantity} × {formatPrice(item.price)}
                </div>
              </div>

              <div className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between mb-6">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold">
            {formatPrice(orderDetails.total)}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/orders">View My Orders</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/products">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
