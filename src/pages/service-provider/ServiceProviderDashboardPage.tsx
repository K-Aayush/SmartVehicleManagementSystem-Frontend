import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Bell, Check, Loader2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ServiceProviderMap from "../../components/map/ServiceProviderMap";

interface EmergencyRequest {
  id: string;
  userId: string;
  vehicleId: string;
  assistanceType: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  user: {
    name: string;
    phone: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
  distance?: number;
}

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const ServiceProviderDashboardPage = () => {
  const { userData, token, backendUrl } = useContext(AppContext);
  const [emergencyRequests, setEmergencyRequests] = useState<
    EmergencyRequest[]
  >([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get current location and fetch nearby requests
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const requestsResponse = await axios.get(
          `${backendUrl}/api/emergency/nearby-requests`,
          {
            params: { latitude, longitude, radius: 10 },
            headers: { Authorization: token },
          }
        );

        if (requestsResponse.data.success) {
          setEmergencyRequests(requestsResponse.data.requests);
        }
      });

      // Fetch notifications
      const notificationsResponse = await axios.get(
        `${backendUrl}/api/notification/notifications`,
        {
          headers: { Authorization: token },
        }
      );

      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.notifications);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {userData?.name}!</h1>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
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
          <Card>
            <CardHeader>
              <CardTitle>Your Location</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ServiceProviderMap />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Emergency Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {emergencyRequests.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No emergency requests nearby
                </p>
              ) : (
                <div className="space-y-4">
                  {emergencyRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {request.user.name} - {request.assistanceType}
                        </h3>
                        <Badge>{request.status}</Badge>
                      </div>
                      <p>
                        Vehicle: {request.vehicle.year} {request.vehicle.brand}{" "}
                        {request.vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.description}
                      </p>
                      <p className="mt-2 text-sm">
                        Distance: {request.distance?.toFixed(2)}km away
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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

export default ServiceProviderDashboardPage;
