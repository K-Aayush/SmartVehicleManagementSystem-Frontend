import { Bell, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead?: (id: string) => void;
}

const NotificationsList = ({
  notifications,
  loading,
  onMarkAsRead,
}: NotificationsListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Bell className="w-12 h-12 mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Notifications</h3>
        <Button variant="outline" size="sm" asChild>
          <a href="/user/notifications">View All</a>
        </Button>
      </div>

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
                <p className={`${!notification.isRead ? "font-medium" : ""}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-blue-500"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark as read
                </Button>
              )}
            </div>
            {index < notifications.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsList;
