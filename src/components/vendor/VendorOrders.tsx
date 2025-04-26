import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status?: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  product: {
    name: string;
    category: string;
    price: number;
  };
}

interface VendorOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: string) => Promise<void>;
}

const VendorOrders = ({ orders, onUpdateStatus }: VendorOrdersProps) => {
  const [orderStatusUpdating, setOrderStatusUpdating] = useState<string | null>(
    null
  );

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    setOrderStatusUpdating(orderId);
    await onUpdateStatus(orderId, status);
    setOrderStatusUpdating(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "COMPLETED" ? "default" : "outline"
                    }
                  >
                    {order.status || "PROCESSING"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status || "PROCESSING"}
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value)
                    }
                    disabled={orderStatusUpdating === order.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shiffed</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VendorOrders;
