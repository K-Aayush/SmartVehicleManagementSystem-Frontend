import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

interface OrderDetails {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status?: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images?: { imageUrl?: string }[];
    vendorId: string;
    Vendor?: {
      id: string;
      name: string;
    };
  };
  user?: {
    payment?: {
      id: string;
      status: string;
      paymentMethod: string;
      amount: number;
      createdAt: string;
    };
  };
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { token, backendUrl } = useContext(AppContext);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && id) {
      fetchOrderDetails();
    }
  }, [token, id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/order/orders/${id}`, {
        headers: { Authorization: token },
      });

      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("An error occurred while loading order details");
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge variant
  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return {
          variant: "default" as const,
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        };
      case "SHIPPED":
        return {
          variant: "secondary" as const,
          icon: <Truck className="w-4 h-4 mr-1" />,
        };
      case "PROCESSING":
        return {
          variant: "secondary" as const,
          icon: <Package className="w-4 h-4 mr-1" />,
        };
      case "PENDING":
        return {
          variant: "outline" as const,
          icon: <Clock className="w-4 h-4 mr-1" />,
        };
      case "CANCELLED":
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
        };
      default:
        return {
          variant: "outline" as const,
          icon: <Clock className="w-4 h-4 mr-1" />,
        };
    }
  };

  // Get payment status badge
  const getPaymentBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return { variant: "default" as const, label: "Paid" };
      case "PENDING":
        return { variant: "outline" as const, label: "Pending" };
      case "INPROGRESS":
        return { variant: "secondary" as const, label: "Processing" };
      case "FAILED":
        return { variant: "destructive" as const, label: "Failed" };
      default:
        return { variant: "outline" as const, label: status || "Unknown" };
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <div className="flex items-center mb-6 space-x-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-8 w-44" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="w-full h-64 mb-6" />
            <Skeleton className="w-full h-32" />
          </div>
          <div>
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Render not found state
  if (!order) {
    return (
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">Order Not Found</h1>
          <p className="mb-6 text-gray-600">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button asChild>
            <Link to="/user/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(order.status);
  const paymentInfo = getPaymentBadge(order.user?.payment?.status);

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/user/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <Badge variant={statusInfo.variant} className="px-3 py-1 text-sm">
          {statusInfo.icon}
          {order.status || "Processing"}
        </Badge>
      </div>

      <h1 className="mb-6 text-2xl font-bold">Order Details</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full h-24 overflow-hidden bg-gray-100 rounded-md sm:w-24">
                  {order.product.images && order.product.images.length > 0 ? (
                    <img
                      src={
                        order.product.images[0].imageUrl || "/placeholder.svg"
                      }
                      alt={order.product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{order.product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.product.category}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Sold by: {order.product.Vendor?.name || "Unknown Vendor"}
                  </p>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm">
                      <span className="font-medium">Price:</span>{" "}
                      {formatPrice(order.product.price)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Quantity:</span>{" "}
                      {order.quantity}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="text-sm">
                <p className="font-medium">Product Description:</p>
                <p className="mt-1 text-gray-600">
                  {order.product.description || "No description available."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-gray-200">
                <div className="relative">
                  <div className="absolute left-[-30px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                  <h3 className="font-medium">Order Placed</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.orderDate)}
                  </p>
                </div>

                {order.user?.payment && (
                  <div className="relative">
                    <div className="absolute left-[-30px] flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <h3 className="font-medium">Payment {paymentInfo.label}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.user?.payment.createdAt)}
                    </p>
                  </div>
                )}

                {order.status === "SHIPPED" && (
                  <div className="relative">
                    <div className="absolute left-[-30px] flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Truck className="w-3 h-3" />
                    </div>
                    <h3 className="font-medium">Order Shipped</h3>
                    <p className="text-sm text-gray-500">
                      Your order is on its way
                    </p>
                  </div>
                )}

                {order.status === "COMPLETED" && (
                  <div className="relative">
                    <div className="absolute left-[-30px] flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <h3 className="font-medium">Order Completed</h3>
                    <p className="text-sm text-gray-500">
                      Your order has been delivered
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                <p className="font-mono">{order.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Order Date
                </h3>
                <p>{formatDate(order.orderDate)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Badge variant={statusInfo.variant} className="mt-1">
                  {order.status || "Processing"}
                </Badge>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Payment Method
                </h3>
                <p className="capitalize">
                  {order.user?.payment?.paymentMethod || "Credit Card"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Payment Status
                </h3>
                <Badge variant={paymentInfo.variant} className="mt-1">
                  {paymentInfo.label}
                </Badge>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>{formatPrice(order.product.price * order.quantity)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>

              {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                <Button className="w-full mt-4" asChild>
                  <Link to={`/contact?orderId=${order.id}`}>
                    Contact Support
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
