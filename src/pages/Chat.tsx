import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import ChatWindow from "../components/chat/ChatWindow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Loader2 } from "lucide-react";

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  role: string;
  companyName?: string;
}

const Chat = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = searchParams.get("userId");

  useEffect(() => {
    if (token) {
      fetchChatUsers();
    }
  }, [token]);

  useEffect(() => {
    if (userId && chatUsers.length > 0) {
      const user = chatUsers.find((u) => u.id === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [userId, chatUsers]);

  const fetchChatUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/chat/users`, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        setChatUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
      toast.error("Failed to load chat users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatUsers.map((user) => (
                <div key={user.id}>
                  <button
                    className={`w-full p-3 text-left transition-colors rounded-lg hover:bg-muted ${
                      selectedUser?.id === user.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="object-cover w-full h-full rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xl font-semibold text-white rounded-full bg-primary">
                            {user.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.role === "VENDOR"
                            ? user.companyName || "Vendor"
                            : "Service Provider"}
                        </p>
                      </div>
                    </div>
                  </button>
                  <Separator className="my-2" />
                </div>
              ))}
              {chatUsers.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No conversations yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedUser ? (
            <ChatWindow
              receiverId={selectedUser.id}
              receiverName={selectedUser.name}
              receiverImage={selectedUser.profileImage}
            />
          ) : (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
