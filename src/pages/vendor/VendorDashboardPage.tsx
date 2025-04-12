import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Loader2, Bell, Check } from "lucide-react";
import VendorOverview from "../../components/vendor/VendorOverview";
import VendorProducts from "../../components/vendor/VendorProducts";
import VendorOrders from "../../components/vendor/VendorOrders";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

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

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  monthlySales: { month: string; sales: number }[];
  categoryDistribution: { name: string; value: number }[];
}

const VendorDashboardPage = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!token) return;
    fetchDashboardData();
  }, [backendUrl, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsResponse = await axios.get(
        `${backendUrl}/api/vendor/getProducts`,
        {
          headers: { Authorization: token },
        }
      );

      if (productsResponse.data.success) {
        setProducts(productsResponse.data.products || []);
      }

      // Fetch orders
      const ordersResponse = await axios.get(`${backendUrl}/api/order/orders`, {
        headers: { Authorization: token },
      });

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.orders || []);
        console.log(ordersResponse.data.orders);
      }

      // Fetch notifications
      const notificationsResponse = await axios.get(
        `${backendUrl}/api/notification/vendor/notifications`,
        {
          headers: { Authorization: token },
        }
      );

      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.notifications || []);
      }

      // Calculate stats
      calculateStats(
        productsResponse.data.products || [],
        ordersResponse.data.orders || []
      );
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productData: Product[], orderData: Order[]) => {
    // Count total products
    const totalProducts = productData.length;

    // Count low stock products (less than 5 items)
    const lowStockProducts = productData.filter((p) => p.stock < 5).length;

    // Count total orders
    const totalOrders = orderData.length;

    // Calculate total revenue
    const totalRevenue = orderData.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Group sales by month
    const monthlyData: Record<string, number> = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    orderData.forEach((order) => {
      const date = new Date(order.orderDate);
      const monthKey = months[date.getMonth()];
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.totalPrice;
    });

    const monthlySales = Object.entries(monthlyData).map(([month, sales]) => ({
      month,
      sales,
    }));

    // Group products by category
    const categoryData: Record<string, number> = {};
    productData.forEach((product) => {
      const category = product.category;
      categoryData[category] = (categoryData[category] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryData).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    setStats({
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      monthlySales,
      categoryDistribution,
    });
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    if (!token) return;

    try {
      const response = await axios.put(
        `${backendUrl}/api/vendor/updateOrderStatus`,
        { status },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${status}`);

        // Update order in state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Vendor Dashboard</h1>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <VendorOverview stats={stats} orders={orders} />
        </TabsContent>

        <TabsContent value="products">
          <VendorProducts products={products} />
        </TabsContent>

        <TabsContent value="orders">
          <VendorOrders
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              {unreadNotifications > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
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
                            <Check className="w-4 h-4 mr-1" />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDashboardPage;
