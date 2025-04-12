import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ShoppingBag, CreditCard, Bell, Package } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import RecentOrdersTable from "../../components/user/RecentOrdersTable";
import NotificationsList from "../../components/user/NotificationsList";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  product: {
    name: string;
    price: number;
    images?: { imageUrl?: string }[];
  };
}

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const UserDashboardPage = () => {
  const { userData, token, backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent orders
      const ordersResponse = await axios.get(`${backendUrl}/api/order/orders`, {
        headers: { Authorization: token },
      });

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.orders || []);
      }

      // Fetch notifications
      const notificationsResponse = await axios.get(
        `${backendUrl}/api/notifications`,
        {
          headers: { Authorization: token },
        }
      );

      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.notifications || []);
      }

      // Fetch payment history
      const paymentsResponse = await axios.get(
        `${backendUrl}/api/payment/payment-history`,
        {
          headers: { Authorization: token },
        }
      );

      if (paymentsResponse.data.success) {
        setPayments(paymentsResponse.data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
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

  // Calculate total spent
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {userData?.name}!</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Lifetime orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((n) => !n.isRead).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unread notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Recent Purchases
            </CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.slice(0, 5).length}
            </div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="p-4 border rounded-md">
          <RecentOrdersTable orders={orders.slice(0, 5)} loading={loading} />
        </TabsContent>
        <TabsContent value="notifications" className="p-4 border rounded-md">
          <NotificationsList
            notifications={notifications.slice(0, 5)}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardPage;
