import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status?: string;
  product: {
    name: string;
    price: number;
    images?: { imageUrl?: string }[];
  };
}

interface RecentOrdersTableProps {
  orders: Order[];
  loading: boolean;
}

const RecentOrdersTable = ({ orders, loading }: RecentOrdersTableProps) => {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="mb-4 text-muted-foreground">No orders yet</p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Orders</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/user/orders">View All</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
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
              <TableCell>{order.product.name}</TableCell>
              <TableCell>{formatPrice(order.totalPrice)}</TableCell>
              <TableCell>
                {new Date(order.orderDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "COMPLETED" ? "default" : "outline"}
                >
                  {order.status || "Processing"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/orders/${order.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrdersTable;
