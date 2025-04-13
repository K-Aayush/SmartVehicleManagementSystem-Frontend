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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

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
        `${backendUrl}/api/notification/notifications`,
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

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/notification/notifications/${notificationId}`,
        { isRead: true },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/notification/notifications/mark-all-read`,
        {},
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to update notifications");
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
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

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
            <div className="text-2xl font-bold">{unreadNotifications}</div>
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
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="p-4 border rounded-md">
          <RecentOrdersTable orders={orders.slice(0, 5)} loading={loading} />
        </TabsContent>

        <TabsContent value="notifications" className="p-4 border rounded-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Notifications</h3>
              {unreadNotifications > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          notification.isRead
                            ? "bg-muted"
                            : "bg-blue-100 dark:bg-blue-900"
                        }`}
                      >
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`${
                            !notification.isRead ? "font-medium" : ""
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-500"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                    {index < notifications.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="p-4 border rounded-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Payments</h3>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No payment history yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Method</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="px-4 py-2">
                          {payment.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-2">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-4 py-2">{payment.paymentMethod}</td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              payment.status === "COMPLETED"
                                ? "default"
                                : payment.status === "PENDING"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardPage;
